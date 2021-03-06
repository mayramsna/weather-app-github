// we need the api key
const APIKEY = "838c4ccfd4bfa09e347b74f53a234eec";

// testing console log & date
let now = new Date();
console.log(now);

// Display the current date and time using JS — format: Tuesday, 16:00

function showTodayTime() {
  let daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let date = new Date();
  let days = daysOfWeek[date.getDay()];
  let hour = date.getHours();
  let minutes = date.getMinutes();

  let todayDate = document.querySelector("#today-time");
  todayDate.innerHTML = `${days}, ${hour}:${minutes}`;
}

showTodayTime();

// Add a search engine, when searching for a city (i.e. Paris),
// display the city name on the page after the user submits the form.

function showCitySearch() {
  event.preventDefault();
  let cityInput = document.querySelector(".city-input");
  let cityName = cityInput.value;

  // Fetches weather data for the searched city, parses data, and displays on screen
  fetchCityWeather(cityName).then(parseWeatherData).then(displayCityWeather);

  fetchForcast(cityName)
    .then(function (response) {
      const data = response.data;
      const forcastList = data.list;

      const dailyWeather = [];
      for (let i = 0; i < forcastList.length; i++) {
        if (i % 8 === 0) {
          dailyWeather.push(forcastList[i]);
        }
      }
      return dailyWeather.map(parseForecast);
    })
    .then(updateForecast);
}

let searchButton = document.querySelector("#searchCityBtn");
searchButton.addEventListener("click", showCitySearch);

/**
 * Call the openweather API and returns current data for the searched city
 */
function fetchCityWeather(cityName) {
  // we need the api url.
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKEY}&&units=imperial`;

  // call the api and return fetched data
  return axios.get(apiUrl);
}

function fetchForcast(cityName) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${APIKEY}&units=imperial`;

  return axios.get(apiUrl);
}

/**
 * Takes the response form the openweather API and returns
 * parsed weather data to be display on the page
 */
function parseWeatherData(weatherResponse) {
  const iconUrl = "http://openweathermap.org/img/wn/:iconId@2x.png";
  const weatherObj = {
    highTemp: 0,
    lowTemp: 0,
    description: "",
    cityName: "",
    windSpeed: "",
    icon: "",
  };

  weatherObj["cityName"] = weatherResponse["data"]["name"];
  weatherObj["highTemp"] = Math.floor(
    weatherResponse["data"]["main"]["temp_max"]
  );
  weatherObj["lowTemp"] = Math.floor(
    weatherResponse["data"]["main"]["temp_min"]
  );
  weatherObj["description"] =
    weatherResponse["data"]["weather"][0]["description"];
  weatherObj["windSpeed"] = Math.floor(
    weatherResponse["data"]["wind"]["speed"]
  );
  weatherObj["icon"] = iconUrl.replace(
    ":iconId",
    weatherResponse["data"]["weather"][0]["icon"]
  );
  return weatherObj;
}

function parseForecast(forecastData) {
  const iconUrl = "http://openweathermap.org/img/wn/:iconId@2x.png";
  const weatherObj = {
    highTemp: 0,
    lowTemp: 0,
    icon: "",
  };
  weatherObj.highTemp = Math.floor(forecastData.main.temp_max);
  weatherObj.lowTemp = Math.floor(forecastData.main.temp_min);
  weatherObj.icon = iconUrl.replace(":iconId", forecastData.weather[0].icon);

  return weatherObj;
}

/**
 * Takes parsed data for the current weather and displays it on the page
 */
function displayCityWeather(weatherData) {
  const cityName = document.querySelector("#city-name");
  const currentHigh = document.querySelector("#current-high");
  const currentLow = document.querySelector("#current-low");
  const description = document.querySelector(".temp-description");
  const windSpeed = document.querySelector(".wind-speed");
  const currentDayIcon = document.querySelector("#today-icon");

  cityName.innerHTML = weatherData["cityName"];
  currentHigh.innerHTML = weatherData["highTemp"] + "°";
  currentLow.innerHTML = weatherData["lowTemp"] + "°";
  description.innerHTML = weatherData["description"];
  windSpeed.innerHTML = weatherData["windSpeed"];
  currentDayIcon.src = weatherData["icon"];
}

function updateForecast(forecastData) {
  const icons = document.querySelectorAll(".temp-icons .forecast-icon img");
  const highTemp = document.querySelectorAll(".high-temp .temp-number");
  const lowTemp = document.querySelectorAll(".low-temp .temp-number");

  forecastData.forEach(function (weatherData, index) {
    highTemp[index].innerHTML = weatherData.highTemp;
    lowTemp[index].innerHTML = weatherData.lowTemp;
    icons[index].src = weatherData.icon;
  });
}

document
  .querySelector(".city-input")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      showCitySearch();
    }
  });

// Challenge 3 — converting F/C
let tempConversion = document.querySelector(".convert-btn");
tempConversion.addEventListener("click", convertTemp);

function convertTemp(e) {
  e.preventDefault();

  // Node List of tempretures
  let temps = document.querySelectorAll(".temp-number");
  let tempUnit = document.querySelector("#temp-unit");

  for (let temperature of temps) {
    let tempNumber = temperature.innerHTML.split("°")[0];
    let newTemp = calculateTemp(tempNumber, tempUnit.innerHTML);

    temperature.innerHTML = newTemp + "°";
  }

  if (tempUnit.innerHTML === "F") {
    tempUnit.innerHTML = "C";
  } else {
    tempUnit.innerHTML = "F";
  }
}

/**
 * Takes the current temp and temp unit and converts it
 * to the other standard.
 *
 * @param {number} currentTemp - current temperature to convert
 * @param {string} currentUnit - Current temperature unit
 * @returns {number} converted temp
 */
function calculateTemp(currentTemp, currentUnit) {
  // F->C (°F − 32) × 5/9 = °C
  // C->F (0°C × 9/5) + 32 = 32°F

  if (currentUnit === "F") {
    return (((currentTemp - 32) * 5) / 9).toFixed(0);
  } else {
    return ((currentTemp * 9) / 5 + 32).toFixed(0);
  }
}
