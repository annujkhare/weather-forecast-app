import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.OPENWEATHER_API_KEY;

const weatherCache = new Map();

const CACHE_DURATION = 5 * 60 * 1000;

app.use(cors());
app.use(express.json());

app.get("/api/weather", async (req, res) => {
  const city = String(req.query.city || "").trim();

  if (!city) {
    return res.status(400).json({
      success: false,
      message: "Please enter a city name."
    });
  }

  // Check API key
  if (!API_KEY) {
    return res.status(500).json({
      success: false,
      message: "Weather API key is not configured on the server."
    });
  }

  const cacheKey = city.toLowerCase();

  const cached = weatherCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`Cache hit: ${city}`);

    return res.json({
      success: true,
      data: cached.data,
      cached: true
    });
  }

  console.log(`Fetching fresh data: ${city}`);

  try {
    const params = new URLSearchParams({
      q: city,
      appid: API_KEY,
      units: "metric"
    });

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?${params}`
    );

    const data = await response.json();

    if (!response.ok) {
      const message =
        data?.message === "city not found"
          ? "City not found. Please check the city name."
          : "Unable to fetch weather data right now.";

      return res.status(response.status).json({
        success: false,
        message
      });
    }

    const current = data.list[0];

    const forecast = data.list
      .filter((item) => item.dt_txt.includes("12:00:00"))
      .slice(0, 5)
      .map((item) => ({
        date: item.dt_txt.split(" ")[0],
        temperature: Math.round(item.main.temp),
        feelsLike: Math.round(item.main.feels_like),
        condition: item.weather[0].main,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed
      }));

  
    const weatherData = {
      city: data.city.name,
      country: data.city.country,

      current: {
        temperature: Math.round(current.main.temp),
        feelsLike: Math.round(current.main.feels_like),
        condition: current.weather[0].main,
        description: current.weather[0].description,
        icon: current.weather[0].icon,
        humidity: current.main.humidity,
        windSpeed: current.wind.speed,
        pressure: current.main.pressure,
        visibility: current.visibility
          ? Math.round(current.visibility / 1000)
          : null
      },

      forecast
    };

   

    weatherCache.set(cacheKey, {
      data: weatherData,
      timestamp: Date.now()
    });

    return res.json({
      success: true,
      data: weatherData,
      cached: false
    });

  } catch (error) {
    console.error("Weather API error:", error);

    return res.status(502).json({
      success: false,
      message:
        "Weather service is temporarily unavailable. Please try again."
    });
  }
});

// Unknown route handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found."
  });
});

app.listen(PORT, () => {
  console.log(`Weather server running on http://localhost:${PORT}`);
});