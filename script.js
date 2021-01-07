// ---------------------- //
///// GLOBAL VARIABLES /////
// ---------------------- //

var cityName = "";
var cityLon = "";
var cityLat = "";
var testCity = "London";
var searchList = [];
var APIKey = "a479558350b81143a0cd27e30716cf87";


// --------------- //
///// LOAD PAGE /////
// --------------- //

// When the page loads, retrieve previous search results from local storage, if any exist, then add them to a list.
function retrieveFromStorage() {
    if (localStorage === "") {
        return;
    } else {
        searchList = JSON.parse(localStorage.getItem("weatherSearch")) || [];
    }
}
retrieveFromStorage();

// Create search buttons for previous search results so I can easily look them up again.
function loadSearchList() {
    for (var i = 0; i < searchList.length; i++) {
        var oldCity = searchList[i].city;
        oldSearch = $("<button>");
        oldSearch.addClass("btn btn-light w-100 text-start fw-light submit");
        oldSearch.text(oldCity);
        $("#previous-search").append(oldSearch);
    } 
}
loadSearchList();


// ------------------------ //
///// SEARCH FOR WEATHER /////
// ------------------------ //

// Add user search to searchList list and save to local storage.
function saveSearch() {
    var newCity = {city: cityName};
    searchList.unshift(newCity);
    localStorage.setItem("weatherSearch", JSON.stringify(searchList));
}

// Add a new search button to previous search results.
function createButton() {
    var newSearch = $("<button class=\"btn btn-light w-100 text-start fw-light submit\">").text(cityName);
    for (var i = 0; i < searchList.length; i++) {
        if (searchList[i] === cityName) {
            return;
        } else {
            $("#previous-search").prepend(newSearch);
        }
    }
}

// Query OpenWeather API when search button is clicked.
$("#submit").on("click", function(event) {
    event.preventDefault();

    // Get city name from input and execute save functions.
    cityName = $("#city-name").val();
    saveSearch();
    createButton();

    // Wait for the ajax query to finish.
    $.when(currentWeather(), forecastWeather()).done(function(weatherData, forecastData) {

        // Display results from currentWeather API.
        console.log("Current Weather Data: " + weatherData);
        $("#city").text(weatherData[0].name);
        $("#date").text("(" + dayjs.unix(weatherData[0].dt).format("M/D/YYYY") + ")");
        $("#temp").text("Temperature: " + Math.floor(weatherData[0].main.temp) + "\u00B0F");
        $("#humid").text("Humidity: " + weatherData[0].main.humidity + "%");
        $("#wind").text("Wind speed: " + Math.floor(weatherData[0].wind.speed) + " mph");

        // Display results from forcastWeather API.
        console.log("Forecast Weather Data: " + forecastData);
        for (var i = 0; i < 5; i++) {
            var date = dayjs.unix(forecastData[0].list[i].dt).format("M/D/YYYY");
            $("#day" + (i+1) + "-title").text(date);
            $("#day" + (i+1) + "-temp").text("Temp: " + forecastData[0].list[i].main.temp  + "\u00B0");
            $("#day" + (i+1) + "-humid").text("Humidity: " + forecastData[0].list[i].main.humidity + "%");
        }

        // Display results from uvIndex API.
        // uvIndex(function(uvData) {
        //     console.log(uvData);
        // })
    })
})


//------------------ //
///// API QUERIES /////
//------------------ //

// Current Weather Data API
function currentWeather() {
    return $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + APIKey,
        method: "GET",
        cors: true,
        success: function(response) {
            var weatherSTR = JSON.stringify(response);
            console.log("Current Weather API: " + weatherSTR);

        //     // Save longitude and latitude data for uvIndex query.
        //     var coordinates = weatherSTR.coord;
        //     console.log(coordinates);
        //     cityLon = weatherSTR.coord.lon;
        //     cityLat = weatherSTR.coord.lat;
        //     console.log("Longitude: " + cityLon + " | " + "Latitude: " + cityLat);
        }
    });
}

// 5 Day Forecast API
function forecastWeather() {
    return $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&cnt=5&appid=" + APIKey,
        method: "GET",
        cors: true,
        success: function(response) {
            var forecastSTR = JSON.stringify(response);
            console.log("Forcast API: " + forecastSTR);
        }
    });
};

// One Call API - get UV Index.
// function uvIndex(cityLon, cityLat) {
//     var lon = cityLon;
//     var lat = cityLat;
//     return $.ajax({
//         url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude={part}&appid=" + APIKey,
//         method: "GET",
//         cors: true,
//         success: function(response) {
//             var uvindexSTR = JSON.stringify(response);
//             console.log("UV Index API: " + uvindexSTR);
//         }
//     });
// };



///// TO DO /////
// Clear search input after search.
// Add functionality to previous search buttons.
// Prevent the creation of duplicate previous search buttons.
// Color code the UV Index based on value.
// (optional) Limit the number of previous searches saved.

///// STUCK /////
// Get the UV Index to display using longitude and latitude.
// Get the forecast dates to display accurately.
// Get the weather icons to appear.