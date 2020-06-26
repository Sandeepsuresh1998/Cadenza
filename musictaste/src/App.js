import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Landing from './components/Landing';
var querystring = require('querystring');

class App extends Component{

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false, 
      accessToken: '',
    }
  }

  render() {
    // Different routes for the site are listed here along with the components they render
    return (

      <BrowserRouter>
        <div className="App">
          <Route exact={true} path="/" component={Landing}/>
          <Route path="/home" component={Home} />
        </div>
      </BrowserRouter>
    );
  }
  
}

export default App;
