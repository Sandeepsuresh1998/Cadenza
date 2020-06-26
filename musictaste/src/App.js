import React, { Component } from 'react';
import './App.css';
import styled, { keyframes } from 'styled-components';
import {fadeInLeft} from 'react-animations';
import axios from 'axios'
var querystring = require('querystring');
const FadeInLeft = styled.div`animation: 2s ${keyframes`${fadeInLeft}`}`;

axios.defaults.baseURL = "https://us-central1-musictaste-8ca96.cloudfunctions.net/api";

class App extends Component{

  constructor(props) {
    super(props);
  }



  render() {
    return (
      <div className="App">
        <FadeInLeft>
          <h1 className="header">Music Taste</h1>
          <button className="loginButton"><a href="localhost:8888/login">Login</a></button>
        </FadeInLeft>
      </div>
    );
  }
  
}

export default App;
