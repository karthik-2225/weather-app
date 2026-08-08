import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Replace with your OpenWeather API key
  const API_KEY = process.env.REACT_APP_API_KEY;

  const getWeather = async () => {
    if (city.trim() === "") return;

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&appid=${API_KEY}&units=metric`
      );

      setWeather(response.data);
    } catch (err) {
      setWeather(null);

      if (err.response?.status === 401) {
        setError("Invalid or Inactive API Key");
      } else if (err.response?.status === 404) {
        setError("City not found");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="weather-card">
        <h1>🌤 Weather App</h1>

        <div className="search-box">
          <input
            type="text"
            placeholder="Enter City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                getWeather();
              }
            }}
          />

          <button onClick={getWeather}>Search</button>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {loading && <p>Loading...</p>}

        {weather && (
          <div className="weather-info">
            <h2>
              {weather.name}, {weather.sys.country}
            </h2>

            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="Weather Icon"
            />

            <h1>{Math.round(weather.main.temp)}°C</h1>

            <p>{weather.weather[0].description}</p>

            <div className="details">
              <p>🌡 Feels Like: {Math.round(weather.main.feels_like)}°C</p>
              <p>💧 Humidity: {weather.main.humidity}%</p>
              <p>💨 Wind: {weather.wind.speed} m/s</p>
              <p>📈 Pressure: {weather.main.pressure} hPa</p>
              <p>👁 Visibility: {weather.visibility / 1000} km</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;