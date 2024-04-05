import { useEffect, useState } from 'react'
import './App.css'
import PropTypes from "prop-types"
import clearIcon from "./assets/clear.jpg"
import cloudIcon from "./assets/cloud.png"
import drizzleIcon from "./assets/drizzle.png"
import rainIcon from "./assets/rain.jpg"
import windIcon from "./assets/wind.png"
import snowIcon from "./assets/snow.jpg"
import humidityIcon from "./assets/humidity.png"


const WeatherDetails = ({icon,temp,city,country,lat,log,humidity,wind}) => {
  return (<>
    <div className='image'>
        <img src={icon} alt="Image" />
    </div>
    <div className='temp'>{temp}°C</div>
    <div className='location'>{city}</div>
    <div className='country'>{country}</div>
    <div className='cord'>
      <div>
        <span className='lat'>Latitude</span>
        <span>{lat}</span>
      </div>
      <div>
        <span className='log'>Longitude</span>
        <span>{log}</span>
      </div>
    </div>
    <div className='data-container'>
      <div className='element'>
        <img src={humidityIcon} alt="Humidity" className='icon' />
        <div className='data'>
          <div className='humidity-percent'>{humidity} %</div>
          <div className='text'>Humidity</div>
        </div>
      </div>
      <div className='element'>
        <img src={windIcon} alt="Wind" className='icon' />
        <div className='data'>
          <div className='wind-percent'>{wind} Km/h</div>
          <div className='text'>Wind Speed</div>
        </div>
      </div>
    </div>
    </>
    )
}
WeatherDetails.propTypes={
  icon:PropTypes.string.isRequired,
  temp:PropTypes.number.isRequired,
  city:PropTypes.string.isRequired,
  country:PropTypes.string.isRequired,
  humidity:PropTypes.number.isRequired,
  wind:PropTypes.number.isRequired,
  lat:PropTypes.number.isRequired,
  log:PropTypes.number.isRequired,
}

function App() {
  let api_key="e0a9e61374349f29e703e763ee385c1c"
    const [icon,setIcon]=useState(snowIcon)
    const [temp, setTemp]=useState(0)
    const [city,setCity]=useState("chennai")
    const [country,setCouuntry]=useState("IN")
    const [lat,setLat]=useState(0)
    const [log,setLog]=useState(0)
    const [humidity,setHumidity]=useState(0)
    const [wind,setWind]=useState(0)
    const [text,setText]=useState("chennai")
    const [cityNotFound,setCityNotFound]=useState(false)
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState(null)

    const weatherIconMap={
      "01d":clearIcon,
      "01n":clearIcon,
      "02d":cloudIcon,
      "02n":cloudIcon,
      "03d":drizzleIcon,
      "03n":drizzleIcon,
      "04d":drizzleIcon,
      "04n":drizzleIcon,
      "09d":rainIcon,
      "09n":rainIcon,
      "10d":rainIcon,
      "10n":rainIcon,
      "13d":snowIcon,
      "13n":snowIcon,
    }




    
    const search=async () =>{

      setLoading(true);
      let url=`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;
      try{
        let res= await fetch(url);
        let data =await res.json();
        
        if(data.cod==="404"){
          console.error("City not found")
          setCityNotFound(true);
          setLoading(false);
          return;
         }

         setHumidity(data.main.humidity)
         setWind(data.wind.speed)
         setTemp(Math.floor(data.main.temp))
         setCity(data.name)
         setCouuntry(data.sys.country)
         setLat(data.coord.lat)
         setLog(data.coord.lon)
         const weatherIconCode=data.weather[0].icon
         setIcon(weatherIconMap[weatherIconCode] ||clearIcon)
         setCityNotFound(false)
         
      }catch(error){
        console.error("An error occurred:",error.message);
        setError("An  error occurred while fetching weather data.");
      }finally{
        setLoading(false)
      }
    }
    const handleCity=(event)=>{
      setText(event.target.value)

    }    
    const handleKeyDown=(event)=>{
      if(event.key ==="Enter"){
        search();
      }
    }

    useEffect(function(){
      search();
    },[]);


  return (
    <div className='container'>
      <div className='input-container'>
        <input type="text" className='city-input'
        placeholder='Search City'  onChange={handleCity}
        value={text} onKeyDown={handleKeyDown}/>
        <div className='search-icon' onClick={()=>{search()}}>
          <i className='fas fa-search'></i>
        </div>
      </div>
{!loading && !cityNotFound &&  <WeatherDetails icon={icon} temp={temp} city={city}
      country={country}
      lat={lat}
      log={log}
      humidity={humidity}
      wind={wind}/>}
      {loading && <div className='loading-message'>Loading...</div>}
       {error && <div className='error-message'>{error}</div>}
      {cityNotFound &&<div className='city-not-found'> City Not Found</div>}
      <p className='copyright'>Designed by <span>Suriya</span></p>
    </div>
  )
}

export default App
