function searchWeather() {
  const searchInputValue = document.getElementById("search").value;
  const weatherDataSection = document.getElementById("weather-data");

  if (!searchInputValue) {
    weatherDataSection.innerHTML = `
    <div>
      <h2>C'mon, that's not a city!</h2>
      </br>
      <h4  style="font-weight: normal;">Please try again with a valid <u>city name</u>.</h4>
    </div>
    `;
    return;
  } else {
    fetchWeather();
  }
}

document.getElementById("search").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    searchWeather();
  }
});

document.getElementById("submit").addEventListener("click", function () {
  searchWeather();
});

async function fetchWeather() {
  const searchInputValue = document.getElementById("search").value;
  const weatherDataSection = document.getElementById("weather-data");
  const apiKey = "03da174eb2c9ab48b440db94138ebcec";

  async function getLonAndLat() {
    const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInputValue.replace(
      " ",
      "%20"
    )},IT&limit=1&appid=${apiKey}`;
    const response = await fetch(geocodeURL);

    if (!response.ok) {
      console.log("Bad response! ", response.status);
      return;
    }

    const data = await response.json();

    if (data.length == 0) {
      weatherDataSection.innerHTML = `
            <div>
              <h2>C'mon, "${searchInputValue}" is not an Italian city!</h2>
              </br>
              <h4  style="font-weight: normal;">Please try again with a valid <u>Italian city name</u>.</h4>
            </div>
            `;
      return;
    } else {
      return data[0];
    }
  }

  async function getWeatherData(lon, lat) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    const response = await fetch(weatherURL);

    if (!response.ok) {
      console.log("Bad response! ", response.status);
      return;
    }

    const data = await response.json();

    weatherDataSection.style.display = "flex";

    weatherDataSection.innerHTML = `
            <img src="https://openweathermap.org/img/wn/${
              data.weather[0].icon
            }.png" alt="${data.weather[0].description}" width="100" />
            <div>
                <h2 class='cityName'>${data.name}</h2>
                <p class='spacingT-W'><strong>Temperature:</strong> ${Math.round(
                  data.main.temp - 273.15
                )}°C</p>
                <p><strong>Weather:</strong> ${data.weather[0].description}</p>
            </div>
        `;
  }

  document.getElementById("search").value = "";
  const geocodeData = await getLonAndLat();
  if (geocodeData) {
    await getWeatherData(geocodeData.lon, geocodeData.lat);
  }
}
