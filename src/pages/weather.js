import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';
import  logo from './assets/weather-app.png'
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const [forecast, setForecast] = useState([]);
  

  useEffect(() => {
    const updateTime = () => {
      const currentDate = new Date();
      setTime(currentDate.toLocaleTimeString());
    };
    const timerId = setInterval(updateTime, 1000);
    return () => clearInterval(timerId);
  }, []);

  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=e01a0bbd240562ef02389ccabcf02985`
      );
      setWeather(response.data);

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=e01a0bbd240562ef02389ccabcf02985`
      );
      setForecast(forecastResponse.data.list.slice(0, 5)); // Take the first 5 entries for a 5-day forecast
      setError(''); // Clear any previous error
    } catch (error) {
      setError('Could not fetch weather data');
    }
  };

  return (
    
    <div className="overlay">
      <div className="header">
        <div className="logo-box">
          
        <img src={logo} alt='logo'/>
        <h1>Weather App</h1>
        <p>Get the current weather and 5-day forecast for any city</p>
        </div>
    
          <div className="date-box">
            <p>Date: {new Date().toLocaleDateString()}</p>
            <p>Time: {time}</p>
            <p>Day: {new Date().toLocaleString('default', { weekday: 'long' })}</p>
            <p>Month: {new Date().toLocaleString('default', { month: 'long' })}</p>
            <p>Year: {new Date().getFullYear()}</p>
          </div>
        
      </div>
      <div className="container">
        <div className='container2'>
       <div className='search-box'>
       <LocationOnIcon  /> 
        <input
        
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
        />
        
        </div>
        <button onClick={fetchWeather}>Get Weather</button>
        </div>
        {error && <p className="error">{error}</p>}
        <div className="weather-box"> 
          {weather && (
            <div className="weather-info">
              <h2>{weather.name}</h2>
              
              <img
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="Weather icon"
              />
              <p>{weather.weather[0].description}</p>
              <p>{Math.round(weather.main.temp - 273.15)}°C</p>
              <p>Feels Like: {Math.round(weather.main.feels_like - 273.15)}°C</p>
              <p>Humidity: {weather.main.humidity}%</p>
              <p>Wind Speed: {weather.wind.speed} km/h</p>
            </div>
          )}
        </div>
        <div className="forecast">
          {forecast.map((day, index) => (
            <div key={index} className="forecast-item">
              <p>{new Date(day.dt_txt).toLocaleDateString()}</p>
              <p>{Math.round(day.main.temp - 273.15)}°C</p>
              <p>{day.weather[0].description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Weather;
