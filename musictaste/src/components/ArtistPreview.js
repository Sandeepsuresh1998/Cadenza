import React, { PureComponent } from 'react'
import "../styles/ArtistPreview.css"

class ArtistPreview extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            name: "",
            img: "",
        }
    }

    componentDidMount() {
        //Setting the state from the props passed in
        this.setState({
            name: this.props.name,
            img: this.props.img,
        })
    }

    render() {
        return (
            <div className="artist-container">
                <img className="artist-img" src={this.state.img} style={{width:'100px', height:'100px', borderRadius:"50px"}}/>                
                <h1>{this.state.name}</h1>
            </div>
        )
    }
}

export default ArtistPreview