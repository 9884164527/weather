import './style.css'

import * as React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import sun from './assets/sun.png';
import wind from './assets/wind.png';
import human from './assets/human.png';
import  { Axios } from 'axios';

import { useState } from 'react';
function Weather()  {
   
     const [city,setCity] = useState("");
     const [weather, setWeather] = useState(null);

     const API_KEY = '9a2050462ce9fadf3557cc4291dcb8ba';
    const getWeather = async () => {
        try {
            const response = await Axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
            setWeather(response.data);

        }
        catch (err) {
            alert('error getting weather data')
        }
    };
    return (
        <div className="body">
            <div className='container1'>
                <h1 className='title'>WEATHER APP</h1>
                <div className='search-container' for='cityname'>

                    <input type='text' placeholder='Enter city name' name='cityname' className='input-cityname' value={city} onChange={e => setCity(e.target.value)} />
                    <button className='search-icon' onClick={getWeather}>
                        <SearchIcon fontSize='medium' />
                    </button>
                </div>

                <img src={sun} alt='sun' className='sun-img' />
                <h2 className='temperature' >°C</h2>
                <h3 className='city'>New York</h3>


                <div className='weather-data'>
                    <div className='weather-details'>
                       <img src={human} alt='human' className='human-img'/>
                        
                            <p>Humidity: 90%</p>
                            
                            
                        
                    </div>

                    <div className='weather-forecast'>
                        <img src={wind} alt='wind' className='wind-img' />
                     
                     <p>Wind Speed: 5 mph</p>
                    
                    

                    </div>

                </div>


            </div>
        </div>
    );
}
export default Weather;