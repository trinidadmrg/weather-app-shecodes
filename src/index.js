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

// Geolocation and event call

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let endPoint = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;
  axios.get(endPoint).then(getCityTemp);
}

function getCityTemp(response) {
  let name = response.data.name;
  let h1 = document.querySelector("h1");
  h1.innerHTML = name;
  let temp = Math.round(response.data.main.temp);
  let h3 = document.querySelector("h3");
  h3.innerHTML = temp + "°C";
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

let button = document.querySelector("#button-position");
button.addEventListener("click", getCurrentPosition);

// Searcher and event call

function getTempApi(city) {
  let endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
  axios.get(endpoint).then(getCityTemp);
}

function citySearch(event) {
  event.preventDefault();
  let cityEntered = document.querySelector("#search-input");
  cityEntered = cityEntered.value;
  document.querySelector("h1").innerHTML = `${cityEntered}`;
  getTempApi(cityEntered);
}

let buttonSeacher = document.querySelector("#button-searcher");
buttonSeacher.addEventListener("click", citySearch);
