import React from 'react';
import logo from './logo.svg';
import './App.css';
import styled, { keyframes } from 'styled-components';
import {fadeInLeft} from 'react-animations';
import {Button} from 'react-bootstrap-buttons';


const FadeInLeft = styled.div`animation: 2s ${keyframes`${fadeInLeft}`}`;

function App() {
  return (
    <div className="App">
      <FadeInLeft><h1 className="header">Music Taste</h1></FadeInLeft>
      <Button className="loginButton">Login</Button>
    </div>
  );
}

export default App;
