import {
  CurrentWeatherData,
  DayForecastItem,
  PlanningRecommendation
} from '../types/weather';

export function generatePlanningRecommendations(
  current: CurrentWeatherData,
  todayForecast?: DayForecastItem
): PlanningRecommendation[] {
  const recommendations: PlanningRecommendation[] = [];

  const temp = current.temperature_2m;
  const apparentTemp = current.apparent_temperature;
  const humidity = current.relative_humidity_2m;
  const windSpeed = current.wind_speed_10m;
  const windGusts = current.wind_gusts_10m;
  const rainProb = todayForecast?.precipProbability ?? (current.precipitation > 0 ? 90 : 10);
  const uvIndex = current.uv_index ?? todayForecast?.uvIndexMax ?? 0;
  const weatherCode = current.weather_code;

  // 1. OUTDOOR ACTIVITIES & EXERCISE
  let activityStatus: 'optimal' | 'moderate' | 'warning' | 'alert' = 'optimal';
  let activityTitle = 'Favorable for Outdoor Activities';
  let activitySummary = 'Conditions are comfortable for outdoor walking, running, and recreation.';
  let activityDetail = 'Moderate temperatures and clear atmosphere allow enjoyable outdoor sports.';

  const isRaining = (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82);
  const isSnowing = (weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86);
  const isStorm = weatherCode >= 95;

  if (isStorm) {
    activityStatus = 'alert';
    activityTitle = 'Thunderstorm Alert: Avoid Outdoor Activities';
    activitySummary = 'Lightning risk and gusty convective storms are active or forecast.';
    activityDetail = 'Seek indoor shelter immediately. Postpone all outdoor sports, hiking, and open-air gatherings until electrical storm activity passes.';
  } else if (isRaining || rainProb >= 70) {
    activityStatus = 'warning';
    activityTitle = 'Wet Conditions: Indoor Activities Recommended';
    activitySummary = `High rain likelihood (${rainProb}%) and wet surfaces outdoors.`;
    activityDetail = 'Expect slippery footing and periodic showers. If jogging or cycling, stick to paved, well-lit routes or move workouts indoors.';
  } else if (isSnowing) {
    activityStatus = 'warning';
    activityTitle = 'Winter Conditions: Snow & Cold Exposure';
    activitySummary = 'Snowfall and chilled surfaces will impact footing and trail access.';
    activityDetail = 'Suitable for winter sports with appropriate traction gear. Exercise caution on bridges and shaded sidewalks.';
  } else if (apparentTemp >= 35) {
    activityStatus = 'warning';
    activityTitle = 'Extreme Heat Caution: Restrict Midday Exertion';
    activitySummary = `Feels like ${Math.round(apparentTemp)}°C with high thermal stress.`;
    activityDetail = 'Schedule outdoor fitness before 8:00 AM or after sunset. Carry adequate hydration with electrolytes and take frequent shaded breaks.';
  } else if (apparentTemp <= 0) {
    activityStatus = 'warning';
    activityTitle = 'Sub-Zero Chill: Limit Prolonged Exposure';
    activitySummary = `Feels like ${Math.round(apparentTemp)}°C with brisk wind chill.`;
    activityDetail = 'Ensure extremities (hands, ears) are insulated against frostbite risk. Warm up thoroughly before brisk movements.';
  } else if (windSpeed > 35 || windGusts > 50) {
    activityStatus = 'moderate';
    activityTitle = 'Breezy & Gusty: Exercise Caution on Open Trails';
    activitySummary = `Wind gusts up to ${Math.round(windGusts)} km/h may hinder cycling and water activities.`;
    activityDetail = 'Secure loose outdoor items. Boating or paddle sports should be reconsidered due to choppy surface waters.';
  } else {
    activityStatus = 'optimal';
    activityTitle = 'Great Conditions for Outdoor Fitness & Recreation';
    activitySummary = `Pleasant ${Math.round(temp)}°C with low precipitation risk (${rainProb}%).`;
    activityDetail = 'Ideal window for cycling, park visits, outdoor dining, and long-distance running.';
  }

  recommendations.push({
    id: 'rec-activity',
    category: 'activity',
    title: activityTitle,
    summary: activitySummary,
    detail: activityDetail,
    status: activityStatus,
    metricBasis: `Based on: Temp ${Math.round(temp)}°C (feels ${Math.round(apparentTemp)}°C), Rain chance ${rainProb}%, Wind gusts ${Math.round(windGusts)} km/h`
  });

  // 2. CLOTHING & RAIN PROTECTION
  let clothingStatus: 'optimal' | 'moderate' | 'warning' | 'alert' = 'optimal';
  let clothingTitle = 'Standard Comfortable Attire';
  let clothingSummary = 'Standard daytime layers are appropriate.';
  let clothingDetail = 'Light breathable shirt or mild layering.';

  if (rainProb >= 50 || current.precipitation > 0.2 || isRaining) {
    clothingStatus = 'warning';
    clothingTitle = 'Rain Protection Recommended';
    clothingSummary = `Pack an umbrella or waterproof hooded shell (${rainProb}% precipitation chance).`;
    clothingDetail = 'Water-resistant footwear is advised to stay comfortable through puddles and damp transit.';
  } else if (temp < 8) {
    clothingStatus = 'warning';
    clothingTitle = 'Warm Insulation & Outer Coat Required';
    clothingSummary = `Cold temperature (${Math.round(temp)}°C) requires heavy insulation.`;
    clothingDetail = 'Layer with a thermal base, fleece or knit sweater, and a wind-resistant jacket or coat. A warm beanie and scarf are helpful.';
  } else if (temp < 18) {
    clothingStatus = 'moderate';
    clothingTitle = 'Light Jacket or Layered Sweater Recommended';
    clothingSummary = `Mild cool air (${Math.round(temp)}°C) feels brisk during morning and evening.`;
    clothingDetail = 'A denim jacket, trench, or light zip-up fleece will keep you comfortable across changing ambient temperatures.';
  } else if (temp > 28) {
    clothingStatus = 'moderate';
    clothingTitle = 'Light, Breathable & Loose Fabrics';
    clothingSummary = `Warm conditions (${Math.round(temp)}°C) favor moisture-wicking materials.`;
    clothingDetail = 'Wear natural cotton, linen, or athletic performance wear. Light colors reflect solar radiation effectively.';
  } else {
    clothingStatus = 'optimal';
    clothingTitle = 'Comfortable Casual Wear';
    clothingSummary = `Moderate ${Math.round(temp)}°C allows effortless all-day casual wear.`;
    clothingDetail = 'T-shirt or light button-down with comfortable trousers or shorts.';
  }

  recommendations.push({
    id: 'rec-clothing',
    category: 'clothing',
    title: clothingTitle,
    summary: clothingSummary,
    detail: clothingDetail,
    status: clothingStatus,
    metricBasis: `Based on: Temp ${Math.round(temp)}°C, Humidity ${humidity}%, Rain probability ${rainProb}%`
  });

  // 3. UV & SUN EXPOSURE ADVISOR
  let uvStatus: 'optimal' | 'moderate' | 'warning' | 'alert' = 'optimal';
  let uvTitle = 'Low UV Radiation';
  let uvSummary = 'Minimal sun protection required for brief outdoor exposure.';
  let uvDetail = 'UV index is safely low. Normal sunglasses for glare are optional.';

  if (uvIndex >= 10) {
    uvStatus = 'alert';
    uvTitle = 'Extreme UV Index Alert: SPF 50+ Required';
    uvSummary = `UV Index is at an extreme ${uvIndex.toFixed(1)}. Skin damage can occur in under 10 minutes.`;
    uvDetail = 'Avoid direct sun exposure between 10:00 AM and 4:00 PM. Generously apply broad-spectrum SPF 50+ sunscreen, wear UV400 sunglasses, and wear a broad-brimmed hat.';
  } else if (uvIndex >= 7) {
    uvStatus = 'warning';
    uvTitle = 'High UV Index: Apply High SPF Sunscreen';
    uvSummary = `UV Index is ${uvIndex.toFixed(1)} (High). Protection is necessary against burns.`;
    uvDetail = 'Apply SPF 30+ every two hours if spending time outside. Seek natural shade during peak solar noon hours.';
  } else if (uvIndex >= 3) {
    uvStatus = 'moderate';
    uvTitle = 'Moderate UV Index: Sun Protection Advised';
    uvSummary = `UV Index reaches ${uvIndex.toFixed(1)}. Moderate solar intensity.`;
    uvDetail = 'Wear sunglasses and apply light sunscreen if planning more than 30 minutes in direct sunlight.';
  }

  recommendations.push({
    id: 'rec-uv',
    category: 'uv',
    title: uvTitle,
    summary: uvSummary,
    detail: uvDetail,
    status: uvStatus,
    metricBasis: `Based on: Peak UV Index of ${uvIndex.toFixed(1)} measured by Open-Meteo solar radiation models`
  });

  // 4. COMMUTE & TRAVEL CONDITIONS
  let travelStatus: 'optimal' | 'moderate' | 'warning' | 'alert' = 'optimal';
  let travelTitle = 'Smooth Commuting Conditions';
  let travelSummary = 'Roads and transit corridors are dry with nominal wind resistance.';
  let travelDetail = 'Normal driving and pedestrian commuting conditions.';

  if (windGusts > 55 || isStorm) {
    travelStatus = 'alert';
    travelTitle = 'Hazardous Travel: High Wind Gusts & Reduced Stability';
    travelSummary = `Wind gusts up to ${Math.round(windGusts)} km/h pose hazards to two-wheelers and high-profile vehicles.`;
    travelDetail = 'Maintain a firm grip on the steering wheel, increase following distance, and watch out for tree branches or debris on roadways.';
  } else if (isRaining || isSnowing) {
    travelStatus = 'warning';
    travelTitle = 'Wet Surface Commute: Allow Extra Travel Time';
    travelSummary = 'Wet or slushy pavement reduces tire braking traction.';
    travelDetail = 'Turn on headlights in precipitation, leave extra braking buffer, and anticipate minor transit slowdowns.';
  } else if (current.weather_code === 45 || current.weather_code === 48) {
    travelStatus = 'warning';
    travelTitle = 'Fog Caution: Reduced Visibility Ahead';
    travelSummary = 'Horizontal visibility is restricted due to atmospheric fog.';
    travelDetail = 'Use low-beam fog headlights and avoid sudden lane maneuvers.';
  } else if (windSpeed > 25) {
    travelStatus = 'moderate';
    travelTitle = 'Breezy Commute: Minor Crosswinds';
    travelSummary = `Sustained winds of ${Math.round(windSpeed)} km/h.`;
    travelDetail = 'Slight resistance for cyclists; standard vehicles unaffected.';
  }

  recommendations.push({
    id: 'rec-travel',
    category: 'travel',
    title: travelTitle,
    summary: travelSummary,
    detail: travelDetail,
    status: travelStatus,
    metricBasis: `Based on: Wind speed ${Math.round(windSpeed)} km/h, Gusts ${Math.round(windGusts)} km/h, Weather condition: ${current.weather_code}`
  });

  return recommendations;
}
