import React, { PureComponent } from 'react'
import "../styles/TrackPreview.css"

class TrackPreview extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
           name: "", 
           album_img: "", 
           artists: [], 
        }
    }
    
    componentDidMount() {
        this.setState({
            name: this.props.name,
            album_img: this.props.album_img, 
            artist: this.props.artists[0].name,
            imgMult: this.props.imgMult,
        })

        console.log(this.props.artists[0].name);
    }


    render() {
        return (
            <div className="track-container">
                <img src={this.state.album_img} style={{width:'100px', height:'100px', borderRadius:"50px"}} />
                <h1>{this.state.name} - {this.state.artist}</h1>
            </div>
        )
    }
}

export default TrackPreview