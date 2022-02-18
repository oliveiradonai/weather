import React, { useEffect, useState } from "react";
import api from "./services/api";
import locales from "./data/localidades.json";
import './App.css';
import Select from 'react-select';
import { debounce, functionsIn } from 'lodash';

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

  function returnCities() {
    const objectCities = [];
    locales.find(cidade => {
      const cityName = formatString(cidade.label)
      if (cityName.indexOf(inputText) > -1)
        objectCities.push({
          value: cidade.value,
          label: `${cidade.label} - ${cidade.country}`
        })
    })
    setCidades(objectCities);
  }

  const search = debounce(e => {
    const formatedString = formatString(e);
    setInputText(formatedString);
  }, 500)

  useEffect(() => {
    if (inputText)
      returnCities();
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

  return (
    <div className="App" id={weather?.weather[0].main}>
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
            <img className={weather?.weather[0].main} id="weather--icon" alt="weather-icon" />
            <h2>
              {Math.floor(weather?.main.temp)}°C
            </h2>
          </section>
          <h3>
            {weather?.weather[0].description.charAt(0).toUpperCase()}{weather?.weather[0].description.slice(1)}
          </h3>
        </section>
      </section>

      <footer className="copy">
        <p>&copy; 2022 Todos os direitos reservados - Desenvolvido por Adonai Figueiredo</p>
      </footer>
    </div>
  );
}