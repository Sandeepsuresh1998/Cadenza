import React, { Component } from 'react'
import queryString from 'query-string';
import axios from 'axios'

// axios.defaults.baseURL = "https://spotifybackend.herokuapp.com"



class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loggedIn: false, 
            accessToken: '',
            refreshToken: '',
            name: '',
            email: '', 
        }
        this.topArtists = this.topArtists.bind(this);
    }

    componentDidMount() {
        // Parse Access Token
        let parsed = queryString.parse(window.location.search);
        this.setState({
            accessToken: parsed.access_token,
            refreshToken: parsed.refresh_token
        }) 

        // Get user info
        // TODO: Make this more expansive and add more details to page
        axios.get('http://localhost:8888/myInfo', {
            params: {
                "accessToken": parsed.access_token,    
            }  
        }).then((res) => {
            if(res.status == 200) {
                const info = res.data.body;
                this.setState({
                    name: info.display_name, 
                    email: info.email
                })
            }
        })

        
    }

    topArtists() {
        console.log(this.state.accessToken);
        axios.get('http://localhost:8888/myInfo', {
            params: {
                "accessToken": this.state.accessToken,    
            }
            
        })
    }


    render() {
        return (
            <div className="container">
                <h1 color="white">Home</h1>
                <h1>{this.state.name}</h1>
                <h1>{this.state.email}</h1>
                <p>Access: {this.state.accessToken}</p>
                <p>Refresh: {this.state.refreshToken}</p>

                <button onClick={this.topArtists}>Artists</button>
            </div>
        )
    }
}

export default Home;