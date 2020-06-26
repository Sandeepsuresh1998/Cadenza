import React, { Component } from 'react'
import queryString from 'query-string';

class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loggedIn: false, 
            accessToken: '',
            refreshToken: '',
        }
    }

    componentDidMount() {
        // Parse Access Token
        let parsed = queryString.parse(window.location.search);
        this.setState({
            accessToken: parsed.access_token,
            refreshToken: parsed.refresh_token
        }) 
    }

    render() {
        return (
            <div className="container">
                <h1 color="white">Home</h1>
                <p>Access: {this.state.accessToken}</p>
                <p>Refresh: {this.state.refreshToken}</p>
            </div>
        )
    }
}

export default Home;