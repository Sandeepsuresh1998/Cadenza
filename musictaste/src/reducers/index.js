//Place to store all reducers
import loggedReducer from './isLogged';
import {combineReducers} from 'redux';
import storage from 'redux-persist/lib/storage';
import persistReducer from 'redux-persist/es/persistReducer';

const persistConfig = {
    key: 'root',
    storage, 
    whitelist: ['auth']
}

const rootReducer = combineReducers({
    auth: loggedReducer
})

export default persistReducer(persistConfig, rootReducer);