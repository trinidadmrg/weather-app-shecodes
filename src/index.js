// General configuration

let apiKey = "3e43443f02e74f827281e5c5dd6ef4f9";
let unit = "metric";
let now = new Date();

let currentDay = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let currentMonth = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let day = currentDay[now.getDay()];
let date = now.getDate();
let month = currentMonth[now.getMonth()];
let year = now.getFullYear();
let h2 = document.querySelector("h2");
h2.innerHTML = day + ", " + date + ". " + month + " " + year;

// Geolocation, searcher response and event call

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let endPoint = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(endPoint).then(getCityTemp);
}

function formatHour(timestamp) {
  let actualDate = new Date(timestamp);
  let hours = actualDate.getHours();
  let minutes = actualDate.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (hours < 10) {
    hours = `0${hours}`;
  }
  return `${hours}:${minutes}`;
}

function getForecast (coordinates) {
  console.log(coordinates);
  let forecastKey = "3e43443f02e74f827281e5c5dd6ef4f9"
  let forecastAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${forecastKey}&units=metric`
  console.log(forecastAPI);
  axios.get(forecastAPI).then(displayForecast)
}

function getCityTemp(response) {
  let name = response.data.name;
  let h1 = document.querySelector("h1");
  h1.innerHTML = name;
  let temp = Math.round(response.data.main.temp);
  let h3 = document.querySelector("h3");
  h3.innerHTML = temp + "°C";
  celsiusTemp = response.data.main.temp;
  let iconElement = document.querySelector("#weather-icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  let descriptionElement = document.querySelector("#weather-info");
  descriptionElement.innerHTML = response.data.weather[0].description;
  let hourElement = document.querySelector("#actual-hour");
  hourElement.innerHTML = formatHour(response.data.dt * 1000);
  let windElement = document.querySelector("#actual-wind");
  windElement.innerHTML =
    "Wind speed: " + Math.round(response.data.wind.speed) + " km/h.";
  let humidityElement = document.querySelector("#actual-humidity");
  humidityElement.innerHTML = "Humidity: " + response.data.main.humidity + "%.";
  
  getForecast(response.data.coord);
}


function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

let button = document.querySelector("#button-position");
button.addEventListener("click", getCurrentPosition);

// Searcher and event call

function getTempApi(city) {
  let endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(endpoint).then(getCityTemp);
}

getTempApi("Buenos Aires");

function citySearch(event) {
  event.preventDefault();
  let cityEntered = document.querySelector("#search-input");
  cityEntered = cityEntered.value;
  document.querySelector("h1").innerHTML = `${cityEntered}`;
  getTempApi(cityEntered);
}

let buttonSeacher = document.querySelector("#button-searcher");
buttonSeacher.addEventListener("click", citySearch);

// Celsius to Fahrenheit Conversion

function showFahrenheitTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemp) + "°F";
}

function showCelsiusTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  temperatureElement.innerHTML = Math.round(celsiusTemp) + "°C";
}

let celsiusTemp = null;

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", showFahrenheitTemp);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", showCelsiusTemp);

// Forecast

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000)
  let day = date.getDay();
  let days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
  return days[day]; 
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#weather-forecast");

  let forecastHTML = `<div class="row d-flex justify-content-center align-content-center">`;

  forecast.forEach(function(forecastDay, index) {
    if (index < 5) {
    forecastHTML = forecastHTML + 
    `
    <div class="col-2">
          <div class="card">
            <h4>${formatDay(forecastDay.dt)}</h4>
            <div class="card-body">
              <h6 class="card-title">Max: ${Math.round(forecastDay.temp.max)}°</h6>
              <img class="forecastIcon" src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" />
              <p class="card-text">Min: ${Math.round(forecastDay.temp.min)}°</p>
            </div>
          </div>
        </div>
        `;
    }
  });

  forecastHTML = forecastHTML + `</div>`
  forecastElement.innerHTML = forecastHTML;
}