import React, { Component } from 'react'
import styled, { keyframes } from 'styled-components';
import {fadeInLeft} from 'react-animations';
import {Redirect} from 'react-router-dom';
import '../styles/Landing.css'; //CSS 

const FadeInLeft = styled.div`animation: 2s ${keyframes`${fadeInLeft}`}`;

class Landing extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        // Hit our login server
        window.location.href = "https://spotifybackend.herokuapp.com/login";
    }

    render() {
        return (
            <div className="LoginPage">
                <FadeInLeft>
                    <h1 className="header">Music Taste</h1>
                    <button onClick={this.handleClick} className="loginButton">Login</button>
                </FadeInLeft>
            </div>
        )
    }
}

export default Landing