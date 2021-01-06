///// GLOBAL VARIABLES /////
var cityName = "";
var testCity = "London";
var oldSearches = [];
var APIKey = "a479558350b81143a0cd27e30716cf87";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + testCity + "&units=imperial&appid=" + APIKey;

///// EVENT LISTENERS /////
// Get the city name and add button
$("#submit").on("click", function(event) {
    event.preventDefault();
    cityName = $("#city-name").val();
    console.log(cityName);
    saveSearch();
    writeToStorage();  
})

///// FUNCTIONS /////
// Get the API info.
$.ajax({
    url: queryURL,
    method: "GET",
    cors: true
}).then(function(response) {
    console.log(response);
});


// Save user search to list.
function saveSearch() {
    var newCity = {city: cityName};
    oldSearches.push(newCity);
    console.log(oldSearches);
}

// Store search list.
function writeToStorage() {
    localStorage.setItem("weatherSearch", JSON.stringify(oldSearches));
}






















