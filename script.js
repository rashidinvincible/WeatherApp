const userTab = document.querySelector("[data-userWeather");
const searchTab = document.querySelector("[data-searchWeather");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer= document.querySelector(".user-info-container");

const errorImage = document.createElement('img');
errorImage.src = 'not-found.png'; 
errorImage.alt = 'Error';
errorImage.style.display = 'none'; 
document.body.appendChild(errorImage)
let currentTab = userTab;
const API_KEY = "94fe9452fa0b518d91a4af260d7b3fde";
currentTab.classList.add("current-tab");
 getfromSessionStorage();





function switchTab(clickedTab)
{
    if(clickedTab != currentTab)
    {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active"))
        {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }

        else
        {
          searchForm.classList.remove("active")
          userInfoContainer.classList.remove("active")
          getfromSessionStorage();

        }
    }  
}


userTab.addEventListener("click",function()
{
  switchTab(userTab);
});

searchTab.addEventListener("click",function()
{
    switchTab(searchTab);
});
                                                                 
function getfromSessionStorage()
{
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates)
    {
        grantAccessContainer.classList.add("active")
    }
    
    else
    {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates)
    }
}

async function fetchUserWeatherInfo(coordinates)
{
 const {lat,lon}=coordinates
 grantAccessContainer.classList.remove("active")
 loadingScreen.classList.add("active")
 try
 {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
}

 catch(err)
{
   loadingScreen.classList.remove("active");
   errorImage.style.display = 'block';
   userContainer.classList.remove("active");
   console.error('Error fetching user weather data:', err);
}


}

function renderWeatherInfo(weatherInfo)
{
    const cityName = document.querySelector("[data-cityName]")
    const countryIcon = document.querySelector("[data-countryIcon]")
    const desc = document.querySelector("[data-weatherDesc]")
    const weatherIcon = document.querySelector("[data-weatherIcon]")
    const temp = document.querySelector("[data-temp]")
    const windspeed = document.querySelector("[data-windspeed]")
    const humidity = document.querySelector("[data-humidity]")
    const cloudiness = document.querySelector("[data-cloudiness]")


    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
}

function getLocation()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition)
    }

    else
    {

    }
}

function showPosition(position)
{
    const userCoordinates = 
    {
    lat: position.coords.latitude,
    lon: position.coords.longitude,

    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates))
    fetchUserWeatherInfo(userCoordinates)
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);
const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",function(e)
{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
       return;
    else
      fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city)
{
    
    
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try
    {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }

    catch(e)
    {
       
       loadingScreen.classList.remove("active");
       userContainer.classList.remove("active");
       errorImage.style.display = 'block'; 
       console.error('Error fetching user weather data:', e);

    } 


}
