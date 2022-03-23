import { useEffect, useState } from "react";
import axios from "axios";
import { TiLocation } from "react-icons/ti";
import { useParams } from "react-router-dom";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
export default function City() {
  const { city, country } = useParams();
  const [currentWeather, setCurrentWeather] = useState(null);
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    const data =
      await axios.get(`http://api.worldweatheronline.com/premium/v1/weather.ashx?key=b1dc4e3642144613bfa184304222003&q=
        ${city},${country}&fx24=yes&format=json&includelocation=yes`);

    setCurrentWeather({
      city: data.data.data.nearest_area[0].region[0].value,
      temp: data.data.data.current_condition[0].temp_C,
      desc: data.data.data.current_condition[0].weatherDesc[0].value,
      feelsLike: data.data.data.current_condition[0].FeelsLikeC,
      time: data.data.data.current_condition[0].observation_time,
      monthlyAvg: data.data.data.ClimateAverages[0].month.map((month) => {
        return {
          month: month.name,
          temp: month.avgMinTemp,
        };
      }),

      nextDays: data.data.data.weather.map((day, index) => {
        return {
          date: day.date, // new Date(day.date).toLocaleString('en-us', {  weekday: 'long' } ),
          avgTemp: day.avgtempC,
          maxTemp: day.maxtempC,
          minTemp: day.mintempC,
          index,
        };
      }),
    });
  };

  return (
    <div>
      {currentWeather && (
        <>
          <div className="card card-temp">
            <TiLocation />
            <span className="header">
              {city}, {country}{" "}
            </span>
            <br />

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

          <h3> Details </h3>

          <table>
            <tbody>
              <tr>
                <td>1</td>
                <td>2</td>
                <td>1</td>
                <td>2</td>
                <td>1</td>
                <td>2</td>
              </tr>
              <tr>
                <td>3</td>
                <td>4</td>
                <td>3</td>
                <td>4</td>
                <td>3</td>
                <td>4</td>
              </tr>
            </tbody>
          </table>

          <h3>2 Weeks Weather</h3>

          <LineChart
            data={currentWeather.nextDays}
            dataKeys={["minTemp", "avgTemp", "maxTemp"]}
            colors={["#01FF70", "#FF851B", "#FF4136"]}
          />

          <h3>Monthly Avergae</h3>

          <BarChart
            data={currentWeather.monthlyAvg}
            dataKeys={["minTemp", "avgTemp", "maxTemp"]}
            colors={["#01FF70", "#FF851B", "#FF4136"]}
          />
        </>
      )}
    </div>
  );
}
