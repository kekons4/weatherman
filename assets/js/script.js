// jquery query selectors
var searchForm = $("#search");
var searchInput = $("#search-input");
var resultsEl = $("#results");
var historyEl = $("#history");

// API URL parameters and base url
var APIKEY = "eaa68d3df89c0a3c155a63bf91e7807d";
var cnt = "6";
var units = "imperial";
var apiBaseUrl = "https://api.openweathermap.org/data/2.5/forecast?q=";

// localStorage initialization and checking
var savedHistory = [];
if (localStorage.getItem("history") !== null) {
  savedHistory = JSON.parse(localStorage.getItem("history"));
  populateHistory();
} else {
  localStorage.setItem("history", JSON.stringify(savedHistory));
  savedHistory = JSON.parse(localStorage.getItem("history"));
}

// grabs the data from localStorage and populates the history element in the side bar
function populateHistory() {
  savedHistory.forEach(element => {
    historyEl.append("<div id='hist-item'>" + element + "</div>");
  });
}

// This function clears the error messages in DOM
function clearErrors() {
  resultsEl.empty();
}

// After the user clicks on one of th elements in the history element it will proceed
// to fetch the api data again and display it to the DOM.
function displayHistory(event) {
  var histItem = $(event.target);
  fetch(
    apiBaseUrl +
      histItem.text() +
      "&cnt=" +
      cnt +
      "&units=" +
      units +
      "&appid=" +
      APIKEY
  ).then(function(response) {
    if (response.ok) {
      clearErrors();
      response.json().then(function(data) {
        displayWeather(data);
      });
    } else {
      resultsEl.append(
        "<div>Error in searching for: " + searchInput.val() + "</div>"
      );
    }
  });
}

// sets the uv index value to the current weather
function uvIndex(uv) {
  var uIndex = resultsEl.children().eq(0).children().eq(4);
  var colorIndex = $("<span></span>");
  colorIndex.text(uv);
  if(uv > 0 && uv < 3) {
    colorIndex.addClass("green");
  } else if(uv > 3 && uv < 6) {
    colorIndex.addClass("yellow");
  } else {
    colorIndex.addClass("red");
  }
  uIndex.append(colorIndex);
}

// after recieving data from second fetch call it will render the 5 day forecast to DOM
function fiveDay(test) {
  uvIndex(test.daily[0].uvi);
  // Create card container for 5 day forecast and append it to DOM
  var cardCont = $("<div id='card-container' class='card-cont'></div>");
  resultsEl.append(cardCont);
  // Generate the 5 day forcast cards to DOM
  for (let i = 1; i < test.daily.length - 2; i++) {
    // Card Body
    var card = $("<div class='card'></div>");
    // Date of the card as Title
    var titleDate = $("<h3></h3>");
    titleDate.text(moment.unix(test.daily[i].dt).format("M/DD/YYYY"));
    //current cloudy conditions icon
    var image = $(
      "<img id='wicon' src='https://openweathermap.org/img/w/" +
        test.daily[i].weather[0].icon +
        ".png' alt='Weather icon'></img>"
    );
    // temp of city
    var tempurature = $("<span></span>");
    tempurature.text(
      "Temp: " + test.daily[i].temp.day + String.fromCharCode(176) + "F"
    );

    // humidity
    var humid = $("<span></span>");
    humid.text("Humidity: " + test.daily[i].humidity + "%");

    card.append(titleDate);
    card.append(image);
    card.append(tempurature);
    card.append(humid);
    cardCont.append(card);
  }
}

// This function will display api data on to DOM
function displayWeather(data) {
  // add entry into savedHistory
  savedHistory.push(data.city.name);

  // Grab lat and lon coordinates
  var lon = data.city.coord.lon;
  var lat = data.city.coord.lat;

  // push new savedHistory array to localStorage
  localStorage.setItem("history", JSON.stringify(savedHistory));
  // append to DOM
  historyEl.append("<div id='hist-item'>" + data.city.name + "</div>");

  // Creates the card for present weather
  var articleEl = $("<article id='city-forecast'></article>");

  // icon img of the current weather in city
  var img = $(
    "<img id='wicon' src='https://openweathermap.org/img/w/" +
      data.list[0].weather[0].icon +
      ".png' alt='Weather icon'></img>"
  );

  // City name with date
  var cityNameDate = $("<h2></h2>");
  cityNameDate.text(
    data.city.name +
      " " +
      "(" +
      moment.unix(data.list[0].dt).format("MM/DD/YYYY") +
      ")"
  );
  // add img to h2 tag
  cityNameDate.append(img);

  // current temp of city
  var temp = $("<span></span>");
  temp.text(
    "Tempurature: " + data.list[0].main.temp + String.fromCharCode(176) + "F"
  );

  // current humidity
  var humidity = $("<span></span>");
  humidity.text("Humidity: " + data.list[0].main.humidity + "%");

  // current wind speed
  var windSpeed = $("<span></span>");
  windSpeed.text("Wind Speed: " + data.list[0].wind.speed + " MPH");

  // current uv index
  var uvIndex = $("<span></span>");
  uvIndex.text("UV Index: ");

  articleEl.append(cityNameDate);
  articleEl.append(temp);
  articleEl.append(humidity);
  articleEl.append(windSpeed);
  articleEl.append(uvIndex);

  // Add city current weather
  resultsEl.append(articleEl);
  // Added h2 of 5 Day forecast
  resultsEl.append("<h2>5-Day Forecast:</h2>");
  //After the current city is appended to DOM
  // A second fetch call is made to get 5 day forecast data
  // and is send to the fiveDay() function to be rendered
  fetch(
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&exclude=current,hourly,minutely" +
      "&units=" +
      units +
      "&appid=" +
      APIKEY
  ).then(function(response) {
    if (response.ok) {
      response.json().then(function(data2) {
        fiveDay(data2);
      });
    }
  });
}

// This function will grab user input and fetch the data from open weather api
function getWeather(event) {
  event.preventDefault();
  // attempts to fetch the api data from open weather api
  fetch(
    apiBaseUrl +
      searchInput.val() +
      "&cnt=" +
      cnt +
      "&units=" +
      units +
      "&appid=" +
      APIKEY
  ).then(function(response) {
    // if response is good then clear the DOM of any previous error messages
    // and send the parsed json to displayWeather function
    if (response.ok) {
      clearErrors();
      response.json().then(function(data) {
        displayWeather(data);
      });
      // if reponse was not good then append a div error message to DOM
    } else {
      resultsEl.append(
        "<div>Error in searching for: " + searchInput.val() + "</div>"
      );
    }
  });
}

// Upon the submit of the form send the event to getWeather function
searchForm.on("submit", getWeather);

historyEl.on("click", "#hist-item", displayHistory);
