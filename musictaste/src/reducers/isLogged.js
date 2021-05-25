const loggedReducer = (state = false, action) => {
    switch(action.type) {
        case 'SIGN_IN' :
            //Setting the logged in state to true
            return true;
        default: 
            return state; 
    }
}

export default loggedReducer;