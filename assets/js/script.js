const cityInput = document.getElementById("city");
const submitButton = document.getElementById("submitButton");
const API_key = "07c88c124e211064fcdb182acb1f77ea";
const weatherContainer = document.getElementById("container");
const weatherHistory = document.getElementById("history");

const storedCities = JSON.parse(localStorage.getItem("cities")) || [];

function getData() {
  let city = cityInput.value.trim();
  const api_url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_key}`;
  fetch(api_url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      renderCurrentWeather(city, data);
      storeSearchHistory(city);
    })
    .catch(function (error) {
      console.error(error);
    });
}

function storeSearchHistory(city) {
  storedCities.push(city);
  console.log(storedCities);
  localStorage.setItem("storedCities", JSON.stringify(storedCities));
}

function createHistoryButton() {
  const cityList = JSON.parse(localStorage.getItem("storedCities")) || [];

  for (let i = 0; i < cityList.length; i++) {
    const newButton = document.createElement("button");
    newButton.classList.add("history-button");
    newButton.textContent = cityList[i];
    weatherHistory.append(newButton);
  }
}

function renderCurrentWeather(city, weather) {
  console.log(weather);
  const temp = weather.list[0].main.temp;
  const humidity = weather.list[0].main.humidity;
  const windSpeed = weather.list[0].wind.speed;
  const weatherIcon = weather.list[0].weather[0].icon;
  const iconURL = `http://openweathermap.org/img/wn/${weatherIcon}.png`;

  console.log(temp, humidity, windSpeed, iconURL);

  const tempH1 = document.createElement("h1");
  const windH1 = document.createElement("h1");
  const humidityH1 = document.createElement("h1");
  const iconImg = document.createElement("img");

  tempH1.textContent = `Temperature: ${temp}`;
  windH1.textContent = `Wind Speed: ${windSpeed}`;
  humidityH1.textContent = `Humidity: ${humidity}`;
  iconImg.src = iconURL;
  // iconImg.setAttribute = ("src", iconURL);

  weatherContainer.append(tempH1, iconImg, windH1, humidityH1);
  // createHistoryButton();
}

// function handleSearchHistory(event) {
//   if (!event.target.matches(".history-button")) return;

//   const target = event.target;
//   const cityName = target.textContent;
//   renderCurrentWeather(cityName);
//   if (event.target.classList.contains("history-button")) {
//     const city = event.target.textContent;
//     const api_url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_key}`;
//     fetch(api_url)
//       .then(function (response) {
//         return response.json();
//       })
//       .then(function (data) {
//         renderCurrentWeather(city, data);
//       })
//       .catch(function (error) {
//         console.error(error);
//       });
//   }
// }

// createHistoryButton();
// weatherHistory.addEventListener("click", handleSearchHistory);
submitButton.addEventListener("click", getData);
