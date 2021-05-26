import React, { Component } from 'react'
import styled, { keyframes } from 'styled-components';
import {fadeInLeft} from 'react-animations';
import Typing from 'react-typing-animation';
import '../styles/Landing.css'; //CSS 
import axios from 'axios';

const FadeInLeft = styled.div`animation: 2s ${keyframes`${fadeInLeft}`}`;

class Landing extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        // Hit our login server
        window.location.href = "https://spotifybackend.herokuapp.com/login";

        //Dev 
        //window.location.href = "http://localhost:8888/login";
    }

    render() {
        return (
            <div className="LoginPage">
                <h1 className="header">Cadenza</h1>
                <Typing>
                    <h3 className="description">Compare (and flex) your music taste with your friends</h3>
                </Typing>
                <button onClick={this.handleClick} className="loginButton">Login</button>
            </div>
        )
    }
}

export default Landing