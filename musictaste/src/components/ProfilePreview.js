import axios from 'axios'
import React, { Component } from 'react'

class ProfilePreview extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: "",
            img: ""
        }
    }

    componentDidMount() {
        this.setState({
            name: this.props.name,
            img: this.props.img
        })

    }

    render() {
        return (
            <div className="profileContainer">
                <h1>{this.state.name}</h1>
                <img
                    src={this.state.img}
                />
            </div>
        )
    }
}

export default ProfilePreview