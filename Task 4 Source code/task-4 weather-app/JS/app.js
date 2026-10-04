/* Weather App */
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const message = document.getElementById("message");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const weatherCondition = document.getElementById("weatherCondition");
const weatherIcon = document.getElementById("weatherIcon");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");

/* Weather Codes */
const getWeather = (code) => {
    if (code === 0) return ["Clear Sky", "☀️"];
    if ([1, 2, 3].includes(code)) return ["Partly Cloudy", "⛅"];
    if ([45, 48].includes(code)) return ["Foggy", "🌫️"];
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return ["Rainy", "🌧️"];
    if ([71, 73, 75, 77, 85, 86].includes(code)) return ["Snowy", "❄️"];
    if ([95, 96, 99].includes(code)) return ["Thunderstorm", "⛈️"];
    return ["Unknown Weather", "🌤️"];
};

/* Fetch Weather */
const fetchWeather = async () => {
    const city = cityInput.value.trim();

    if (!city) {
        message.textContent = "Please enter a city name";
        cityInput.focus();
        return;
    }

    searchBtn.disabled = true;
    searchBtn.textContent = "Loading...";
    message.textContent = "Fetching weather data...";

    try {
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!geoResponse.ok) {
            throw new Error("Unable to search city");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Please try again.");
        }

        const location = geoData.results[0];

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`
        );

        if (!weatherResponse.ok) {
            throw new Error("Weather data unavailable");
        }

        const weatherData = await weatherResponse.json();
        const current = weatherData.current;
        const condition = getWeather(current.weather_code);

        cityName.textContent = `${location.name}, ${location.country}`;
        temperature.textContent = `${Math.round(current.temperature_2m)}°C`;
        weatherCondition.textContent = condition[0];
        weatherIcon.textContent = condition[1];
        feelsLike.textContent = `${Math.round(current.apparent_temperature)}°C`;
        humidity.textContent = `${current.relative_humidity_2m}%`;
        windSpeed.textContent = `${current.wind_speed_10m} km/h`;

        message.textContent = "";

    } catch (error) {
        message.textContent = error.message;
    } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = "Search";
    }
};

/* Events */
searchBtn.addEventListener("click", fetchWeather);

cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        fetchWeather();
    }
});