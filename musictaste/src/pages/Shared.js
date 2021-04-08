import React, { Component } from 'react'
import queryString from 'query-string';
import axios from 'axios'
import TrackPreview from '../components/TrackPreview';
import "../styles/Shared.css";
import ArtistPreview from '../components/ArtistPreview';

class Shared extends Component {
    constructor(props) {
        super(props)

        this.state = {
            firstUser: {},
            secondUser: {},
            friendshipToken: "",
            sharedTracks: [],
            sharedArtists: []
        }
        this.grabSimilarData = this.grabSimilarData.bind(this);
        this.grabUserData = this.grabUserData.bind(this);
    }

    componentDidMount() {
        let parsed = queryString.parse(window.location.search);
        console.log(parsed.friendshipToken);
        this.setState({
            friendshipToken: parsed.friendshipToken
        }, () => {
            //Grab the tracks from db
            this.grabSimilarData()
        });
    }

    grabSimilarData() {
        axios.get('/getComparisonData', {params: {
            'friendshipToken': this.state.friendshipToken
        }}).then(res => {
            //TODO: Check if comparison exists and compute if not
            console.log(res);
            // Set the profile ids
            console.log(`First ${res.data.firstId}, Second: ${res.data.secondId}`)
            this.grabUserData(res.data.firstId, 1);
            this.grabUserData(res.data.secondId, 2);

            //Set shared tracks
            this.setState({
                sharedTracks: res.data.tracks,
                sharedArtists: res.data.artists,
            })
        })
    }

    grabUserData(userId, pos) {
        axios.get('/getUserFromDb', {params: {
            userId
        }}).then((res) => {
            console.log(res);
            const userLoc = (pos == 1) ? "firstUser" : "secondUser"
            // let userObj = {userLoc : res}
            this.setState({
                [userLoc] : res.data
            })
        })
    }

    render() {
        return (
            <div className="root">
                <div className="headerContainer">
                    <div className="profileContainer">
                        <div className="profilePics">
                            <img className="profile" src={this.state.firstUser.img}></img>
                            <img className="profile" src={this.state.secondUser.img}></img>
                        </div>
                        
                        <h1>{this.state.firstUser.name} x {this.state.secondUser.name}</h1>
                    </div>
                </div>

                
                <div className="tracks">
                    {this.state.sharedTracks.map(track => (
                        <TrackPreview
                            key={track.id}
                            name={track.name}
                            artists={track.artist}
                            album_img={track.img}
                            link={track.link}
                        />
                    ))}
                </div>

                <div className="artists">
                    <h1>Artists WE Like</h1>
                    {this.state.sharedArtists.map(artist => (
                        <ArtistPreview
                            name={artist.name}
                            img={artist.img}
                            link={artist.url}
                        />
                    ))}
                </div>
            </div>
        )
    }
}

export default Shared