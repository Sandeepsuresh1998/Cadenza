import React, { Component } from 'react'

class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loggedIn: false, 
            accessToken: '',
        }
    }

    componentDidMount() {
        // Parse Access Token
    }

    render() {
        return (
            <div className="container">
                <h1 color="white">Home</h1>
            </div>
        )
    }
}

export default Home;