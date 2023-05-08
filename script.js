var searchform = document.querySelector('#searchform');
var btnSearch = document.querySelector('#btnSearch');
var searchInput = document.querySelector('#searchInput');
var currentInfo = document.querySelector('#currentInfo');
var searchHistory = document.querySelector('#searchHistory');
var historyButtons = document.querySelectorAll('.btn-secondary'); // this is a list of every button in the history
var day1 = document.querySelector('#day1');
var day2 = document.querySelector('#day2');
var day3 = document.querySelector('#day3');
var day4 = document.querySelector('#day4');
var day5 = document.querySelector('#day5');
var lat,lon;


// i need: search button, the div the history goes in, the buttons that go in there, the cards
// emojis reperesenting weather? low priority
function getCoords(event){
    event.preventDefault();
    var searchTerm = searchInput.value.trim();
    var geoCodeURL = `http://api.openweathermap.org/geo/1.0/direct?q=${searchTerm},US&limit=1&appid=1dfd6ca54fd859622c9fe8699a7944f0`
    if(!searchTerm){
        console.log("bad input")
        return;
    }
    fetch(geoCodeURL)
    .then(function(response){
        if(response.ok){
            response.json().then(function(data){
                
                lon = data[0].lon;
                lat = data[0].lat;
                getCity(lon,lat)
            })
        }
    })
}
function getCity(lon, lat){
    var weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=1dfd6ca54fd859622c9fe8699a7944f0`;
    if(!lon || !lat){
        console.log("bad input")
        return;
    }
    fetch(weatherURL)
    .then(function(response){
        if(response.ok){
            response.json().then(function(data){
                console.log(data);
                showCurrentWeather(data);
            })
        }
    })
    
function showCurrentWeather(data){
    var cityName = document.querySelector("#cityName");
    cityName.textContent = data.name;
    var currentTemp = document.querySelector('#currentTemp');
    var currentWind = document.querySelector('#currentWind');
    var currentHumidity = document.querySelector('#currentHumidity');
    currentTemp.textContent = `Temp: ${data.main.temp} *F`;
    currentWind.textContent = `Wind: ${data.wind.speed} MPH`;
    currentHumidity.textContent = `Humidity: ${data.main.humidity}%`;
    }

}
searchform.addEventListener("submit", getCoords)

//event handler for every button

//dynamically generate the search history

//dynamically replace the content in the cards


//api calls 