var searchForm = $("#search");
var searchInput = $("#search-input");

var savedHistory = [];
if (localStorage.getItem("history") !== null) {
    savedHistory = JSON.parse(localStorage.getItem("history"));
} else {
    localStorage.setItem("history", JSON.stringify(savedHistory));
    savedHistory = JSON.parse(localStorage.getItem("histroy"));
}

function getWeather(event) {
    event.preventDefault();
    console.log("Test");
}

searchForm.on("submit", getWeather);