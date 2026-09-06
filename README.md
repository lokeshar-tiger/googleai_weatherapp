# Weather Intelligence App

A modern, high-precision Weather Intelligence and 7-day forecast web application built with React, TypeScript, Tailwind CSS, and Recharts, powered exclusively by public **Open-Meteo** APIs.

## Features

- **City Geocoding & Search**: Instant worldwide city resolution via Open-Meteo Geocoding API (`https://geocoding-api.open-meteo.com/v1/search`), with multi-location disambiguation and recent search memory.
- **Current Meteorological Telemetry**: Real-time temperature, "feels like" apparent temperature, weather condition codes (WMO standard), wind speed, wind gusts, compass wind direction, humidity, barometric pressure, UV index, and precipitation.
- **7-Day Daily Forecast**: High/low temperature ranges with visual proportional gradient bars, precipitation probability, daily rain sums, peak wind gusts, UV index, and sunrise/sunset timings.
- **24-Hour Hourly Progression**: Interactive carousel displaying hour-by-hour temperature trajectories and rain probabilities.
- **Multi-Metric Forecast Visualizations**: Interactive Recharts graphs with toggles for:
  - 7-Day Temperature Trends (Highs vs Lows Area Chart)
  - Daily Precipitation Probability & Rain Sum (Bar Chart)
  - Maximum Wind Speeds & Gust Trajectories (Line Chart)
- **Deterministic Planning & Activity Intelligence**: Actionable recommendations derived mathematically from meteorological parameters:
  - Outdoor fitness & activity advisories (running, cycling, hiking)
  - Clothing & rain protection guidance (layers, thermal insulation, umbrella necessity)
  - Sun & UV radiation safety (SPF ratings, peak midday exposure windows)
  - Commute & road hazard warnings (wet pavement, crosswinds, visibility limits)
- **Graceful Error Handling**: Helpful messaging and city suggestions for invalid searches, network disruptions, or missing coordinates.
- **Units Toggle**: Seamless conversion between Metric (°C, km/h) and Imperial (°F, mph) with local storage persistence.
- **Fully Public & Cloudflare Pages Ready**: Zero private API keys, zero authentication barriers, and standard static output (`dist/`).

## APIs Used

1. **Open-Meteo Geocoding API**:
   - URL: `https://geocoding-api.open-meteo.com/v1/search`
   - Purpose: Converts city query into latitude, longitude, country, state, and timezone.
2. **Open-Meteo Forecast API**:
   - URL: `https://api.open-meteo.com/v1/forecast`
   - Purpose: Fetches current conditions, hourly forecasts, and 7-day daily forecasts.

## Getting Started

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
The application will be accessible at `http://localhost:3000`.

### Production Build (Cloudflare Pages compatible)
```bash
npm run build
```
The compiled static assets will be output to the `dist/` directory, ready to be deployed directly to Cloudflare Pages, Vercel, Netlify, or any static host.


## Deployment Instructions

### Google AI Studio to GitHub

1. Build and test the Weather Intelligence App in Google AI Studio App Build.
2. Use the direct GitHub connection in Google AI Studio to connect the generated app to the approved GitHub repository.
3. Verify that the generated application source, `package.json`, and `README.md` are present in the GitHub repository.

### GitHub to Cloudflare Pages

1. Open Cloudflare Workers & Pages and create a Pages project using the GitHub repository connected through Google AI Studio.
2. Select the GitHub repository and the production branch.
3. Configure the build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Save and deploy the application.
5. Open the generated `pages.dev` URL to validate the deployment.

### Deployment Validation

1. Test the application with at least two valid cities.
2. Test an invalid city or API error condition.
3. Refresh the browser and confirm the application continues to load.
