// jquery query selectors
var searchForm = $("#search");
var searchInput = $("#search-input");
var resultsEl = $("#results");
var historyEl = $("#history");

// API URL parameters and base url
var APIKEY = "eaa68d3df89c0a3c155a63bf91e7807d";
var cnt = "5";
var units = "imperial";
var apiBaseUrl = "http://api.openweathermap.org/data/2.5/forecast?q=";

// localStorage initialization and checking
var savedHistory = [];
if (localStorage.getItem("history") !== null) {
    savedHistory = JSON.parse(localStorage.getItem("history"));
    populateHistory();
} else {
    localStorage.setItem("history", JSON.stringify(savedHistory));
    savedHistory = JSON.parse(localStorage.getItem("history"));
}

function populateHistory() {
    savedHistory.forEach(element => {
        historyEl.append("<div id='hist-item'>" + element + "</div>");
    });
}

// This function clears the error messages in DOM
function clearErrors() {
    resultsEl.empty();
}

// This function will display api data on to DOM
function displayWeather(data) {
    // add entry into savedHistory
    savedHistory.push(data.city.name);
    // push new savedHistory array to localStorage
    localStorage.setItem("history", JSON.stringify(savedHistory));
    // append to DOM
    historyEl.append("<div id='hist-item'>" + data.city.name + "</div>");
    console.log(data);
}

// This function will grab user input and fetch the data from open weather api
function getWeather(event) {
    event.preventDefault();
    // attempts to fetch the api data from open weather api
    fetch(apiBaseUrl + searchInput.val() + "&cnt=" + cnt + "&units=" + units + "&appid=" + APIKEY)
        .then(function (response) {
            // if response is good then clear the DOM of any previous error messages
            // and send the parsed json to displayWeather function 
            if (response.ok) {
                clearErrors();
                response.json().then(function (data) {
                    displayWeather(data);
                });
                // if reponse was not good then append a div error message to DOM
            } else {
                resultsEl.append("<div>Error in searching for: " + searchInput.val() + "</div>")
            }
        })
}

// Upon the submit of the form send the event to getWeather function
searchForm.on("submit", getWeather);