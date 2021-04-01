import React, { Component } from 'react'
import axios from 'axios'
import ProfilePreview from '../components/ProfilePreview'
import {Link} from 'react-router-dom';

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
        const url = `https://spotifybackend.herokuapp.com/getSharedTopTracks?me=1223546560&other=${userId}`
        window.location.href = url;
    }

    render() {
        return (
            <div className="root">
                <div className="listContainer"> 
                    <ul>
                            {this.state.users.map(user => (
                                <Link to="/Shared">
                                    <button key={user.userId} id={user.userId} onClick={e => this.handleProfileClick(e.target.id)}>
                                        <ProfilePreview name={user.name} userId={user.userId} img={user.img}/> 
                                    </button>
                                </Link>
                            ))}    
                    </ul>
                </div>
            </div>
            
        )
    }
}

export default Directory