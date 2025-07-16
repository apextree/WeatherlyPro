import "./App.css";
import { useState, useEffect } from "react";
// import { getUserLocation } from "./locationFinder";
const API_KEY = import.meta.env.VITE_APP_API_KEY;

function App() {
  const [Weatherdata, setWeatherdata] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [rainFilter, setRainFilter] = useState("");
  const baseUrl = "http://api.weatherapi.com/v1";
  const apiKey = API_KEY;
  const endpoint = "/forecast.json";
  const [location, setLocation] = useState("Newark"); // default fallback

  async function getUserCity() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation not supported");
        return;
      }
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        // Use a free reverse geocoding API (here using BigDataCloud as an example)
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const data = await response.json();
        resolve(data.city || data.locality || data.principalSubdivision || "Newark");
      }, (err) => {
        reject(err);
      });
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
      .then(city => setLocation(city))
      .catch(() => setLocation("Newark")); // fallback if denied or error
  }, []);

  useEffect(() => {
    if (location) {
      fetchWeather();
    }
  }, [location]);

  // Filter forecast days based on search term and rain chance
  const getFilteredForecast = () => {
    if (!Weatherdata) return [];
    let filtered = Weatherdata.forecast.forecastday;
    if (searchTerm.trim()) {
      filtered = filtered.filter((day) => {
        const dateStr = day.date;
        const dayName = new Date(day.date).toLocaleDateString('en-US', {weekday: 'long'});
        return (
          dateStr.includes(searchTerm) ||
          dayName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }
    if (rainFilter) {
      const [min, max] = rainFilter.split('-').map(Number);
      filtered = filtered.filter((day) => {
        const rain = Number(day.day.daily_chance_of_rain);
        return rain >= min && rain < max;
      });
    }
    return filtered;
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
                  <p>{Weatherdata.current.temp_f}°F
                  <img className="today-weather-icon"
                    src={Weatherdata.forecast.forecastday[0].day.condition.icon}
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
              <div className="forecast-weather-container">
                {/* Search bar and rain filter for forecast */}
                <div className="forecast-controls">
                  <input
                    type="text"
                    placeholder="Search date or day"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="forecast-search-input"
                  />
                  <select
                    value={rainFilter}
                    onChange={e => setRainFilter(e.target.value)}
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
                  <div className="forecast-weather-item" key={day.date}>
                    <p>{day.date}</p>
                    <p>{new Date(day.date).toLocaleDateString('en-US', {weekday: 'long'})}</p>
                    <p>{day.day.condition.text}</p>
                    <p>{day.day.maxtemp_f}°F</p>
                    <p>{day.day.mintemp_f}°F</p>
                    <p>{day.day.daily_chance_of_rain} %</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default App;