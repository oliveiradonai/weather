import React, { useEffect, useState } from "react";
import api from "./services/api";
import localidades from "./data/localidades.json";
import './App.css';
import icon from './img/snow-icon.png';
// import search from './img/search.png';
import Select from 'react-select';
import {debounce} from 'lodash';

const apiKey = '22b30c4c5d73097d562b1dbdec07f8fb';
const citySearch = 3451328;

export default function App() {
  const [weather, setWeather] = useState();
  const [cidades, setCidades] = useState();
  const [inputText, setInputText] = useState(null);

  function retornaCidades () {
    const objetoCidades = [];
    localidades.find(element => {
      if (element.label.indexOf(inputText) > -1) 
      objetoCidades.push({
        value: element.value,
        label: element.label
      })
    })
    setCidades(objetoCidades);
  }  
  
  const search = debounce(e => {
    setInputText(e);
  }, 500)

  useEffect(() =>{
    if (inputText) 
      retornaCidades();
  },
  [inputText]);

  useEffect(() => {
    api
      .get(`?id=${citySearch}&units=metric&lang=pt_br&appid=${apiKey}`)
      .then((response) => setWeather(response.data))
      .catch((err) => {
        console.error("ops! ocorreu um erro" + err);
      });
  },
    []);

  console.log(weather?.weather[0].id);
  switch (weather?.weather[0].id) {
    case 800:
      document.body.style.backgroundImage = "url(img/few-clouds.jpg)";
      break;
  
    default:
      document.body.style.backgroundImage = "url(./img/few-clouds.jpg)";
      break;
  }    

  // console.log(weather)
  return (
    <div className="App">
      <section className="search-Location">
        <Select placeholder="Selecione uma localidade..." options = {cidades} onInputChange={search} />
      </section>
      {/* <section className="search-Location">
        <input type="search" placeholder="Localização..." name="search" id="search"/>
        <button type="submit">
          <img src={search} alt="button"></img>
        </button>
      </section> */}
      <section className="weather-Location">
        <h1>
          {weather?.name.toUpperCase()}, {weather?.sys.country}
        </h1>
      </section>
      <section className="weather-Data">
        <section className="weather-Temp">
          <section className="top">
            <img src={icon} alt="weather-icon" />
            <h2>
              {Math.floor(weather?.main.temp)}°C
            </h2>
          </section>
          <h3>
            {weather?.weather[0].description.charAt(0).toUpperCase()}{weather?.weather[0].description.slice(1)} {weather?.weather[0].id}
          </h3>
        </section>

      </section>

      <footer className="copy">
        <p>&copy; 2021 Todos os direitos reservados - Desenvolvido por Adonai Figueiredo</p>
      </footer>
    </div>
  );
}