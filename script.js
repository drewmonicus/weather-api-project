function getWeather() {
  const apiKey = "fcc04d2c713c3b738112393634593a9c";
  const city = document.getElementById("city").value;
  const apiURL = `http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=${apiKey}`;
  const geocodeURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=2&appid=${apiKey}`;

  // get lat and long for given city, throw error if not found
  fetch(geocodeURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data.length > 0) {
        const lat = data[0].lat;
        const lon = data[0].lon;

        const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        return fetch(forecastURL);
      } else {
        alert("City not found, please try again");
        throw new Error("City not found");
      }
    })
    .catch((error) => {
      console.error(error);
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response not ok");
      }
      return response.json();
    })
    .then((data) => {
      displayWeather(data);
    })
    .catch((error) => console.error(error));
}

function displayWeather(forecastData) {
  const forecastList = forecastData.list.slice(0, 8);
  const weatherInfo = document.querySelector(".weather-info");
  const info = document.querySelector(".info");
  const weatherDescriptionHTML = document.querySelector(".weather-description");
  const city = forecastData.city.name;
  const weatherDescription = forecastData.list[0].weather[0].description;
  //clear HTML when refreshed
  weatherInfo.innerHTML = "";
  info.innerHTML = "";

  console.log(forecastData);
  // add HTML for each forecast
  const timeZoneOffset = forecastData.city.timezone;
  forecastList.forEach((forecast) => {
    const tempKelvin = forecast.main.temp;
    const weatherCondition = forecast.weather[0].main.toLowerCase();
    const iconURL = getWeatherIconURL(weatherCondition);
    const tempFahrenheit = Math.round(((tempKelvin - 273.15) * 9) / 5 + 32);
    const utcTime = new Date(forecast.dt_txt);
    const localTime = new Date(utcTime.getTime() + timeZoneOffset * 1000);

    const date = localTime.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const time = localTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const isNightTime = isNight(localTime.getHours()); // Check if it's night time for this forecast in local time
    const forecastHTML = `
        <div class = "forecast-container ${isNightTime ? "night" : ""}">
            <p>${date}</p> 
            <p>${time}</p> 
            <img src = "${iconURL}" />
            <p><strong>${tempFahrenheit}°F<strong></p>
        </div>
    `;
    const mainIcon = document.querySelector(".icon");
    mainIcon.innerHTML = `<img src = "${iconURL}"/> 
                            <div>${tempFahrenheit}°F</div>`;
    // update HTML
    weatherInfo.innerHTML += forecastHTML;
  });
  // expand HTML container

  info.innerHTML += city;
  weatherDescriptionHTML.innerHTML = `${weatherDescription}`;
  const container = document.querySelector(".container");
  container.classList.add("expanded");
}

function getWeatherIconURL(condition) {
  // Replace this function with your logic to map conditions to your icons
  const iconMap = {
    clear: "./animated/cloudy.svg",
    clouds: "./animated/cloudy.svg",
    rain: "./animated/rainy-6.svg",
    drizzle: "./animated/cloudy.svg",
    thunderstorm: "./animated/cloudy.svg",
    snow: "./animated/snowy-1.svg",
    // Add more mappings as needed
  };

  return iconMap[condition] || "./icons/default.png"; // Fallback to a default icon
}

function isNight(hour) {
  return hour >= 19 || hour < 6; // Night time is from 7 PM to 6 AM
}

document.getElementById("search-btn").addEventListener("click", getWeather);
