import React, { Component } from 'react'
import queryString from 'query-string';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import Navbar from 'react-bootstrap/Navbar'
import TrackPreview from '../components/TrackPreview';
import ArtistPreview from '../components/ArtistPreview';
import ScrollAnimation from 'react-animate-on-scroll'
import {bounce, fadeInRight} from 'react-animations';
import { Link, useHistory } from "react-router-dom";
import {connect} from 'react-redux';
import {login} from '../actions/userActions';
import "../styles/Home.css";

const Bounce = styled.div`animation: 2s ${keyframes`${bounce}`}`;
const FadeInRight = styled.div`animation: 2s ${keyframes`${fadeInRight}`}`;

//axios.defaults.baseURL = "https://spotifybackend.herokuapp.com"
axios.defaults.baseURL = "http://localhost:8888";



class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loggedIn: false, 
            accessToken: '',
            refreshToken: '',
            topTracks: [],
            topArtists: [], 
            name: '',
            userID: '',
            image: '',
            isPlaying: false, 
            currenlyPlaying: {}, 
        }
        this.getPlaylists = this.getPlaylists.bind(this);
        this.getTopTracks = this.getTopTracks.bind(this);
        this.getPersonalInfo = this.getPersonalInfo.bind(this);
        this.getTopArtists = this.getTopArtists.bind(this);
        this.getNowPlaying = this.getNowPlaying.bind(this);
    }

    componentDidMount() {
        // Parse Access Token
        let parsed = queryString.parse(window.location.search);
        axios.get('getUserFromDb', {
            params: {
                "userId": parsed.listener    
            }
        }).then(user => {
            //Dispatch action to set logged in and user data
            const userData = user.data;
            this.props.login(userData);
            this.setState({
                accessToken: userData.access_token,
                refreshToken: userData.refresh_token
            }, () => {

                console.log(this.props);
                //Functions to call after accessToken and refreshToken have been set
    
                //Get personal info
                this.getPersonalInfo();
    
                //Set top tracks 
                this.getTopTracks();
    
                //Set Top Artists
                this.getTopArtists();
    
                this.getNowPlaying();
                
            });
        }).catch(err => {
            //Catch some error with the home page and redirect to login
            console.log(err);
        })

        
        
    }

    // Currently Playing Track
    getNowPlaying() {
        axios.get('/getNowPlaying', {
            params: {
                "accessToken": this.state.accessToken,    
            }  
        }).then((res) => {
            // Get Now playing 
            // TODO: Make now playing dynamic and error robust
            if(res.data) {
                console.log(res.data)
                this.setState({
                    isPlaying: true,
                    currenlyPlaying: {
                        name: res.data.item.name, 
                        album_img: res.data.item.album.images[0].url,
                        artists: res.data.item.artists,
                        link: res.data.item.external_urls.spotify
                    }
                })
            } else {
                this.setState({
                    isPlaying: false,
                })
            }
        })
    }


    //Get basic user info 
    getPersonalInfo() {
        console.log("Fetching my information");
        axios.get('/myInfo', {
            params: {
                "accessToken": this.state.accessToken,    
            }  
        }).then((res) => {
            if(res.status == 200) {
                const info = res.data.body;
                this.setState({
                    name: info.display_name, 
                    userID: info.id
                })
                if(info.images) {
                    //Set the image url if there is one
                    this.setState({
                        image: info.images[0].url,
                    })
                }
            } else {
                console.log("Error in getting my info");
            }
        })
    }   


    // Get a user's playlist
    // TODO: Create UI
    // TODO: Set State
    // TODO: Component did mount call
    getPlaylists() {
        axios.get('/getPlaylists', {
            params: {
                "accessToken": this.state.accessToken,  
            }
        }).then((res) => {
            console.log(res);
        })
    }

    //Get a user's artists
    // TODO: Component did mount call
    getTopArtists() {
        axios.get('/getTopArtists', {
            params: {
                "accessToken": this.state.accessToken,  
            }
        }).then((res) => {
            console.log(res.data.items)
            this.setState({
                topArtists: res.data.items
            })
        })
    }
    
    // TODO: Error checking on response
    getTopTracks() {
        axios.get('/getTopTracks', {
            params: {
                "accessToken": this.state.accessToken
            }
        }).then((res) => {
            console.log("Top Tracks")
            console.log(res.data.items);
            this.setState({
                topTracks: res.data.items
            }) 
        })
    }

    render() {
        return (
            <div className="root">
                
                <div className="headerContainer">
                    {/* Personal Info */}
                    <div className="info">
                        {/* <img className="profile" src={this.state.image} /> */}
                        <h1>{this.state.name}</h1>
                    </div>
                    
                </div>
                    
                {/* Top Tracks Note: Currently Short Term */}
                <div className="tracksContainer">
                    <div className="tracksTitle">
                        <Bounce>
                            <h1>Current Bumps</h1>
                        </Bounce>
                    </div>
                    
                    <div className="tracksContent">
                            <ul>
                                {this.state.topTracks.map(listitem => (
                                    <TrackPreview 
                                        key={listitem.id} 
                                        name={listitem.name} 
                                        artists={listitem.artists}
                                        album_img={listitem.album.images[0].url}
                                        link={listitem.external_urls.spotify}
                                    />
                                ))}
                            </ul>
                    </div>
                </div>
                
                

                {/* Top Artists Note: Short Term */}
                <div className="artistsContainer">
                    
                    <div className="artistsContent">
                        <ul>
                            {this.state.topArtists.map(artist => (
                                <ArtistPreview key={artist.id} name={artist.name} img={artist.images[0].url} link={artist.external_urls.spotify}/>
                            ))}
                        </ul>
                    </div>

                    <div className="artistsTitle">
                        <h1>My Top Artists</h1>
                    </div>  

                </div>       

                <div>
                    {this.state.isPlaying ?
                        <TrackPreview 
                            name={this.state.currenlyPlaying.name} 
                            album_img={this.state.currenlyPlaying.album_img}
                            artists={this.state.currenlyPlaying.artists}
                            link={this.state.currenlyPlaying.link}
                        /> :
                        null
                    }
                </div>             
                            
                <div className="buttonContainer">
                    <Link to="/Directory">
                        <button className="directoryButton">
                            Find Friends
                        </button>
                    </Link>
                </div>

            </div>
        ) 
    }
}

const mapStateToProps = state => ({
    isLogged: state.auth.isLogged,
    user: state.auth.user
});

const mapDispatchToProps = () => {
    return {
      login
    };
  };
export default connect(
    mapStateToProps,
    mapDispatchToProps()
)(Home);