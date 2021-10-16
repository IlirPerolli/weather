'use strict';

const temp = document.querySelector('#temp');
const description = document.querySelector('#description');
const wind = document.querySelector('#wind');
const city = document.querySelector('#city');
const time = document.querySelector('#time');
const humidity = document.querySelector('#humidity');
const weatherImg = document.querySelector('#weather-img');
const highestTemperature = document.querySelector('#highest-temperature');
const loader = document.querySelector('#loader-container');
const weatherSection = document.querySelector('#weather-section');
const errorMessage = document.querySelector('#error-message');

const weatherIcons = {
  rain: 'https://www.svgrepo.com/show/43707/rain.svg',
  sun: 'https://www.svgrepo.com/show/30310/sun.svg',
  thunderstorm: 'https://www.svgrepo.com/show/337912/thunderstorm.svg',
  drizzle: 'https://www.svgrepo.com/show/20968/drizzle.svg',
  snow: 'https://www.svgrepo.com/show/327538/snow.svg',
  clear: 'https://www.svgrepo.com/show/16561/moon.svg',
  clouds: 'https://www.svgrepo.com/show/97652/clouds.svg',
};

const getLocation = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const checkWeather = function () {
  const currentPos = getLocation()
    .then(pos => {
      const { latitude: lat, longitude: lng } = pos.coords;
      return [lat, lng];
    })
    .then(data => {
      getWeather(data[0], data[1]);
    })
    .catch(err => {
      renderErrorMessage('Ju lutem lejoni marrjen e lokacionit.');
    })
    .finally(() => {
      loader.classList.add('hidden');
      weatherSection.classList.remove('hidden');
    });
};

const timeout = function (seconds) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error('Request took too long!'));
    }, seconds * 1000);
  });
};

const getJSON = async function (url, errorMsg = 'Diçka shkoi keq.') {
  const location = await fetch(url);
  console.log(url);
  const weatherData = await location.json();
  if (weatherData.cod != 200)
    throw new Error(`${errorMsg} (${weatherData.message})`);
  return weatherData;
};
const getWeather = async function (lat, lng) {
  try {
    const weatherData = await Promise.race([
      getJSON(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&lang=sq&appid=7ee529f770938cd5c447f1876fb0bb0f`
      ),
      timeout(3),
    ]);

    renderWeather(weatherData);
  } catch (err) {
    renderErrorMessage(err.message);
  }
};

const renderWeather = function (data) {
  temp.textContent = `${Math.round(data.main.temp)} °C`;
  description.textContent = data.weather[0].description;
  wind.textContent = `${data.wind.speed} km/h`;
  city.textContent = data.name;
  const date = new Date();
  time.textContent = `${String(date.getHours()).padStart(2, 0)}:${String(
    date.getMinutes()
  ).padStart(2, 0)} `;
  humidity.textContent = `${data.main.humidity}%`;
  highestTemperature.textContent = `${Math.round(data.main.temp)} °C`;
  const weatherType = data.weather[0].main.toLowerCase();
  weatherImg.src = weatherIcons[weatherType];
  weatherImg.classList.remove('hidden');
};
const renderErrorMessage = function (message) {
  errorMessage.textContent = message;
  document.querySelector('#weather-icons').classList.add('hidden');
};
checkWeather();
