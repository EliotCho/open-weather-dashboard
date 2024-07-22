const cityInput = document.getElementById("search-input");
const submitButton = document.getElementById("search-button");
const API_key = "07c88c124e211064fcdb182acb1f77ea";
const weatherContainer = document.getElementById("container");
const today = document.getElementById("today");
const forecast = document.getElementById("forecast");
const weatherHistory = document.getElementById("history");

// const storedCities = JSON.parse(localStorage.getItem("cities")) || [];

// initial cities to store in local storage
const storedCities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
];
localStorage.setItem("storedCities", JSON.stringify(storedCities));

function getData() {
  // get city name from input and trim value
  let city = cityInput.value.trim();
  // replace special characters with empty string
  city = city.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "");
  // convert city name to lowercase
  city = city.toLowerCase().split(" ");

  // capitalize first letter of each word in city name
  for (let i = 0; i < city.length; i++) {
    city[i] = city[i].charAt(0).toUpperCase() + city[i].substring(1);
  }
  // join the words in the city name
  city = city.join(" ");

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
    // if array length is less than 10, add city to the beginning of the array
    if (storedCities.length < 10) {
      storedCities.unshift(city);
      console.log(`Stored ${city}`);
      console.log(storedCities);
      localStorage.setItem("storedCities", JSON.stringify(storedCities));
    } else {
      // if array length is equal to 10, remove the last city and add new city to the beginning of the array
      storedCities.unshift(city);
      storedCities.pop();
      console.log(`Stored ${city}`);
      console.log(storedCities);
      localStorage.setItem("storedCities", JSON.stringify(storedCities));
    }
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
    newButton.innerHTML = `
    <p class="history-button m-2">${cityList[i]}</p>
    `;
    // newButton.classList.add("history-button");
    // newButton.textContent = cityList[i];
    weatherHistory.append(newButton);
  }
}

function fiveDaysForecast(city, weather) {
  // clear weather container
  weatherContainer.innerHTML = "";
  today.innerHTML = "";
  forecast.innerHTML = "";
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
    const card = document.createElement("div");
    
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    
    const date = fiveDaysList[i].dt_txt;
    const temp = fiveDaysList[i].main.temp;
    const humidity = fiveDaysList[i].main.humidity;
    const windSpeed = fiveDaysList[i].wind.speed;
    const weatherIcon = fiveDaysList[i].weather[0].icon;
    const iconURL = `http://openweathermap.org/img/wn/${weatherIcon}@4x.png`;
    
    // Set card content
    cardBody.innerHTML = `
    <img class="card-img-top" src=${iconURL} alt="Weather image icon">
    <h5 class="card-title">Date: ${date}</h5>
    <h5 class="card-title">Temperature: ${temp}°C</h5>
    <h5 class="card-title">Humidity: ${humidity}%</h5>
    <h5 class="card-title">Wind Speed: ${windSpeed}m/s</h5>
    `;
    
    // Append card body to card
    card.appendChild(cardBody);
    
    // Append card to container
    if (i === 0) {
      // main weather card
      card.classList.add("card", "col-lg-4", "mb-3");
      today.appendChild(card);
    } else {
      // forecast cards
      card.classList.add("card", "col-md-2", "m-3");
      forecast.appendChild(card);
    }
    // weatherContainer.appendChild(card);
    
    // const day = document.createElement("h1");
    // const tempH1 = document.createElement("h1");
    // const humidityH1 = document.createElement("h1");
    // const windH1 = document.createElement("h1");
    // const iconImg = document.createElement("img");

    // day.textContent = fiveDaysList[i].dt_txt;
    // tempH1.textContent = `Temperature: ${temp}°C`;
    // humidityH1.textContent = `Humidity: ${humidity}%`;
    // windH1.textContent = `Wind Speed: ${windSpeed}m/s`;
    // iconImg.setAttribute("src", iconURL);

    // weatherContainer.append(day, iconImg, tempH1, humidityH1, windH1);
  }
}

// listens to click event on history buttons
function handleSearchHistory(event) {
  if (!event.target.matches(".history-button")) return;

  // get city name from button text and render it
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

// event listeners
// create history buttons when page loads
createHistoryButton();
// listens to click event on history buttons
weatherHistory.addEventListener("click", handleSearchHistory);
// listens to click event on submit button
submitButton.addEventListener("click", getData);
