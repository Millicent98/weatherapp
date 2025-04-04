//this section gets elements from the html
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const cityElement = document.getElementById("city");
const temperatureElement = document.getElementById("temperature");
const humidityElement = document.getElementById("humidity");
const windSpeedElement = document.getElementById("wind-speed");
const forecastDayElement = document.getElementById("forecast-day");
const forecastTemperatureElement = document.getElementById(
  "forecast-temperature"
);

//the apikey id from the openweatherapp site
const apiKey = "5fcbd999098978db180a06b009fcf3e9";

//call a function that will update the html elements with the information containing the current weather information
function displayWeather(weatherData) {
  cityElement.textContent = weatherData.name;
  temperatureElement.textContent = Math.round(weatherData.main.temp); // round the temperature to the nearest whole number
  humidityElement.textContent = `${weatherData.main.humidity}%`;
  windSpeedElement.textContent = `${weatherData.wind.speed} m/s`;
}

function displayForecast(forecastData) {
  // show the forecast for tomorrow at 12:00 PM
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowMidnightUTC = new Date(
    Date.UTC(
      tomorrow.getFullYear(),
      tomorrow.getMonth(),
      tomorrow.getDate(),
      0,
      0,
      0
    )
  );
  const tomorrowNoonUTC = new Date(tomorrowMidnightUTC);
  tomorrowNoonUTC.setUTCHours(12);

  const nextDayForecast = forecastData.list.find((item) => {
    const forecastTimeUTC = new Date(item.dt * 1000);
    return (
      forecastTimeUTC.getTime() >= tomorrowNoonUTC.getTime() &&
      forecastTimeUTC.getTime() < tomorrowNoonUTC.getTime() + 3 * 60 * 60 * 1000
    ); // Check within a 3-hour window around noon
  });

  if (nextDayForecast) {
    const date = new Date(nextDayForecast.dt * 1000);
    const dayOptions = { weekday: "long" };
    forecastDayElement.textContent = new Intl.DateTimeFormat(
      "en-US",
      dayOptions
    ).format(date);
    forecastTemperatureElement.textContent = `${Math.round(
      nextDayForecast.main.temp
    )} °C`;
  } else {
    forecastDayElement.textContent = "No forecast available";
    forecastTemperatureElement.textContent = "";
  }
}

function fetchWeather(city) {
  const currentWeatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  axios
    .get(currentWeatherApiUrl)
    .then((response) => {
      displayWeather(response.data);
    })
    .catch((error) => {
      cityElement.textContent = "City not found";
      temperatureElement.textContent = "";
      humidityElement.textContent = "";
      windSpeedElement.textContent = "";
      console.error("Error fetching current weather data:", error);
    });

  axios
    .get(forecastApiUrl)
    .then((response) => {
      displayForecast(response.data);
    })
    .catch((error) => {
      forecastDayElement.textContent = "Forecast unavailable";
      forecastTemperatureElement.textContent = "";
      console.error("Error fetching forecast data:", error);
    });
}

function handleSearchSubmit(event) {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
  } else {
    alert("Please enter a city name.");
  }
}

searchForm.addEventListener("submit", handleSearchSubmit);

//default weather search when the page loads
fetchWeather("Port Elizabeth");
