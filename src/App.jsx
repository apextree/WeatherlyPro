import "./App.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const API_KEY = import.meta.env.VITE_APP_API_KEY;

function App() {
  const [Weatherdata, setWeatherdata] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [rainFilter, setRainFilter] = useState("");
  const baseUrl = "http://api.weatherapi.com/v1";
  const apiKey = API_KEY;
  const endpoint = "/forecast.json";
  const [location, setLocation] = useState("London");

  async function getUserCity() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation not supported");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          resolve(
            data.city || data.locality || data.principalSubdivision || "Newark"
          );
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  const url = `${baseUrl}${endpoint}?key=${apiKey}&q=${location}&days=14&aqi=yes`;

  const fetchWeather = async () => {
    const response = await fetch(url);
    const data = await response.json();
    setWeatherdata(data);
  };

  useEffect(() => {
    getUserCity()
      .then((city) => setLocation(city))
      .catch(() => setLocation("Newark"));
  }, []);

  useEffect(() => {
    if (location) {
      fetchWeather();
    }
  }, [location]);

  const getFilteredForecast = () => {
    if (!Weatherdata) return [];
    let filtered = Weatherdata.forecast.forecastday;
    if (searchTerm.trim()) {
      filtered = filtered.filter((day) => {
        const dateStr = day.date;
        const [year, month, dayNum] = day.date.split('-').map(Number);
        const dayName = new Date(year, month - 1, dayNum).toLocaleDateString("en-US", {
          weekday: "long",
        });
        return (
          dateStr.includes(searchTerm) ||
          dayName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }
    if (rainFilter) {
      const [min, max] = rainFilter.split("-").map(Number);
      filtered = filtered.filter((day) => {
        const rain = Number(day.day.daily_chance_of_rain);
        return rain >= min && rain < max;
      });
    }
    return filtered;
  };

  // Temperature Chart Data
  const getTemperatureChartData = () => {
    if (!Weatherdata?.forecast?.forecastday?.[0]?.hour) return null;
    
    const hourlyData = Weatherdata.forecast.forecastday[0].hour;
    const labels = hourlyData.map(hour => {
      const time = new Date(hour.time);
      return time.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    });
    
    return {
      labels,
      datasets: [
        {
          label: 'Temperature (°F)',
          data: hourlyData.map(hour => hour.temp_f),
          borderColor: '#ff6b6b',
          backgroundColor: 'rgba(255, 107, 107, 0.1)',
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 6,
          borderWidth: 3,
        },
        {
          label: 'Feels Like (°F)',
          data: hourlyData.map(hour => hour.feelslike_f),
          borderColor: '#4ecdc4',
          backgroundColor: 'rgba(78, 205, 196, 0.1)',
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 6,
          borderWidth: 3,
        }
      ]
    };
  };

  // Rain Chart Data
  const getRainChartData = () => {
    if (!Weatherdata?.forecast?.forecastday?.[0]?.hour) return null;
    
    const hourlyData = Weatherdata.forecast.forecastday[0].hour;
    
    // Debug: log the structure to see what properties are available
    console.log("Hourly data sample:", hourlyData[0]);
    
    const labels = hourlyData.map(hour => {
      const time = new Date(hour.time);
      return time.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    });
    
    // Try different possible property names for rain chance
    const rainData = hourlyData.map(hour => {
      return hour.chance_of_rain;
    });
    
    console.log("Rain data:", rainData);
    
    return {
      labels,
      datasets: [
        {
          label: 'Rain Chance (%)',
          data: rainData,
          backgroundColor: 'rgba(74, 144, 226, 0.6)',
          borderColor: '#4a90e2',
          borderWidth: 2,
          borderRadius: 4,
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#1a1a1a',
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1a1a1a',
        bodyColor: '#1a1a1a',
        borderColor: '#1a1a1a',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#1a1a1a',
          maxTicksLimit: 8,
          font: {
            size: 10
          }
        },
        grid: {
          color: 'rgba(26, 26, 26, 0.1)'
        }
      },
      y: {
        ticks: {
          color: '#1a1a1a',
          font: {
            size: 10
          }
        },
        grid: {
          color: 'rgba(26, 26, 26, 0.1)'
        }
      }
    }
  };

  return (
    <>
      <div className="app-container">
        <div className="location-greeting-container">
          {Weatherdata ? (
            <h1 className="location-greeting">
              Hey {Weatherdata.location.name}!
            </h1>
          ) : (
            <p>Loading weather data...</p>
          )}
        </div>

        <div className="weather-information-container">
          {Weatherdata && (
            <div className="all-weather-container">
              <div className="today-weather-container">
                <div className="today-weather-temperature">
                  <p>
                    {Weatherdata.current.temp_f}°F
                    <img
                      className="today-weather-icon"
                      src={
                        Weatherdata.forecast.forecastday[0].day.condition.icon
                      }
                      alt="weather icon"
                    />
                  </p>
                </div>

                <div className="today-weather-summary-container">
                  <p className="today-weather-summary-text">
                    {Weatherdata.forecast.forecastday[0].day.condition.text}
                  </p>
                  <div className="today-weather-summary-air-quality">
                    {" "}
                    Air Quality:{" "}
                    {Math.round(
                      Weatherdata.forecast.forecastday[0].day.air_quality.pm2_5
                    )}{" "}
                  </div>
                  <div className="today-weather-summary-feels-like">
                    {" "}
                    Feels Like: {Weatherdata.current.feelslike_f}°F{" "}
                  </div>
                </div>
              </div>

              <div className="main-content-container">
                <div className="forecast-weather-container">
                  <div className="forecast-controls">
                    <input
                      type="text"
                      placeholder="Search date or day"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="forecast-search-input"
                    />
                    <select
                      value={rainFilter}
                      onChange={(e) => setRainFilter(e.target.value)}
                      className="forecast-rain-filter"
                    >
                      <option value="">All Rain Chances</option>
                      <option value="0-20">0-20%</option>
                      <option value="20-40">20-40%</option>
                      <option value="40-60">40-60%</option>
                      <option value="60-80">60-80%</option>
                      <option value="80-101">80-100%</option>
                    </select>
                  </div>
                  <div className="forecast-weather-header">
                    <p>Date</p>
                    <p>Day</p>
                    <p>Condition</p>
                    <p>Max Temp</p>
                    <p>Min Temp</p>
                    <p>Rain Chance</p>
                  </div>
                  {getFilteredForecast().map((day) => (
                    <Link
                      to={`/dayview/${encodeURIComponent(
                        Weatherdata.location.name
                      )}?date=${day.date}`}
                      className="details-link"
                      key={day.date}
                    >
                      <div className="forecast-weather-item">
                        <p>{day.date}</p>
                        <p>{(() => {
                          const [year, month, dayNum] = day.date.split('-').map(Number);
                          return new Date(year, month - 1, dayNum).toLocaleDateString("en-US", {weekday: "short"});
                        })()}</p>
                        <p>{day.day.condition.text}</p>
                        <p>{day.day.maxtemp_f}°F</p>
                        <p>{day.day.mintemp_f}°F</p>
                        <p>{day.day.daily_chance_of_rain} %</p>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="charts-container">
                  <div className="chart-wrapper">
                    <h3 className="chart-title">Today's Temperature</h3>
                    {getTemperatureChartData() && (
                      <div className="chart-content">
                        <Line 
                          data={getTemperatureChartData()} 
                          options={chartOptions}
                        />
                      </div>
                    )}
                  </div>

                  <div className="chart-wrapper">
                    <h3 className="chart-title">Hourly Rain Chance</h3>
                    {getRainChartData() && (
                      <div className="chart-content">
                        <Bar 
                          data={getRainChartData()} 
                          options={chartOptions}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default App;
