const initialState = {isLogged: false}
const loggedReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'SIGN_IN_USER' :
            //Setting the logged in state to true
            return {
                isLogged: true,
                user: action.payload,
            }
        case 'SIGN_IN_ERROR' :
            return {
                isLogged: false
            }
        case 'LOGOUT' :
            return {
                isLogged: false
            }
        default: 
            return state;
    }
}

export default loggedReducer;