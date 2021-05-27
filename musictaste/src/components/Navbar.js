import React, { Component } from 'react'
import "../styles/Navbar.css";
import {Link} from "react-router-dom";
import {connect} from 'react-redux';
import {logout} from '../actions/userActions';
import {HouseFill, BoxArrowLeft, VolumeUp, PersonLinesFill} from 'react-bootstrap-icons';


class Navbar extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userId: ""
        }
    }

    componentDidMount() {
        this.setState({
            userId: this.props.userId
        })
    }

    handleLogoutClick = () => {
        this.props.logout();
    }

    render() {
        return (
            <div className="navContainer">
                <Link to={"/Home?listener="+this.state.userId}>
                    <HouseFill className="navIcons" color="#F8F8FF"size={35}/>
                </Link>
                <Link to="/Directory">
                    <PersonLinesFill className="navIcons" color="#F8F8FF" size={35} />
                </Link>
                <Link to="/" onClick={this.handleLogoutClick}>
                    <BoxArrowLeft className="navIcons" color="#F8F8FF" size={35}/>
                </Link>
            </div>
        )
    }
}

const mapDispatchToProps = () => {
    return {
      logout
    };
};

export default connect(null,
    mapDispatchToProps()
)(Navbar);