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
    $.when(currentWeather(), forecastWeather()).done(function(weatherData, forecastData) {

        // Display current weather from query 1.
        console.log(weatherData);
        $("#city").text(weatherData[0].name);
        $("#date").text(dayjs.unix(weatherData[0].dt).format("M/D/YYYY"));
        $("#temp").text("Temperature: " + Math.floor(weatherData[0].main.temp) + "\u00B0");
        $("#humid").text("Humidity: " + weatherData[0].main.humidity + "%");
        $("#wind").text("Wind speed: " + Math.floor(weatherData[0].wind.speed) + " mph");
        // Save longitude and latitude data for uvIndex query.
        cityLon = weatherData[0].coord.lon;
        cityLat = weatherData[0].coord.lat;
        console.log("Longitude: " + cityLon + " | " + "Latitude: " + cityLat);

        // Display 5 day forecast from query 2.
        console.log(forecastData);
        for (var i = 0; i < 5; i++) {
            var date = dayjs.unix(forecastData[0].list[i].dt).format("M/D/YYYY");
            $("#day" + (i+1) + "-title").text(date);
            $("#day" + (i+1) + "-temp").text("Temperature: " + forecastData[0].list[i].main.temp  + "\u00B0");
            $("#day" + (i+1) + "-humid").text("Humidity: " + forecastData[0].list[i].main.humidity + "%");
        }

        // Display UV Index from query 3.
        uvIndex(function(uvData) {
            console.log(uvData);
        })
    })
})

///// API QUERIES /////
// Current Weather Data API
function currentWeather() {
    return $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + APIKey,
        method: "GET",
        cors: true,
        async: false
    });
};

// 5 Day Forecast API
function forecastWeather() {
    return $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&cnt=5&appid=" + APIKey,
        method: "GET",
        cors: true,
        async: false
    });
};

// One Call API - get UV Index.
function uvIndex() {
    return $.ajax({
        url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude={part}&appid=" + APIKey,
        method: "GET",
        cors: true,
        async: false
    });
};