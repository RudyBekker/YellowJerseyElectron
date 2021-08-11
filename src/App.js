import ReactWeather, { useOpenWeather } from 'react-open-weather';
import './App.css';
import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Setting from './Setting/Setting';

function App() {

  return (
    <main>
      <BrowserRouter>
        <Switch>
          <Route path="/setting" component={Setting} exact />
        </Switch>
      </BrowserRouter>

    </main>
  );
}

export default App;
