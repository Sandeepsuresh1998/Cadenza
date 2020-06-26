import React, { Component } from 'react'
import styled, { keyframes } from 'styled-components';
import {fadeInLeft} from 'react-animations';
import '../styles/Landing.css'; //CSS 

const FadeInLeft = styled.div`animation: 2s ${keyframes`${fadeInLeft}`}`;

class Landing extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loggedIn: false, 
            accessToken: '',
        }
    }

    render() {
        return (
            <div className="LoginPage">
                <FadeInLeft>
                    <h1 className="header">Music Taste</h1>
                    <button className="loginButton"><a href="localhost:8888/login">Login</a></button>
                </FadeInLeft>
            </div>
        )
    }
}

export default Landing