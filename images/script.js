const userTab = document.querySelector('.your-weather');
const searchTab = document.querySelector('.search-weather');
const userContainer = document.querySelector('.weather-container');

const grantAccessContainer = document.querySelector('.grant-location-container');
const searchForm = document.querySelector('.search-weather-container');
const loadingScreen = document.querySelector('.loading-container');
const userInfoContainer = document.querySelector('.user-location-container');
const errorContainer = document.querySelector('.error-404-container');

let currentTab = userTab;
const API_KEY = "870bacb61a48cb3d272cfba9bcd59713"
currentTab.classList.add("current-tab");

// errorContainer.classList.remove("active");   

getFromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // ab me your weather tab ma aa gaya hun so let's check local storage for coordinates, if we have saved
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener('click', () => {
    switchTab(userTab);
});

searchTab.addEventListener('click', () => {
    switchTab(searchTab);
});

// check if corrdinates is saved in session storage or not
function getFromSessionStorage() {
    const localCoordinates = localStorage.getItem("user-coordinates");
    // je item name save karyu hoy ej send karvanu

    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}



async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    
    // make grant access container invisible and loader visible
    
    grantAccessContainer.classList.remove("active");
    errorContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    

    //API call
    try{
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        let data = await response.json();

        loadingScreen.classList.remove("active");
        errorContainer.classList.remove("active");
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);

    }
    catch(err){
        loadingScreen.classList.remove("active");
        console.log("Bhai error aaya" , err);
    }
}

function renderWeatherInfo(data){
    // fetch all element from html 

    const cityName = document.querySelector('.cityName');
    const countryIcon = document.querySelector('.cityFlag');
    const desc = document.querySelector('.data-description');
    const weatherIcon = document.querySelector('.weatherIcon');
    const temp = document.querySelector('.temperature-data');
    const windspeed = document.querySelector('.windspeed-data');
    const humidity = document.querySelector('.humidity-data');
    const cloud = document.querySelector('.cloud-data');

    // fetch value from json and put into UI
    cityName.innerText = data?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.innerText = data?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    // temp.innerText = data?.main?.temp;
    // windspeed.innerText = data?.wind?.speed;
    temp.innerText = `${data?.main?.temp} °C`;
    windspeed.innerText = `${data?.wind?.speed} m/s`;
    humidity.innerText = `${data?.main?.humidity} %`;
    cloud.innerText = `${data?.clouds?.all} %`;
}

const grantAccessButton = document.querySelector('.grant-access-btn');
grantAccessButton.addEventListener("click", getLocation);

function getLocation() {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert("No geolocation support");
    }
}

async function showPosition(position){
    let lati = await position.coords.latitude;
    let longi = await position.coords.longitude;

    const userCoordinates = {
        lat:  position.coords.latitude,
        lon:  position.coords.longitude,
    }
    localStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const searchInput = document.querySelector('.search-input');

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else{
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    errorContainer.classList.remove("active");

    try{
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        let data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
        if (!data.sys) {
            throw data;
        }

    }
    catch(err){
        console.log("Bhai error aaya: ", err);
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.remove("active");
        errorContainer.classList.add("active");
        // apiErrorBtn.addEventListener("click", fetchUserWeatherInfo);
    }
}
