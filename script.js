///// GLOBAL VARIABLES /////
var cityName = "";
var cityLon = "";
var cityLat = "";
var testCity = "London";
var oldSearches = [];
var APIKey = "a479558350b81143a0cd27e30716cf87";


///// FUNCTIONS /////
// Add user search to oldSearches list.
function saveSearch() {
    var newCity = {city: cityName};
    oldSearches.unshift(newCity);
}

// Store oldSearches list in local storage.
function writeToStorage() {
    localStorage.setItem("weatherSearch", JSON.stringify(oldSearches));
}

// Retrieve oldSearches list from local storage.
function retrieveFromStorage() {
    if (localStorage === "") {
        return;
    } else {
        oldSearches = JSON.parse(localStorage.getItem("weatherSearch")) || [];
    }
}

// Load old searches as buttons.
function loadOldSearches() {
    retrieveFromStorage();
    for (var i = 0; i < oldSearches.length; i++) {
        var oldQuery = oldSearches[i].city;
        prevSearch = $("<button>");
        prevSearch.addClass("btn btn-light w-75");
        prevSearch.text(oldQuery);
        $("#previous-search").append(prevSearch);
    } 
}
loadOldSearches();

// Create a new button from the search.
function createButton() {
    prevSearch = $("<button>");
    prevSearch.addClass("btn btn-light w-75");
    prevSearch.text(cityName);
    $("#previous-search").prepend(prevSearch);
}


///// EVENT LISTENERS /////
$("#submit").on("click", function(event) {
    event.preventDefault();
    // Get city name from input.
    cityName = $("#city-name").val();
    saveSearch();
    writeToStorage();
    createButton();
    // Wait for the ajax query to finish.
    $.when(currentWeather(), forecastWeather()).done(function(response1, response2) {

        // Display current weather from query 1.
        console.log(response1);
        $("#city").text(response1[0].name);
        $("#date").text(dayjs.unix(response1[0].dt).format("M/D/YYYY"));
        $("#temp").text("Temperature: " + Math.floor(response1[0].main.temp) + "\u00B0");
        $("#humid").text("Humidity: " + response1[0].main.humidity + "%");
        $("#wind").text("Wind speed: " + Math.floor(response1[0].wind.speed) + " mph");

        // Display 5 day forecast from query 2.
        console.log(response2);
        for (var i = 0; i < 5; i++) {
            var date = dayjs.unix(response2[0].list[i].dt).format("M/D/YYYY");
            $("#day" + (i+1) + "-title").text(date);
            $("#day" + (i+1) + "-temp").text("Temperature: " + response2[0].list[i].main.temp  + "\u00B0");
            $("#day" + (i+1) + "-humid").text("Humidity: " + response2[0].list[i].main.humidity + "%");
        }
    })
})

///// API QUERIES /////
// Current Weather Data API
function currentWeather() {
    return $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + APIKey,
        method: "GET",
        cors: true
    });
};

// One Call API - get UV Index.
function uvIndex() {
    return $.ajax({
        url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude={part}&appid=" + APIKey,
        method: "GET",
        cors: true
    });
};

// 5 Day / 3 Hour Forecast API
function forecastWeather() {
    return $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&cnt=5&appid=" + APIKey,
        method: "GET",
        cors: true
    });
};