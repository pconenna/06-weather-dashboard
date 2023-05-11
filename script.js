var searchform = document.querySelector('#searchform');
var btnSearch = document.querySelector('#btnSearch');
var searchInput = document.querySelector('#searchInput');
var currentInfo = document.querySelector('#currentInfo');
var searchHistory = document.querySelector('#searchHistory');
var iconEl = document.querySelector('#icon');
var daysDiv = document.querySelector('#daysDiv');
var storedHistory = JSON.parse(localStorage.getItem("searches"))
if(storedHistory == null){
    storedHistory = [];
    localStorage.setItem("searches", JSON.stringify(storedHistory))
}
// var day1 = document.querySelector('#day1');
// var day2 = document.querySelector('#day2');
// var day3 = document.querySelector('#day3');
// var day4 = document.querySelector('#day4');
// var day5 = document.querySelector('#day5');
var lat,lon;
getStoredHistory()
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
                console.log(data)
                lon = data[0].lon;
                lat = data[0].lat;
                getCurrentWeather(lon,lat)
                getForceast(lon,lat)
                addSearchHistory(data[0].name)

            })
        }
    })
}

// i had to put some partially redundant code because i need event listeners for the search from and the history buttons
function getCoordsHistory(event){
    var searchTerm = event.target.textContent.trim();
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
                getCurrentWeather(lon,lat)
                getForceast(lon,lat)

            })
        }
    })
}

function getCurrentWeather(lon, lat){
    var weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=1dfd6ca54fd859622c9fe8699a7944f0`;
    if(!lon || !lat){
        console.log("bad input")
        return;
    }
    fetch(weatherURL)
    .then(function(response){
        if(response.ok){
            response.json().then(function(data){
                showCurrentWeather(data);
            })
        }
    })
}

function showCurrentWeather(data){
    var cityName = document.querySelector("#cityName");
    var today = dayjs();
    var icon = data.weather[0].icon
    console.log(data.weather[0].icon) //figure out the icon
    var imgUrl = `https://openweathermap.org/img/wn/${icon}.png`
    iconEl.setAttribute("src",imgUrl)
    cityName.textContent = `${data.name} ${today.format('M-D-YYYY')}`;
    var currentTemp = document.querySelector('#currentTemp');
    var currentWind = document.querySelector('#currentWind');
    var currentHumidity = document.querySelector('#currentHumidity');
    currentTemp.textContent = `Temp: ${data.main.temp} °F`; //format the temp to truncate 
    currentWind.textContent = `Wind: ${data.wind.speed} MPH`;
    currentHumidity.textContent = `Humidity: ${data.main.humidity}%`;
    }

function getForceast(){
    var url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=1dfd6ca54fd859622c9fe8699a7944f0`;
    if(!lon || !lat){
        console.log("bad input")
        return;
    }
    fetch(url)
    .then(function(response){
        if(response.ok){
            response.json().then(function(data){
                // console.log(data);
                showForecast(data)
            })
        }
    })
}
function showForecast(data){
    var days = data.list;
    console.log(data)
    
    // 0,8,16,24,32 are midnight of new days
    // 4,12,20,28,36 are noon
    var dayCards = daysDiv.children 
    var cardNum = 0;
    for( var d = 0; d < days.length; d++ ){
        if((d == 0 || d%4 == 0) && d%8!=0){ //the data shown is based off the array index representing noon
            var nextDay = days[d].dt_txt
            var icon = days[d].weather[0].icon
            var t = dayjs(nextDay)
            var dayTitle = dayCards[cardNum].children[0].children[0]
            var iconE = dayTitle.nextElementSibling
            var imgUrl = `https://openweathermap.org/img/wn/${icon}.png`
            iconE.setAttribute("src",imgUrl)
            var tempEl = iconE.nextElementSibling
            var windEl = tempEl.nextElementSibling
            var humidEl = windEl.nextElementSibling
            dayTitle.textContent = t.format('M-D-YYYY');
            tempEl.textContent = `Temp: ${days[d].main.temp}°F`
            windEl.textContent = `Wind: ${days[d].wind.speed}MPH`
            humidEl.textContent = `Humidity: ${days[d].main.humidity}%`
            cardNum++;

        }
        

    }
    //accessing the icon is gonna be different for this
   
    }

function addSearchHistory(city){
    var btn = document.createElement("button")
    btn.textContent = city;
    btn.setAttribute("class", "col-9 btn btn-secondary m-3")
    btn.addEventListener("click",getCoordsHistory)
    searchHistory.appendChild(btn)
    storedHistory.push({'searchTerm':city})
    localStorage.setItem("searches", JSON.stringify(storedHistory))
}

function getStoredHistory(){
    for(var i = 0; i < storedHistory.length; i++){
        var btn = document.createElement("button")
        btn.textContent = storedHistory[i].searchTerm;
        btn.setAttribute("class", "col-9 btn btn-secondary m-3")
        btn.addEventListener("click",getCoordsHistory)
        searchHistory.appendChild(btn)
    }
    
}
searchform.addEventListener("submit", getCoords)
// var btnH = document.querySelector('#btnHistory')
// btnH.addEventListener("click",getCoordsHistory)

//event handler for every button

//dynamically generate the search history

//dynamically replace the content in the cards


//api calls 