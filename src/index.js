import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import City from "./pages/City";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" exact element={<Home/>} />
      <Route path=":country/:city" element={<City />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);

