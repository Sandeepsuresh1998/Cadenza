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
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    axios.get("/getCredentials").then((res) => {
      // Once we get credentials back redirect to spotify authorize
      console.log("State: " + res.data.state)
      window.location = 'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
          response_type: 'code',
          client_id: res.data.client_id,
          scope: res.data.scope,
          redirect_uri: res.data.redirect_uri,
          state: res.data.state
        });
    });

  };

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
