import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {FaEdit, FaTrash} from 'react-icons/fa';
import axios from 'axios';
import './App.css';

function HistoryPage() {
    const [history,setHistory] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
        const storedCities = JSON.parse(localStorage.getItem('storedCities')) || [];
        const storedTemps = JSON.parse(localStorage.getItem('storedTemp')) || [];
        const combineHistory = storedCities.map((city,index)=>({
            city,
            temp : storedTemps[index]
        }));
        setHistory(combineHistory);
    },[]);

    const GoToHome =()=>{
        navigate('/');
    }

    const handleDelete = (cityToRemove) =>{
     let cities = JSON.parse(localStorage.getItem('storedCities')) || [];
     cities = cities.filter(city => city !== cityToRemove);
     localStorage.setItem('storedCities',JSON.stringify(cities));
     let temp = JSON.parse(localStorage.getItem('storedTemp')) || [];
     const updateHistory = cities.map((city,i) => ({
        city,
        temp: temp[i],
     }));
     setHistory(updateHistory);
    }


    const search = async (city, cityToEdit) => {
        const url = 'https://api.openweathermap.org/data/2.5/weather';
        const apiKey = 'f00c38e0279b7bc85480c3fe775d518c';
        await axios.get(url, {
            params:{
                q: city,
                units: 'metric',
                appid: apiKey,
            },
        })
        .then((res)=>{
            var dataFetchName = res.data.name;
            var dataFetchTemp = res.data.main.temp;
            if(dataFetchName && dataFetchTemp){
                let cities = JSON.parse(localStorage.getItem('storedCities')) || [];
                let temps = JSON.parse(localStorage.getItem('storedTemp')) || [];
                const index = cities.indexOf(cityToEdit);
                cities[index] = dataFetchName;
                temps[index] = dataFetchTemp;
                localStorage.setItem('storedCities', JSON.stringify(cities));
                localStorage.setItem('storedTemp', JSON.stringify(temps));
                const updateHistory = cities.map((city,i) => ({
                    city,
                    temp: temps[i],
                 }));
                 setHistory(updateHistory);

            }
        })
    }

    const handleEdit = async(cityToEdit) =>{
        const newCity = prompt('Enter the new city name:',cityToEdit);;
        if(newCity && newCity!==cityToEdit){
            let cities = JSON.parse(localStorage.getItem('storedCities')) || [];
            const index = cities.indexOf(cityToEdit);
            if(index !== -1){
                await search (newCity, cityToEdit);
            }
        }
    }

    const historyList = history && history.map((item,index) => (
        <div key={index} className='list'>
           <span>{item.city}</span>
           <span>{" "+`${item.temp}°C`}</span>
           <div className='operation'>
              <span>
                <FaEdit
                onClick={()=>handleEdit(item.city)}
                style={{cursor: 'pointer', marginRight: '20px'}}
                />
              </span>
              <span>
                <FaTrash
                onClick={()=>handleDelete(item.city)}
                style={{cursor: 'pointer', marginRight: '10px'}}
                />
              </span>
           </div>
        </div>
    ));
  return (
    <div className='page'>
        <h1>HistoryPage</h1>
        <div className='list-container'>
         <button className='button-back' onClick={GoToHome}>BACK</button>
         {history.length===0? <p style={{fontSize:'20px', color:"#522828"}}> No Cities Available</p> : historyList}
        </div>
    </div>
  );
}

export default HistoryPage