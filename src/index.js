import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import City from "./City";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" exact element={<App/>} />
      <Route path=":country/:city" element={<City />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);

