import React, { Component } from 'react'
import queryString from 'query-string';
import axios from 'axios'
import "../styles/Home.css";
import Navbar from 'react-bootstrap/Navbar'

//axios.defaults.baseURL = "https://spotifybackend.herokuapp.com"


class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loggedIn: false, 
            accessToken: '',
            refreshToken: '',
            name: '',
            email: '', 
            userID: '',
            image: ''
        }
        this.topArtists = this.topArtists.bind(this);
        this.getPlaylists = this.getPlaylists.bind(this);
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
        axios.get('/myInfo', {
            params: {
                "accessToken": parsed.access_token,    
            }  
        }).then((res) => {
            if(res.status == 200) {
                const info = res.data.body;
                this.setState({
                    name: info.display_name, 
                    email: info.email,
                    userID: info.id
                })
                if(info.images) {
                    //Set the image url if there is one
                    this.setState({
                        image: info.images[0].url,
                    })
                }
            }
        })

        
    }


    // Get info
    // TODO: Change to get top artists and tracks
    topArtists() {
        console.log(this.state.accessToken);
        axios.get('/myInfo', {
            params: {
                "accessToken": this.state.accessToken,  
            }
        }).then((data) => {
            console.log(data);
        })
    }


    // Get a user's playlist
    getPlaylists() {
        axios.get('https://localhost:8888/getPlaylists').then((res) => {
            console.log(res);
        })
    }

    render() {
        return (
            <div className="root">
                <div className="headerContainer">
                    <h1 style={{color: "#1DB954"}} className="header">Hello {this.state.name}</h1>
                </div>
                <div className="homeContainer">
                    <img src={this.state.image} />
                    <h1>{this.state.name}</h1>
                    <h1>{this.state.email}</h1>
                    <button onClick={this.getPlaylists}>Playlist</button>
                </div>
            </div>
        )
    }
}

export default Home;