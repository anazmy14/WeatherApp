import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../Components/Loader";
import LineChart from "../Components/LineChart";
import BarChart from "../Components/BarChart";
import PieChart from "../Components/PieChart";
import PercentChart from "../Components/PercentChart";
import Collapse from "../Components/Collapse";
import { TiLocation } from "react-icons/ti";

export default function City() {
  const { city, country } = useParams();
  const [currentWeather, setCurrentWeather] = useState(null);
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    const data =
      await axios.get(`https://api.worldweatheronline.com/premium/v1/weather.ashx?key=b1dc4e3642144613bfa184304222003&q=
        ${city},${country}&fx24=yes&format=json&includelocation=yes`);
    
       console.log(data.data.data) 
    setCurrentWeather({
      city: data.data.data.nearest_area[0].region[0].value,
      temp: data.data.data.current_condition[0].temp_C,
      desc: data.data.data.current_condition[0].weatherDesc[0].value,
      feelsLike: data.data.data.current_condition[0].FeelsLikeC,
      time: data.data.data.current_condition[0].observation_time,
      astronomy: { ...data.data.data.weather[0].astronomy[0] },
      humidity : data.data.data.current_condition[0].humidity,
      uv : data.data.data.current_condition[0].uvIndex,
      wind : data.data.data.current_condition[0].windspeedKmph,
      monthlyAvg: data.data.data.ClimateAverages[0].month.map((month) => {
        return {
          month: month.name,
          temp: month.avgMinTemp,
        };
      }),

      monthlyRain: data.data.data.ClimateAverages[0].month.map((month) => {
        return {
          month: month.name,
          value: month.avgDailyRainfall,
        };
      }),
      nextDays: data.data.data.weather.map((day, index) => {
        return {
          date: day.date,
          avgTemp: day.avgtempC,
          maxTemp: day.maxtempC,
          minTemp: day.mintempC,
          index,
        };
      }),
    });
  };

  if (!currentWeather) return <Loader />;

  return (
    <div>
      <div className="card card-temp">
        <h2 className="card__header">
          <TiLocation className="icon" />
          {city}, {country}{" "}
        </h2>

        <span className="card__time"> {currentWeather.time} </span>

        <p className="card__temp">
          {currentWeather.temp}°<span className="card__unit">c</span>
        </p>
        <p className="card__desc">
          Feels Like
          {" " + currentWeather.feelsLike}
          <span>°</span>
          <br />
          {currentWeather.desc}
        </p>
      </div>

      <Collapse title="Details">
          <div className="details-section">
            <div>
            <p> humidity </p>
            <PercentChart value={currentWeather.humidity}  />
            </div>
            <div>
            <p> UV Index </p>
            <PercentChart value={currentWeather.uv} levels={[2,5,8,11]} isPercent={false}  />
            </div>
            <div>
            <p> Wind </p>
            <PercentChart value={currentWeather.wind} levels={[19,29,39,50]} isPercent={false}  />
            </div>

          </div>  
        </Collapse>    

      <Collapse title="Astronomy">
        <div className="table">
          {Object.keys(currentWeather.astronomy).map((key) => (
            <div className="table__col">
              <span>{key}</span>
              <span>{currentWeather.astronomy[key]}</span>
            </div>
          ))}
        </div>
      </Collapse>

      <div className="charts-container">
        <Collapse title="2 Weeks Weather">
          <LineChart
            data={currentWeather.nextDays}
            dataKeys={["minTemp", "avgTemp", "maxTemp"]}
            colors={["#01FF70", "#FF851B", "#FF4136"]}
          />
        </Collapse>

        <Collapse title="Monthly Average Temperature">
          <BarChart data={currentWeather.monthlyAvg} />
        </Collapse>
        <Collapse title="Rain Average Per Month">
          <PieChart data={currentWeather.monthlyRain} />
        </Collapse>
        
      
      </div>
    </div>
  );
}
