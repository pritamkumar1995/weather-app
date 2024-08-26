import React, { useEffect, useState } from 'react'
import {Oval}  from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Graph from './Graph';
function Home() {
    const [input,setInput] = useState('');
    const [weather,setWeather] = useState({
        loading: false,
        data: {},
        error: false,
        coord: null
    })
    const [cities,setStoredCities] = useState('');
    const [temp,setTemp] = useState('');
    const navigate = useNavigate();
    useEffect(()=>{
       setStoredCities(JSON.parse(localStorage.getItem('storedCities')) || []);
       setTemp(JSON.parse(localStorage.getItem('storedTemp')) || []);
    },[]);

    const search = async(event) =>{
     event.preventDefault();
     setInput('');
     setWeather({...weather, loading: true});
     const url = 'https://api.openweathermap.org/data/2.5/weather';
     const apiKey = 'f00c38e0279b7bc85480c3fe775d518c';
     await axios.get(url,{
        params :{
            q: input,
            units: 'metric',
            appid: apiKey,
        }
     })
     .then((res)=>{
        console.log('response data',res);
        setWeather({data: res.data, coord: res.data.coord, loading: false, error: false});
        if(!cities.includes(res.data.name)){
            cities.push(res.data.name);
            temp.push(res.data.main.temp);
            localStorage.setItem('storedCities',JSON.stringify(cities));
            localStorage.setItem('storedTemp',JSON.stringify(temp));
            setStoredCities(cities);
            setTemp(temp);
        }
     })
     .catch((error)=> {
        setWeather({...weather, data:{}, error: true});
        setInput('');
        console.log('error message',error);
     });
    }

    const GoToHistoryPage = ()=>{
        navigate('/history');
    }

  return (
    <div className='App'>
        <div className='title_container'>
        <h1>Weather</h1>
        </div>
        <div className='search_bar'>
           <input
            type="text"
            className='city-search'
            placeholder='City...'
            name="query"
            value ={input}
            onChange={(event)=>setInput(event.target.value)}
           />
           <button className='button_search' onClick={search}>Search</button>
           <button className='button_history' onClick={GoToHistoryPage}>History</button>
        </div>

        {weather && !weather.error && weather.coord && <Graph weather={weather} coord={weather.coord}/>}
        {weather.loading && (
            <>
            <br />
            <br />
            <Oval type="Oval" color="black" height={100} width={100} />
            </>
        )}
        {weather.error && (
            <>
            <br />
            <br />
            <span className="error-message">
                City Not Found, Sorry!
            </span>
            </>
        )}
    </div>
  )
}

export default Home