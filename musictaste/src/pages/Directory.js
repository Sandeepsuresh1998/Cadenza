import React, { Component } from 'react'
import axios from 'axios'
import ProfilePreview from '../components/ProfilePreview'

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
        //Make axios call to back end and get all the users
        // NOTE: Might not need all information from the db
        //       so might be worth it to do some trimming here
        axios.get('/getAllUsers').then((res) => {
            this.setState({
                users: res.data
            })
        })
    }

    render() {
        return (
            <div className="root">
                <div className="listContainer">
                    <ul>
                        {this.state.users.map(user => (
                            <ProfilePreview name={user.name} key={user.id}/> 
                        ))}
                    </ul>
                    
                </div>
            </div>
            
        )
    }
}

export default Directory