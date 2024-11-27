// src/components/Weather.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css'
const Weather = () => {
    const [weather, setWeather] = useState(null);
    const [city, setCity] = useState('');
    const [time, setTime] = useState('');

    useEffect(() => { const updateTime = () => { const currentDate = new Date(); 
        setTime(currentDate.toLocaleTimeString()); };
         const timerId = setInterval(updateTime, 1000);
          return () => clearInterval(timerId); }, []);

    const fetchWeather = async () => {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=e01a0bbd240562ef02389ccabcf02985`);
            setWeather(response.data);
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    };

    return (
        <div className='body'>
            <div className='container'>
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city"
                />
                <button onClick={fetchWeather}>Get Weather</button>
                {weather && (
                    <div className='weather-info'>
                        <h2>{weather.name}</h2>
                        <h2 className='time'>Current Time: {time}</h2>
                        <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="Weather icon" />
                        <p>{weather.weather[0].description}</p>
                        <p>{Math.round(weather.main.temp - 273.15)}°C</p>
                        <p>Feels Like: {Math.round(weather.main.feels_like - 273.15)}°C</p>
                        <p>Humidity: {weather.main.humidity}%</p>
                        <p>Wind Speed: {weather.wind.speed} km/h</p>
                        <div className="cloud"></div>
                        <div className="sun"></div>
                    </div>
                )}
            </div>
        </div>

    );

};

export default Weather;
