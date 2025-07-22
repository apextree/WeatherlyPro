import "./About.css";

function About() {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About Weatherly</h1>
        <p>Your comprehensive weather dashboard for informed decisions</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>🌟 What is Weatherly?</h2>
          <p>
            Weatherly is a modern, feature-rich weather application designed to provide 
            you with accurate and detailed weather information. Whether you're planning 
            your day, week, or looking for weather in different cities around the world, 
            Weatherly has you covered.
          </p>
        </section>

        <section className="about-section">
          <h2>✨ Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏠</div>
              <h3>Dashboard</h3>
              <p>Get comprehensive weather information for your current location with 14-day forecasts, charts, and air quality data.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Global Search</h3>
              <p>Search weather information for any city worldwide with detailed current conditions and 7-day forecasts.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Interactive Charts</h3>
              <p>Visual temperature trends and rain probability charts to help you understand weather patterns.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Real-time Updates</h3>
              <p>Stay up-to-date with the latest weather conditions and forecasts from reliable weather services.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Responsive Design</h3>
              <p>Enjoy a seamless experience across all devices - desktop, tablet, and mobile.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌡️</div>
              <h3>Detailed Metrics</h3>
              <p>Access comprehensive weather data including temperature, humidity, wind speed, and air quality.</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>🛠️ Technology Stack</h2>
          <div className="tech-stack">
            <div className="tech-item">
              <strong>Frontend:</strong> React.js with modern hooks and routing
            </div>
            <div className="tech-item">
              <strong>Charts:</strong> Chart.js for interactive data visualization
            </div>
            <div className="tech-item">
              <strong>API:</strong> WeatherAPI for accurate weather data
            </div>
            <div className="tech-item">
              <strong>Styling:</strong> Modern CSS with responsive design principles
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>📍 Data Sources</h2>
          <p>
            Weatherly utilizes reliable weather data from WeatherAPI, providing accurate 
            current conditions, forecasts, and historical weather information. The app 
            also uses geolocation services to automatically detect your current location 
            for personalized weather updates.
          </p>
        </section>

        <section className="about-section">
          <h2>🎯 Mission</h2>
          <p>
            Our mission is to make weather information accessible, beautiful, and actionable. 
            We believe that good design and accurate data can help people make better decisions 
            about their daily activities, travel plans, and outdoor adventures.
          </p>
        </section>

        <section className="about-section contact-section">
          <h2>📧 Contact</h2>
          <p>
            Have questions, suggestions, or feedback? We'd love to hear from you! 
            Weatherly is constantly evolving to meet our users' needs.
          </p>
          <div className="contact-info">
            <p><strong>Version:</strong> 1.0.0</p>
            <p><strong>Last Updated:</strong> {new Date().getFullYear()}</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About; 