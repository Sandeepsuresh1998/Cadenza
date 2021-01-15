import axios from 'axios'
import React, { Component } from 'react'
import "../styles/ProfilePreview.css"

class ProfilePreview extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: "",
            img: "",
            userId: "",
        }
    }

    componentDidMount() {
        this.setState({
            name: this.props.name,
            img: this.props.img,
            userId: this.props.userId
        })

    }

    render() {
        return (
            <div className="profileContainer" id={this.state.userId}>
                 <img
                    src={this.state.img}
                />
                <h1>{this.state.name}</h1>
            </div>
        )
    }
}

export default ProfilePreview