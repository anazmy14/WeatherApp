import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./App.css";
import { geolocated } from "react-geolocated";
import { TiLocation } from "react-icons/ti";

function App({ coords }) {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    getData();
  }, [coords]);

  const getData = async () => {
    if (!coords) return;
    const data = await axios.get(
      `http://api.worldweatheronline.com/premium/v1/weather.ashx?key=b1dc4e3642144613bfa184304222003&q=
         ${coords.latitude}, ${coords.longitude} &format=json&includelocation=yes`
    );
    const country = data.data.data.nearest_area[0].country[0].value;

    setCurrentWeather({
      country: country,
      city: data.data.data.nearest_area[0].region[0].value,
      temp: data.data.data.current_condition[0].temp_C,
      desc: data.data.data.current_condition[0].weatherDesc[0].value,
      feelsLike: data.data.data.current_condition[0].FeelsLikeC,
      time: data.data.data.current_condition[0].observation_time,
    });


    const cities = await axios.post(
      'https://countriesnow.space/api/v0.1/countries/states',
      { country }
    );
    console.log(cities);
    setCities(
      cities.data.data.states.map((state) =>
        state.name.slice(0, state.name.lastIndexOf(" "))
      )
    );
  };

  return (
    <div className="container">
      {currentWeather && (
        <div className="card card-temp">
          <TiLocation fontSize={16} />
          <span className="header">{currentWeather.city}</span>
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
      )}
      <ul className="cities-list">
        {cities.map((city, index) => (
          <Link to={`${currentWeather.country}/${city}`} key={index}>
            <li className="card card-city" > {city} </li>
          </Link>
        ))}
      </ul>
    </div>
    
  );
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(App);
