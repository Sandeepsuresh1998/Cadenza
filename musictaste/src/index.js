import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {createStore, combineReducers} from 'redux';
import allReducers from './reducers'; //Note will default look up to index.js
import {Provider} from 'react-redux';
import {persistStore} from 'redux-persist'
import {PersistGate} from 'redux-persist/integration/react';
import ReactLoading from 'react-loading';

const store = createStore(
  allReducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const persistor = persistStore(store);


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate 
        loading={<ReactLoading type="bars" color="#F8F8FF" height={667} width={375}/>}
        persistor={persistor}> 
        <App />
      </PersistGate>
    </Provider>
    
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
