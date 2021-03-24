import React, { Component } from 'react'

class Shared extends Component {
    constructor(props) {
        super(props)

        this.state = {
            myImg: "", 
            friendImg: "",
        }
    }

    componentDidMount() {
        
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