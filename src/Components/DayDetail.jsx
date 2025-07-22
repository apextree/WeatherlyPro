import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import './DayDetail.css'
const API_KEY = import.meta.env.VITE_APP_API_KEY

function DayDetail() {
  const { day } = useParams()
  const [searchParams] = useSearchParams()
  const selectedDate = searchParams.get('date')
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDayDetails = async () => {
      try {
        setLoading(true)
        const queryDate = selectedDate || new Date().toISOString().split('T')[0]
        const response = await fetch(
          `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${day}&days=1&aqi=yes&alerts=yes&dt=${queryDate}`
        )
        const data = await response.json()
        if (response.ok) {
          setWeatherData(data)
        } else {
          setError(data.error?.message || 'Failed to fetch weather data')
        }
      } catch (err) {
        setError('Failed to fetch weather data')
        console.error('Error fetching weather data:', err)
      } finally {
        setLoading(false)
      }
    }

    if (day) {
      fetchDayDetails()
    }
  }, [day, selectedDate])

  const renderTemperatureChart = () => {
    if (!weatherData?.forecast?.forecastday?.[0]?.hour) return null

    const hourlyData = weatherData.forecast.forecastday[0].hour
    const maxTemp = Math.max(...hourlyData.map(h => h.temp_f))
    const minTemp = Math.min(...hourlyData.map(h => h.temp_f))
    const tempRange = maxTemp - minTemp || 1

    const chartWidth = 500
    const chartHeight = 180
    const padding = 40

    const points = hourlyData.map((hour, index) => {
      const x = padding + (index * (chartWidth - 2 * padding)) / 23
      const y = chartHeight - padding - ((hour.temp_f - minTemp) / tempRange) * (chartHeight - 2 * padding)
      return `${x},${y}`
    }).join(' ')

    return (
      <div className="temperature-chart">
        <h3>24-Hour Temperature Trend</h3>
        <svg width={chartWidth} height={chartHeight + 40} className="chart-svg">
          {[0, 6, 12, 18, 24].map(hour => (
            <g key={hour}>
              <line
                x1={padding + (hour * (chartWidth - 2 * padding)) / 24}
                y1={padding}
                x2={padding + (hour * (chartWidth - 2 * padding)) / 24}
                y2={chartHeight - padding}
                stroke="#e0e0e0"
                strokeWidth="1"
              />
              <text
                x={padding + (hour * (chartWidth - 2 * padding)) / 24}
                y={chartHeight - padding + 20}
                textAnchor="middle"
                fontSize="11"
                fill="#1a1a1a"
              >
                {hour}:00
              </text>
            </g>
          ))}
          
          <polyline
            fill="none"
            stroke="#ff6b6b"
            strokeWidth="3"
            points={points}
          />
          
          {hourlyData.map((hour, index) => {
            const x = padding + (index * (chartWidth - 2 * padding)) / 23
            const y = chartHeight - padding - ((hour.temp_f - minTemp) / tempRange) * (chartHeight - 2 * padding)
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="3"
                  fill="#ff6b6b"
                />
                {index % 4 === 0 && (
                  <text
                    x={x}
                    y={y - 8}
                    textAnchor="middle"
                    fontSize="9"
                    fill="#1a1a1a"
                  >
                    {Math.round(hour.temp_f)}°
                  </text>
                )}
              </g>
            )
          })}
          
          <text x={15} y={padding + 5} textAnchor="middle" fontSize="11" fill="#1a1a1a">
            {Math.round(maxTemp)}°F
          </text>
          <text x={15} y={chartHeight - padding + 5} textAnchor="middle" fontSize="11" fill="#1a1a1a">
            {Math.round(minTemp)}°F
          </text>
        </svg>
      </div>
    )
  }

  if (loading) {
    return <div className="day-detail-container loading">Loading weather details...</div>
  }

  if (error) {
    return <div className="day-detail-container error">Error: {error}</div>
  }

  if (!weatherData?.forecast?.forecastday?.[0]) {
    return <div className="day-detail-container error">No weather data available for this location</div>
  }

  const dayData = weatherData.forecast.forecastday[0]
  const currentData = weatherData.current

  const parseLocalDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  return (
    <div className="day-detail-container">
      <div className="day-detail-header">
        <h1>{weatherData.location.name} on {parseLocalDate(dayData.date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</h1>
      </div>

      <div className="main-content-layout">
        <div className="weather-stats-grid">
          <div className="stat-card">
            <h3>Current Temperature</h3>
            <div className="stat-value">
              {currentData.temp_f}°F
              <img 
                src={dayData.day.condition.icon} 
                alt={dayData.day.condition.text}
                className="weather-icon"
              />
            </div>
            <p className="stat-description">{dayData.day.condition.text}</p>
          </div>

          <div className="stat-card">
            <h3>Average Temperature</h3>
            <div className="stat-value">{dayData.day.avgtemp_f}°F</div>
          </div>

          <div className="stat-card">
            <h3>Temperature Range</h3>
            <div className="stat-value">
              {dayData.day.maxtemp_f}°F / {dayData.day.mintemp_f}°F
            </div>
            <p className="stat-description">High / Low</p>
          </div>

          <div className="stat-card">
            <h3>Feels Like</h3>
            <div className="stat-value">{currentData.feelslike_f}°F</div>
          </div>

          <div className="stat-card">
            <h3>Humidity</h3>
            <div className="stat-value">{currentData.humidity}%</div>
          </div>

          <div className="stat-card">
            <h3>Precipitation</h3>
            <div className="stat-value">
              {dayData.day.totalprecip_in}"
            </div>
            <p className="stat-description">{dayData.day.daily_chance_of_rain}% chance</p>
          </div>

          <div className="stat-card">
            <h3>Wind</h3>
            <div className="stat-value">{currentData.wind_mph} mph</div>
            <p className="stat-description">{currentData.wind_dir}</p>
          </div>

          <div className="stat-card">
            <h3>UV Index</h3>
            <div className="stat-value">{dayData.day.uv}</div>
          </div>

          <div className="stat-card">
            <h3>Air Quality (PM2.5)</h3>
            <div className="stat-value">{Math.round(dayData.day.air_quality?.pm2_5 || 0)}</div>
            <p className="stat-description">µg/m³</p>
          </div>

          <div className="stat-card">
            <h3>Visibility</h3>
            <div className="stat-value">{currentData.vis_miles} mi</div>
          </div>

          <div className="stat-card">
            <h3>Pressure</h3>
            <div className="stat-value">{currentData.pressure_in}"</div>
            <p className="stat-description">Hg</p>
          </div>

          <div className="stat-card">
            <h3>Cloud Cover</h3>
            <div className="stat-value">{currentData.cloud}%</div>
          </div>
        </div>

        <div className="chart-section">
          {renderTemperatureChart()}
        </div>
      </div>
    </div>
  )
}

export default DayDetail




