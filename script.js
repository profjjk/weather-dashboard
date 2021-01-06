///// GLOBAL VARIABLES /////
var cityName = "";
var oldSearches = [];
var APIKey = "a479558350b81143a0cd27e30716cf87";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + APIKey;


///// FUNCTIONS /////
$(document).ready(function() {
    // Get the API info.
    $.ajax({
        url: queryURL,
        method: "GET",
        cors: true
    }).then(function(response) {
        
    });

});

// Create a button from the search.
function createButton() {
    prevSearch = $("<button>");
    prevSearch.addClass("btn btn-light w-75");
    prevSearch.text(cityName);
    $("#previous-search").prepend(prevSearch);
}






///// EVENT LISTENERS /////
    // Get the city name and add button
    $("#submit").on("click", function(event) {
        event.preventDefault();
        cityName = $("#city-name").val();
        createButton();

        
})















