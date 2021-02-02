// ---------------------- //
///// GLOBAL VARIABLES /////
// ---------------------- //

var cityName;
var searchList = [];
var weatherData;
var forecastData;
var uvindexData;
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

// Add user search to searchList list, save to local storage, clear input field.
function saveSearch() {
    if (cityName === "") {
        return;
    } else if (searchList.includes(cityName)) {
        return;
    } else {
        var newCity = {city: cityName};
        searchList.unshift(newCity);
        localStorage.setItem("weatherSearch", JSON.stringify(searchList));
        $("#city-name").val("");
    }
}

// Add a new search button to previous search results.
function createButton() {
    if (cityName === "") {
        return;
    } else if (searchList.includes(cityName)) {
        return;
    } else {
        var newButton = $("<button class=\"btn btn-light w-100 text-start fw-light submit\">").text(cityName);
        $("#previous-search").prepend(newButton);
    }
}

// Populate current weather section with API data.
function populateCurrent() {
    $("#current-weather").empty();
    $("#current-weather").append(`
        <h2><span id="city">${weatherData.name}</span><span id="date">(${dayjs.unix(weatherData.dt).format("M/D/YYYY")})</span><span id="weather-icon"></span></h2>
        <p id="temp">${"Temperature: " + Math.floor(weatherData.main.temp) + "\u00B0F"}</p>
        <p id="humid">${"Humidity: " + weatherData.main.humidity + "%"}</p>
        <p id="wind">${"Wind speed: " + Math.floor(weatherData.wind.speed) + " mph"}</p>
        <p><span id="uv"></span><span id="uv-num"></span></p>
    `)
    $("#weather-icon").append(`
        <img class="img-fluid" src="${"http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png"}" alt="Weather Icon"/>
    `)
}



// Populate forecast section with API data.
function populateForecast() {
    $("#forecast").empty();
    $("#forecast").append(`
    <h3>${"5-Day Forecast"}</h3>
    <div class="card-group" id="five-day">
    </div>
    `);
    for (var i = 0; i < 40; i += 8) {
        $("#five-day").append(`
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${dayjs.unix(forecastData.list[i].dt).format("M/D/YYYY")}</h5>
                    <img class="img-fluid" src="${"http://openweathermap.org/img/wn/" + forecastData.list[i].weather[0].icon + "@2x.png"}" alt="Weather Icon"/>
                    <p class="card-text">${"Temp: " + forecastData.list[i].main.temp  + "\u00B0"}</p>
                    <p class="card-text">${"Humidity: " + forecastData.list[i].main.humidity + "%"}</p>
                </div>
            </div>
        `);
    }
}

// Populate uv index with API data.
function populateUVI() {
    var uvi = uvindexData.current.uvi;
    $("#uv").text("UV Index: ");
    $("#uv-num").text(uvindexData.current.uvi);
    if (uvi < 3) {
        $("#uv-num").addClass("uv-low");
    } else if (uvi < 6) {
        $("#uv-num").addClass("uv-mod");
    } else if (uvi < 8) {
        $("#uv-num").addClass("uv-high");
    } else {
        $("#uv-num").addClass("uv-ext");
    }
}

// Query OpenWeather API when search button is clicked.
$("#submit").on("click", function(event) {
    event.preventDefault();

    // Get city name from input and execute save functions.
    cityName = $("#city-name").val();
    saveSearch();
    createButton();

    currentWeather().then(forecastWeather).then(uvIndex).then(function() {
        console.log("Weather Data " + cityName);
        console.log(weatherData);
        console.log("--------------");
        console.log("Forecast Data " + cityName);
        console.log(forecastData);
        console.log("--------------");
        console.log("UV Index Data " + cityName);
        console.log(uvindexData);
        populateCurrent();
        populateForecast();
        populateUVI();
    })
});

// Query OpenWeather API when 'this' button is clicked.
$(".submit").on("click", function(event) {
    event.preventDefault();

    // Get city name from input and execute save functions.
    cityName = $(this).text();

    currentWeather().then(forecastWeather).then(uvIndex).then(function() {
        console.log("Weather Data " + cityName);
        console.log(weatherData);
        console.log("--------------");
        console.log("Forecast Data " + cityName);
        console.log(forecastData);
        console.log("--------------");
        console.log("UV Index Data " + cityName);
        console.log(uvindexData);
        populateCurrent();
        populateForecast();
        populateUVI();
    })
});


//------------------ //
///// API QUERIES /////
//------------------ //

// Current Weather Data API
function currentWeather() {
    return $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + APIKey,
        method: "GET",
        cors: true,
        success: function(data) {
            var weatherSTR = JSON.stringify(data);
            weatherData = JSON.parse(weatherSTR);
        }
    })
}

// 5 Day Forecast API
function forecastWeather() {
    return $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=" + APIKey,
        method: "GET",
        cors: true,
        success: function(data) {
            var forecastSTR = JSON.stringify(data);
            forecastData = JSON.parse(forecastSTR);
        }
    });
};

// One Call API - get UV Index.
function uvIndex() {
    var lon = weatherData.coord.lon;
    var lat = weatherData.coord.lat;
    return $.ajax({
        url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude={part}&appid=" + APIKey,
        method: "GET",
        cors: true,
        success: function(data) {
            var uvindexSTR = JSON.stringify(data);
            uvindexData = JSON.parse(uvindexSTR);
        }
    });
};

// Display last search.
function displayLast() {
    if (searchList === []) {
        return
    } else {
        cityName = searchList[0].city
        currentWeather().then(forecastWeather).then(uvIndex).then(function() {
            populateCurrent();
            populateForecast();
            populateUVI();
        })
    }  
}
displayLast();


///// TO DO /////
// Prevent the creation of duplicate search buttons.
// (optional) Limit the number of previous searches saved.