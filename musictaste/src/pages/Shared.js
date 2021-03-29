import React, { Component } from 'react'
import queryString from 'query-string';
import axios from 'axios'

class Shared extends Component {
    constructor(props) {
        super(props)

        this.state = {
            myImg: "", 
            friendImg: "",
        }
    }

    componentDidMount() {
        let parsed = queryString.parse(window.location.search);
        this.setState({
            friendshipToken: parsed.friendshipToken
        }, () => {
            //Grab the tracks from db
        });
    }

    render() {
        return (
            <div className="root">
                <div className="profiles">
                    <img></img>
                </div>
            </div>
        )
    }
}

export default Shared