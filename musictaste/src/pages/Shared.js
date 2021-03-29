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
        this.grabSimilarData = this.grabSimilarData.bind(this);
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
            console.log("Response from backend")
            console.log(res.data);
        })
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