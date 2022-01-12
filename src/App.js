import React, { useEffect, useState } from "react";
import api from "./services/api";
import localidades from "./data/localidades.json";
import './App.css';
import icon from './img/clear-sky-icon.png';
import Select from 'react-select';
import { debounce } from 'lodash';

const apiKey = '22b30c4c5d73097d562b1dbdec07f8fb';
const citySearch = 3451328;

export default function App() {
  const [weather, setWeather] = useState();
  const [cidades, setCidades] = useState();
  const [inputText, setInputText] = useState(null);

  function formatString(textIn) {
    const textOut = textIn.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    return textOut;
  }

  function retornaCidades() {
    const objetoCidades = [];
    localidades.find(cidade => {
      const cityName = formatString(cidade.label)
      if (cityName.indexOf(inputText) > -1)
        objetoCidades.push({
          value: cidade.value,
          label: cidade.label
        })
    })
    setCidades(objetoCidades);
  }

  const search = debounce(e => {
    const formatedString = formatString(e);
    setInputText(formatedString);
  }, 500)

  useEffect(() => {
    if (inputText)
      retornaCidades();
  },
    [inputText]);

  function apiCall(idCidade) {
    api
      .get(`?id=${idCidade}&units=metric&lang=pt_br&appid=${apiKey}`)
      .then((response) => setWeather(response.data))
      .catch((err) => {
        console.error("ops! ocorreu um erro" + err);
      });
  }

  useEffect(() => {
    apiCall(citySearch);
  },
    []);

  // switch (weather?.weather[0].id) {
  //   case 800:
  //     document.body.style.backgroundImage = "url(img/few-clouds.jpg)";
  //     break;

  //   default:
  //     document.body.style.backgroundImage = "url(./img/few-clouds.jpg)";
  //     break;
  // }    

  const background = {
    backgroundImage: "url(./img/few-clouds.jpg)",
  };

  return (
    <div style={background} className="App">
      <section className="search-Location">
        <Select placeholder="Selecione uma localidade..." options={cidades} onInputChange={search} id="select-city" onChange={(evento) => apiCall(evento.value)} />
      </section>
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
            {weather?.weather[0].description.charAt(0).toUpperCase()}{weather?.weather[0].description.slice(1)} {weather?.weather[0].main}
          </h3>
        </section>
      </section>

      <footer className="copy">
        <p>&copy; 2021 Todos os direitos reservados - Desenvolvido por Adonai Figueiredo</p>
      </footer>
    </div>
  );
}