import React, { Component } from 'react'
import queryString from 'query-string';
import axios from 'axios'
import TrackPreview from '../components/TrackPreview';

class Shared extends Component {
    constructor(props) {
        super(props)

        this.state = {
            firstUser: {},
            secondUser: {},
            friendshipToken: "",
            sharedTracks: []
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
            // Set the profile ids
            console.log(`First ${res.data.firstId}, Second: ${res.data.secondId}`)
            this.grabUserData(res.data.firstId, 1);
            this.grabUserData(res.data.secondId, 2);

            //Set shared tracks
            this.setState({
                sharedTracks: res.data.tracks
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
                <div className="profiles">
                    <img src={this.state.firstUser.img}></img>
                    <img src={this.state.secondUser.img}></img>
                </div>
                <div className="tracks">
                    {this.state.sharedTracks.map(track => (
                        <TrackPreview
                            key={track.id}
                            name={track.name}
                            artists={track.artist}
                            album_img={track.img}
                        />
                    ))}
                </div>
            </div>
        )
    }
}

export default Shared