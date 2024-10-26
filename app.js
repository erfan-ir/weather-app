const BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = "f5511c0316c56071ca829b21508ff780";
const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const searchInput = document.querySelector("input");
const searchButton = document.querySelector("button");
const alertMessage = document.getElementById("alert-message");
const alertDiv = document.getElementById("alert");
const weatherContainer = document.getElementById("weather");
const forecastContainer = document.getElementById("forecast");
const locationIcon = document.getElementById("location");

const renderCurrentWeather = (data) => {
  const weatherJSX = `
    <h1>${data.name}, ${data.sys.country}</h1>
    <div id="main">
    <img alt="weather img" src="https://openweathermap.org/img/w/${
      data.weather[0].icon
    }.png" />
        <span>${data.weather[0].main}</span>
        <p>${Math.round(data.main.temp)} °C</p>
        </div>
        <div id="info">
            <p>Humidity: <span>${data.main.humidity} %</span></p>
            <p>Wind Speed: <span>${data.wind.speed} m/s</span></p>
        </div>
    `;
  weatherContainer.innerHTML = weatherJSX;
};

const getCurrentWeatherByName = async (city) => {
  const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);
  const json = response.json();
  return json;
};
const getCurrentWeatherByLocation = async (lat, lon) => {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);
  const json = response.json();
  return json;
};
const getForcastWeatherByName = async (city) => {
  const url = `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);
  const json = response.json();
  return json;
};
const getWeekDay = (date) => {
  return DAYS[new Date(date * 1000).getDay()];
};
const renderForecastWeather = (data) => {
  console.log(data);
  data = data.list.filter((obj) => obj.dt_txt.endsWith("12:00:00"));
  data.forEach((i) => {
    const forecastJSX = `
            <div>
                <img alt="weather icon" src="https://openweathermap.org/img/w/${
                  i.weather[0].icon
                }.png" />
                <h3>${getWeekDay(i.dt)}</h3>
                <p>${Math.round(i.main.temp)} °C</p>
                <span>${i.weather[0].main}</span>
            </div>
        `;
    forecastContainer.innerHTML += forecastJSX;
  });
};

const searchHandler = async () => {
  const cityName = searchInput.value;
  if (!cityName) {
    alertMessage.innerText = "Plase Enter City Name";
    alertDiv.style.display = "block";
  }
  setTimeout(() => {
    alertDiv.style.display = "none";
  }, 2000);
  const currentData = await getCurrentWeatherByName(cityName);
  renderCurrentWeather(currentData);
  const forecastData = await getForcastWeatherByName(cityName);
  renderForecastWeather(forecastData);
};

const positionCallBack = async (position) => {
  const { latitude, longitude } = position.coords;
  const currentData = await getCurrentWeatherByLocation(latitude, longitude);
  renderCurrentWeather(currentData);
};
const errorCallBack = (err) => {
  alertMessage.innerText = err.message;
  alertDiv.style.display = "block";
  setTimeout(() => {
    alertDiv.style.display = "none";
  }, 5000);
};

const locationHandler = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(positionCallBack, errorCallBack);
  } else {
    alert("your browser does not support geoLocation");
  }
};

searchButton.addEventListener("click", searchHandler);
locationIcon.addEventListener("click", locationHandler);
