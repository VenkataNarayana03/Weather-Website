const apiKey = '680d31253dcc4e08b4a54228242911'; 
const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=`;

const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const clearButton = document.getElementById('clear-button'); // Added clear button
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const conditionElement = document.getElementById('condition');
const forecastElement = document.getElementById('forecast'); // New element
const body = document.body; // Reference to the body element

// Function to initiate weather search
function fetchWeather(city) {
    const url = `${apiUrl}${city}&days=4`; // Fetching 4-day forecast to skip today's data
    console.log(`Fetching weather data from URL: ${url}`); // Log the URL being fetched
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(`API response error: ${data.error.message}`);
            }

            // Display new data
            locationElement.textContent = data.location.name;
            temperatureElement.textContent = `${(data.current.feelslike_c)}°C`;
            conditionElement.textContent = data.current.condition.text;

            // Display 3-day forecast, skipping today's data
            displayForecast(data.forecast.forecastday.slice(1, 4));

            // Clear the input field for a new search
            cityInput.value = '';
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

// Function to display the 3-day forecast
function displayForecast(forecast) {
    forecastElement.innerHTML = ''; // Clear previous forecast

    forecast.forEach(day => {
        const date = new Date(day.date).toDateString();
        const condition = day.day.condition.text;
        const maxTemp = day.day.maxtemp_c;
        const minTemp = day.day.mintemp_c;

        const forecastHTML = `
            <div class="forecast-day">
                <h3>${date}</h3>
                <p>Condition: ${condition}</p>
                <p>Max Temp: ${maxTemp}°C</p>
                <p>Min Temp: ${minTemp}°C</p>
            </div>
        `;

        forecastElement.innerHTML += forecastHTML;
    });

    // Change background color based on current condition of the first forecast day
    changeBackgroundColor(forecast[0].day.condition.text);
}

// Search when clicking the search button
searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    }
});

// Trigger search with "Enter" key
cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeather(city);
        }
    }
});

// Clear the input and weather details when clicking the clear button
clearButton.addEventListener('click', () => {
    cityInput.value = ''; // Clear the input field
    locationElement.textContent = ''; // Clear the location element
    temperatureElement.textContent = ''; // Clear the temperature element
    conditionElement.textContent = ''; // Clear the condition element
    forecastElement.innerHTML = ''; // Clear the forecast element
    body.style.backgroundColor = '#f0f8ff'; // Reset background color to default
});

// Function to change background color based on weather condition
function changeBackgroundColor(condition) {
    switch (condition.toLowerCase()) {
        case 'clear':
            body.style.backgroundColor = '#e6f9fc'; // Sky blue
            break;
        case 'clouds':
            body.style.backgroundColor = '#e6f9fc'; // Light steel blue
            break;
        case 'rain':
            body.style.backgroundColor = '#53789e'; // Steel blue
            break;
        case 'snow':
            body.style.backgroundColor = '#93e7fb'; // White
            break;
        case 'thunderstorm':
            body.style.backgroundColor = '#8768c4'; // Dark gray
            break;
        default:
            body.style.backgroundColor = '#f0f8ff'; // Default light background
            break;
    }
}
