import React, { Component } from 'react'
import axios from 'axios'
import ProfilePreview from '../components/ProfilePreview'
import {Link} from 'react-router-dom';
import '../styles/Directory.css'

class Directory extends Component {
    constructor(props) {
        super(props)

        this.state = {
            users: [],
        }
    }

    //This page will have a search bar with all the users you can add
    componentDidMount() {
        //TODO: Error checking for endpoint call
        //TODO: Get image for user 
        //Make axios call to back end and get all the users
        // NOTE: Might not need all information from the db
        //       so might be worth it to do some trimming here
        axios.get('/getAllUsers').then((res) => {
            this.setState({
                users: res.data
            })
        })
    }

    handleProfileClick = (userId) => {
        // Dirty way of circumventing cors
        // TODO: Research better way to redirect
        // TODO: Call shared top artists too
        const ids = {
            'me': 1223546560, 
            'other': userId
        }

        axios.get('/computeSharedTopArtists', {params: ids}).then(res => {
            console.log(res);
            axios.get('computeSharedTopTracks', {params: ids}).then(res => {
                console.log(res);
                const friendshipToken = res.data.friendshipInfo.friendshipToken;
                const url = `/Shared?friendshipToken=${friendshipToken}`
                window.location.href = url;

            }).catch(err => {
                console.log("Something went wrong in computing top tracks");
                console.log(err);
            })
        }).catch(err => {
            console.log("Something went wrong in computing artists");
            console.log(err);
        })
    }

    render() {
        return (
            <div className="root">
                <h1>Directory</h1>
                <div className="listContainer"> 
                    <ul>
                            {this.state.users.map(user => (
                                <button key={user.userId} id={user.userId} onClick={e => this.handleProfileClick(e.target.id)}>
                                    <ProfilePreview name={user.name} userId={user.userId} img={user.img}/> 
                                </button>
                            ))}    
                    </ul>
                </div>
            </div>
            
        )
    }
}

export default Directory