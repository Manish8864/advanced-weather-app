const apiKey = "27dc25738e45d78f6c4596cd7b0cd865"; // Replace with your OpenWeatherMap API key

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const weatherResult = document.getElementById("weatherResult");
const loading = document.getElementById("loading");
const historyList = document.getElementById("historyList");
const themeToggle = document.getElementById("themeToggle");

searchBtn.addEventListener("click", () => getWeather(cityInput.value));
locationBtn.addEventListener("click", getLocationWeather);
themeToggle.addEventListener("click", toggleTheme);

// Load history on page load
loadHistory();

async function getWeather(city) {
  if (!city) {
    alert("Please enter a city name");
    return;
  }

  loading.classList.remove("hidden");
  weatherResult.innerHTML = "";

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    if (!res.ok) throw new Error("City not found");

    const data = await res.json();

    // Update UI
    weatherResult.innerHTML = `
      <p><strong>${data.name}</strong>, ${data.sys.country}</p>
      <p>🌡️ Temperature: ${data.main.temp} °C</p>
      <p>🌤️ Condition: ${data.weather[0].description}</p>
    `;

    // Change background based on weather
    changeBackground(data.weather[0].main);

    // Save to history
    saveHistory(city);

  } catch (error) {
    weatherResult.innerHTML = `<p style="color:red;">${error.message}</p>`;
  } finally {
    loading.classList.add("hidden");
  }
}

function getLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      loading.classList.remove("hidden");
      weatherResult.innerHTML = "";

      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );

        if (!res.ok) throw new Error("Unable to fetch location weather");

        const data = await res.json();
        weatherResult.innerHTML = `
          <p><strong>${data.name}</strong>, ${data.sys.country}</p>
          <p>🌡️ Temperature: ${data.main.temp} °C</p>
          <p>🌤️ Condition: ${data.weather[0].description}</p>
        `;

        changeBackground(data.weather[0].main);

      } catch (error) {
        weatherResult.innerHTML = `<p style="color:red;">${error.message}</p>`;
      } finally {
        loading.classList.add("hidden");
      }
    });
  } else {
    alert("Geolocation not supported");
  }
}

function changeBackground(condition) {
  if (condition.includes("Rain")) {
    document.body.style.background = "linear-gradient(135deg, #00c6ff, #0072ff)";
  } else if (condition.includes("Clear")) {
    document.body.style.background = "linear-gradient(135deg, #f7971e, #ffd200)";
  } else if (condition.includes("Cloud")) {
    document.body.style.background = "linear-gradient(135deg, #bdc3c7, #2c3e50)";
  } else {
    document.body.style.background = "linear-gradient(135deg, #74ebd5, #acb6e5)";
  }
}

function saveHistory(city) {
  let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  if (!history.includes(city)) {
    history.push(city);
    if (history.length > 5) history.shift(); // keep last 5
    localStorage.setItem("weatherHistory", JSON.stringify(history));
  }
  loadHistory();
}

function loadHistory() {
  let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  historyList.innerHTML = "";
  history.forEach(city => {
    const btn = document.createElement("button");
    btn.textContent = city;
    btn.addEventListener("click", () => getWeather(city));
    historyList.appendChild(btn);
  });
}

function toggleTheme() {
  document.querySelector(".container").classList.toggle("dark-mode");
}