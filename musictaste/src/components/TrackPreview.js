import React, { PureComponent } from 'react'
import "../styles/TrackPreview.css"

class TrackPreview extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
           name: "", 
           album_img: "", 
           artist: ""
        }
    }
    
    componentDidMount() {
        this.setState({
            name: this.props.name,
            album_img: this.props.album_img, 
            imgMult: this.props.imgMult,
        })
        
        if(this.props.artists) {
            this.setState({
                artist: this.props.artists[0].name
            })
        }

    }


    render() {
        return (
            <div className="track-container">
                <img className="track-img" src={this.state.album_img} style={{width:'80px', height:'80px', borderRadius:"40px"}} />
                <h1>{this.state.name} - {this.state.artist}</h1>
            </div>
        )
    }
}

export default TrackPreview