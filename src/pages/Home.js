import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { geolocated } from "react-geolocated";
import Loader from "../Components/Loader";
import EnableLocation from "../Components/EnableLocation";
import { TiLocation } from "react-icons/ti";
import "../App.css";

function App({ coords, isGeolocationEnabled }) {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    getData();
  }, [coords, isGeolocationEnabled]);

  const getData = async () => {
    if (!coords) return;
    const data = await axios.get(
      `https://api.worldweatheronline.com/premium/v1/weather.ashx?key=b1dc4e3642144613bfa184304222003&q=
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
      "https://countriesnow.space/api/v0.1/countries/states",
      { country }
    );
    setCities(
      cities.data.data.states.map((state) =>
        state.name //.slice(0, state.name.lastIndexOf(" "))
      )
    );
  };

  if (!isGeolocationEnabled) return <EnableLocation />;

  if (!currentWeather || !cities.length) return <Loader />;

  return (
    <div className="container">
      {currentWeather && (
        <div className="card card-temp">
          <h2 className="header">
            <TiLocation className="icon" />
            {currentWeather.city}, {currentWeather.country}{" "}
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
      )}
      <ul className="cities-list">
        {cities.map((city, index) => (
          <>       
          { (index === 0 || city[0] != cities[index-1][0]) &&
           <p className="cities-list__character"> {city[0]} </p>  }
  
          <Link className="card card-city" to={`${currentWeather.country}/${city}`} key={index}>
            <li> {city} </li>
          </Link>
          </>
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
