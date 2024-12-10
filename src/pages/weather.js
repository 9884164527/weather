import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './style.css';
import logo from './assets/weather-app.png';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MicIcon from '@mui/icons-material/Mic';

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forecast, setForecast] = useState([]);
  const [isListening, setIsListening] = useState(false);

  // Initialize SpeechRecognition object using useMemo
  const recognition = useMemo(() => new (window.SpeechRecognition || window.webkitSpeechRecognition)(), []);

  useEffect(() => {
    const updateTime = () => {
      const currentDate = new Date();
      setTime(currentDate.toLocaleTimeString());
    };
    const timerId = setInterval(updateTime, 1000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setCity(transcript);
      fetchWeather(transcript); // Fetch weather data based on recognized city
    };
    recognition.onerror = (event) => {
      console.error('Speech Recognition Error:', event.error);
      setError('Could not recognize speech');
    };
  }, [recognition]);

  const startListening = () => {
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognition.stop();
  };

  const fetchWeather = async (cityName) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=e01a0bbd240562ef02389ccabcf02985`
      );
      setWeather(response.data);

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=e01a0bbd240562ef02389ccabcf02985`
      );
      setForecast(forecastResponse.data.list.slice(0, 5));
      setError('');
    } catch (error) {
      setError('Could not fetch weather data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="overlay">
      <div className="header">
        <div className="logo-box">
          <div>
            <img src={logo} alt='logo' />
            <h1>Weather App</h1>

          </div>
          <p>Get the current weather and 3hr forecast for any city</p>


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
            <div className='input-box'>
              <LocationOnIcon />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name"
              /></div>
            <button className='mic' onClick={isListening ? stopListening : startListening}>
              <MicIcon />
            </button>
          </div>
          <button className='weather-button' onClick={() => fetchWeather(city)}>Get Weather</button>
        </div>
        {isLoading && <div className="loading"></div>}
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
              <p>Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</p>
              <p>Sunset: {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</p>
              <p>Country: {weather.sys.country}</p>

            </div>
          )}
        </div>
        <div className="forecast">
          {forecast.map((day, index) => (
            <div key={index} className="forecast-item">
              <p>{new Date(day.dt_txt).toLocaleDateString()}</p>
              <img
                src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                alt="Weather icon"
              />
              <p>{day.weather[0].description}</p>
              <p>{Math.round(day.main.temp - 273.15)}°C</p>


            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Weather;
