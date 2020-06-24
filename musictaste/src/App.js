import React, { Component } from 'react';
import './App.css';
import styled, { keyframes } from 'styled-components';
import {fadeInLeft} from 'react-animations';
import axios from 'axios'

const FadeInLeft = styled.div`animation: 2s ${keyframes`${fadeInLeft}`}`;

const axios = axios.create({
  baseURL: "https://us-central1-musictaste-8ca96.cloudfunctions.net/api"
})

class App extends Component{

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log("Clicked");
  }

  render() {
    return (
      <div className="App">
        <FadeInLeft>
          <h1 className="header">Music Taste</h1>
          <button onClick={this.handleClick}className="loginButton">Login</button>
        </FadeInLeft>
      </div>
    );
  }
  
}

export default App;
