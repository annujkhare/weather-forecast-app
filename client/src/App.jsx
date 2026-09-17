import { useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function formatDate(dateString) {
  return new Date(`${dateString}T12:00:00`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
}

function WeatherIcon({ icon, alt }) {
  return (
    <img
      className="weather-icon"
      src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
      alt={alt}
    />
  );
}

function App() {
  const [cityInput, setCityInput] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function searchWeather(event) {
    event?.preventDefault();

    const city = cityInput.trim();

    if (!city) {
      setError("Please enter a city name.");
      setWeather(null);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/weather?city=${encodeURIComponent(city)}`
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to fetch weather data.");
      }

      setWeather(result.data);
    } catch (err) {
      setWeather(null);
      setError(
        err.message ||
          "Something went wrong. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app">
      <section className="weather-container">
        <header className="header">
          <p className="eyebrow">WEATHER FORECAST</p>
          <h1>Weather Forecast</h1>
          <p className="subtitle">
            Search for a city to view current weather and the forecast.
          </p>
        </header>

        <form className="search-form" onSubmit={searchWeather}>
          <input
            type="text"
            value={cityInput}
            onChange={(event) => setCityInput(event.target.value)}
            placeholder="Enter city name"
            aria-label="City name"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && (
          <div className="error" role="alert">
            {error}
          </div>
        )}

        {loading && (
          <div className="loading" aria-live="polite">
            Loading weather data...
          </div>
        )}

        {weather && !loading && (
          <section className="weather-content">
            <div className="location">
              <h2>
                {weather.city}, {weather.country}
              </h2>
            </div>

            <article className="current-card">
              <div className="current-main">
                <WeatherIcon
                  icon={weather.current.icon}
                  alt={weather.current.description}
                />
                <div>
                  <div className="temperature">
                    {weather.current.temperature}°C
                  </div>
                  <p className="condition">
                    {weather.current.condition}
                  </p>
                  <p className="description">
                    {weather.current.description}
                  </p>
                </div>
              </div>

              <div className="details">
                <div>
                  <span>Feels like</span>
                  <strong>{weather.current.feelsLike}°C</strong>
                </div>
                <div>
                  <span>Humidity</span>
                  <strong>{weather.current.humidity}%</strong>
                </div>
                <div>
                  <span>Wind</span>
                  <strong>{weather.current.windSpeed} m/s</strong>
                </div>
                <div>
                  <span>Pressure</span>
                  <strong>{weather.current.pressure} hPa</strong>
                </div>
                <div>
                  <span>Visibility</span>
                  <strong>
                    {weather.current.visibility !== null
                      ? `${weather.current.visibility} km`
                      : "N/A"}
                  </strong>
                </div>
              </div>
            </article>

            <h2 className="forecast-title">5-Day Forecast</h2>

            <div className="forecast-grid">
              {weather.forecast.map((day) => (
                <article className="forecast-card" key={day.date}>
                  <h3>{formatDate(day.date)}</h3>
                  <WeatherIcon
                    icon={day.icon}
                    alt={day.description}
                  />
                  <strong>{day.temperature}°C</strong>
                  <p>{day.condition}</p>
                  <small>{day.description}</small>
                </article>
              ))}
            </div>
          </section>
        )}

        {!weather && !loading && !error && (
          <div className="empty-state">
            <h2>Check the weather</h2>
            <p>Enter a city name above to get the forecast.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
