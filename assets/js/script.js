const cityInput = document.getElementById("city");
const submitButton = document.getElementById("submitButton");
const API_key = "07c88c124e211064fcdb182acb1f77ea";
const weatherContainer = document.getElementById("container");
const weatherHistory = document.getElementById("history");

// const storedCities = JSON.parse(localStorage.getItem("cities")) || [];
const storedCities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"];
localStorage.setItem("storedCities", JSON.stringify(storedCities));

function getData() {
  // get city name from input and trim value
  let city = cityInput.value.trim();
  // replace special characters with empty string
  city = city.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "");
  // convert city name to lowercase
  city = city.toLowerCase();
  // capitalize first letter of city name
  city = city.charAt(0).toUpperCase() + city.slice(1);

  const api_url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_key}&units=metric`;
  fetch(api_url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // renderCurrentWeather(city, data);
      fiveDaysForecast(city, data);
      storeSearchHistory(city);
      createHistoryButton();
    })
    .catch(function (error) {
      // error if city is not found, alert user
      console.error(error);
      alert("City not found");
    });
}

function storeSearchHistory(city) {
  // if city is already in the array, do nothing
  // else, add city to the array and store it in local storage
  if (storedCities.includes(city)) {
    return;
  } else {
    storedCities.push(city);
    console.log(`Stored ${city}`);
    console.log(storedCities);
    localStorage.setItem("storedCities", JSON.stringify(storedCities));
  }
}

function createHistoryButton() {
  // clear history buttons
  weatherHistory.innerHTML = "";
  const cityList = JSON.parse(localStorage.getItem("storedCities")) || [];
  console.log(cityList);

  // create a button for each city in the array
  for (let i in cityList) {
    const newButton = document.createElement("button");
    newButton.classList.add("history-button");
    newButton.textContent = cityList[i];
    weatherHistory.append(newButton);
  }
}

function fiveDaysForecast(city, weather) {
  // clear weather container
  weatherContainer.innerHTML = "";
  // filter the list to only include data at 12:00:00
  const fiveDaysList = weather.list.filter((item) =>
    item.dt_txt.includes("12:00:00")
  );

  console.log(fiveDaysList);

  // create a header for the city name and display it
  const searchLocation = document.createElement("h1");
  searchLocation.textContent = city;
  weatherContainer.append(searchLocation);

  // clear input field
  cityInput.value = "";

  // create a card for each day in the list (5 days in total)
  for (let i = 0; i < fiveDaysList.length; i++) {
    const temp = fiveDaysList[i].main.temp;
    const humidity = fiveDaysList[i].main.humidity;
    const windSpeed = fiveDaysList[i].wind.speed;
    const weatherIcon = fiveDaysList[i].weather[0].icon;
    const iconURL = `http://openweathermap.org/img/wn/${weatherIcon}.png`;

    const day = document.createElement("h1");
    const tempH1 = document.createElement("h1");
    const humidityH1 = document.createElement("h1");
    const windH1 = document.createElement("h1");
    const iconImg = document.createElement("img");

    day.textContent = fiveDaysList[i].dt_txt;
    tempH1.textContent = `Temperature: ${temp}`;
    humidityH1.textContent = `Humidity: ${humidity}`;
    windH1.textContent = `Wind Speed: ${windSpeed}`;
    iconImg.setAttribute("src", iconURL);

    weatherContainer.append(day, iconImg, tempH1, humidityH1, windH1);
  }
}

function handleSearchHistory(event) {
  if (!event.target.matches(".history-button")) return;

  if (event.target.classList.contains("history-button")) {
    const city = event.target.textContent;
    const api_url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_key}&units=metric`;
    fetch(api_url)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        fiveDaysForecast(city, data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }
}

createHistoryButton();
weatherHistory.addEventListener("click", handleSearchHistory);
submitButton.addEventListener("click", getData);
