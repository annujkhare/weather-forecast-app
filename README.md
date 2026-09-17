# Weather Forecast Application

A React + Node.js + Express weather forecast application using the OpenWeatherMap API.

## Requirements implemented

- React.js frontend
- Node.js + Express.js backend
- OpenWeatherMap external API integration
- `async/await`
- Backend proxy for API-key security
- Error and fallback handling
- Dynamic React UI updates
- Environment-based configuration

Optional caching is not included because it is not required.

## Project structure

```text
weather-forecast-app/
├── client/
└── server/
```

## 1. Get an OpenWeatherMap API key

Create an account at OpenWeatherMap and obtain an API key.

## 2. Start the backend

```bash
cd server
npm install
```

Copy `.env.example` to `.env` and set:

```env
PORT=5000
OPENWEATHER_API_KEY=your_api_key
```

Then:

```bash
npm run dev
```

The backend runs at:

```text
http://localhost:5000
```

## 3. Start the frontend

Open another terminal:

```bash
cd client
npm install
```

Copy `.env.example` to `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Then:

```bash
npm run dev
```

Open the Vite URL shown in the terminal.

## API endpoint

```text
GET /api/weather?city=Bhopal
```

The frontend calls only the Express backend. The OpenWeatherMap API key remains on the server.

## Error handling

The backend handles:

- Missing city
- Missing API key
- City-not-found responses
- OpenWeatherMap API errors
- Network/API failures
- Unknown backend routes

The frontend displays the returned error and removes stale weather data when a new request fails.
