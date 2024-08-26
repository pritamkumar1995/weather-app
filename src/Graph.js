import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, defs, stop } from 'recharts';
import './App.css';

const Graph = (props) => {
  const [forecastData, setForecastData] = useState([]);
  const [dailyForecasts, setDailyForecasts] = useState([]);

  useEffect(() => {
    const fetchWeatherForecast = async () => {
      const apiKey = 'f00c38e0279b7bc85480c3fe775d518c';
      const { lat, lon } = props.coord;
      const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

      try {
        const response = await axios.get(apiUrl);
        const hourlyData = response.data.list;
        const dailyData = hourlyData.reduce((acc, entry) => {
          const date = new Date(entry.dt * 1000);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
          if (!acc[dayName]) {
            acc[dayName] = {
              dayName,
              temp: entry.main.temp,
              weatherIcon: entry.weather[0].icon,
              weatherDescription: entry.weather[0].description,
            };
          }
          return acc;
        }, {});

        const nextFiveDays = Object.values(dailyData).slice(0, 5);
        setDailyForecasts(nextFiveDays);

        const chartData = hourlyData.slice(0, 7).map((entry) => ({
          time: new Date(entry.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          temp: entry.main.temp,
          humidity: entry.main.humidity,
        }));
        setForecastData(chartData);
      } catch (error) {
        console.error('Error fetching weather forecast:', error);
      }
    };

    fetchWeatherForecast();
  }, [props.coord]);

const toDateFunction = () => {
    const WeekDays = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
    ];
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const currentDate = new Date();
    const day = `${WeekDays[currentDate.getDay()]}`;
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    return day + " " + formattedTime;
  };

  return (
    <div className='graph'>
      {props.weather && props.weather.data && props.weather.data.main && (
        <div className='data-show'>
          <div className="city-name">
            <h2>
              {props.weather.data.name}, <span>{props.weather.data.sys.country}</span>
            </h2>
          </div>
          <div className="date">
            <span>{toDateFunction()}</span>
          </div>
          <div className="icon-temp">
            <img
              src={`https://openweathermap.org/img/wn/${props.weather.data.weather[0].icon}@2x.png`}
              alt={props.weather.data.weather[0].description}
            />
            {Math.round(props.weather.data.main.temp)}
            <sup className="deg">°C</sup>
          </div>
        </div>
      )}
      <ResponsiveContainer width="90%" height={200}>
        <AreaChart data={forecastData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="10%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" name="Time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="temp" stroke="#8884d8" fill="url(#gradient)">
            <LabelList dataKey="temp" position="top" />
          </Area>
        </AreaChart>
      </ResponsiveContainer>
      <div className='daily-forecast'>
        {dailyForecasts.length > 0 && (
          <div className='forecast'>
            {dailyForecasts.map((day, index) => (
              <div key={index} className='forecast-day'>
                <div className="day-name">{day.dayName}</div>
                <img
                  className="weather-icon"
                  src={`https://openweathermap.org/img/wn/${day.weatherIcon}@2x.png`}
                  alt={day.weatherDescription}
                />
                <div className="temperature">
                  {Math.round(day.temp)}
                  <sup className="deg">°C</sup>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Graph;