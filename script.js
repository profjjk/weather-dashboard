///// GLOBAL VARIABLES /////
var cityName = "";
var oldSearches = [];
var APIKey = "a479558350b81143a0cd27e30716cf87";
var queryURL = "api.openweathermap.org/data/2.5/weather?q=London&units=imperial&appid=" + APIKey;


///// FUNCTIONS /////
$(document).ready(function() {
    // Get the API info.
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
    });

    // Get the city name.
    $("#submit").on("click", function(event) {
        event.preventDefault();

        cityName = $("#city-name").val();
        console.log(cityName);
    })










});





///// EVENT LISTENERS /////
