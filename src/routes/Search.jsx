import { useState } from "react";
import "./Search.css";

const API_KEY = import.meta.env.VITE_APP_API_KEY;

function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${searchQuery}&days=7&aqi=yes`
      );
      
      if (!response.ok) {
        throw new Error("City not found");
      }
      
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <h1>Weather Search</h1>
        <p>Search for weather information in any city worldwide</p>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Enter city name (e.g., London, Tokyo, New York)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
        </div>
      )}

      {weatherData && (
        <div className="search-results">
          <div className="result-header">
            <h2>{weatherData.location.name}, {weatherData.location.country}</h2>
            <p className="result-time">
              Local time: {new Date(weatherData.location.localtime).toLocaleString()}
            </p>
          </div>

          <div className="current-weather">
            <div className="current-temp">
              <span className="temp">{weatherData.current.temp_f}°F</span>
              <img 
                src={weatherData.current.condition.icon} 
                alt={weatherData.current.condition.text}
                className="weather-icon"
              />
            </div>
            <div className="current-details">
              <p><strong>Condition:</strong> {weatherData.current.condition.text}</p>
              <p><strong>Feels like:</strong> {weatherData.current.feelslike_f}°F</p>
              <p><strong>Humidity:</strong> {weatherData.current.humidity}%</p>
              <p><strong>Wind:</strong> {weatherData.current.wind_mph} mph</p>
            </div>
          </div>

          <div className="forecast-preview">
            <h3>7-Day Forecast</h3>
            <div className="forecast-grid">
              {weatherData.forecast.forecastday.map((day) => (
                <div key={day.date} className="forecast-card">
                  <p className="forecast-date">
                    {new Date(day.date).toLocaleDateString("en-US", { 
                      weekday: "short", 
                      month: "short", 
                      day: "numeric" 
                    })}
                  </p>
                  <img 
                    src={day.day.condition.icon} 
                    alt={day.day.condition.text}
                    className="forecast-icon"
                  />
                  <p className="forecast-temps">
                    <span className="high">{day.day.maxtemp_f}°</span>
                    <span className="low">{day.day.mintemp_f}°</span>
                  </p>
                  <p className="forecast-condition">{day.day.condition.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search; 