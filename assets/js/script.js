// jquery query selectors
var searchForm = $("#search");
var searchInput = $("#search-input");

// API URL parameters and base url
var APIKEY = "eaa68d3df89c0a3c155a63bf91e7807d";
var cnt = "5";
var units = "imperial";
var apiBaseUrl = "http://api.openweathermap.org/data/2.5/forecast?q=";

// localStorage initialization and checking
var savedHistory = [];
if (localStorage.getItem("history") !== null) {
    savedHistory = JSON.parse(localStorage.getItem("history"));
} else {
    localStorage.setItem("history", JSON.stringify(savedHistory));
    savedHistory = JSON.parse(localStorage.getItem("histroy"));
}

// This function will grab user input and fetch the data from open weather api
function getWeather(event) {
    event.preventDefault();
    // console.log(searchInput.val());

    fetch(apiBaseUrl + searchInput.val() + "&cnt=" + cnt + "&units=" + units + "&appid=" + APIKEY)
        .then(function (response) {
            console.log(response.status);
            response.json().then(function (data) {
                console.log(data);
            })
        })
}

searchForm.on("submit", getWeather);