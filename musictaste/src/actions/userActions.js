export const login = (userData) => {
    return {
        type: "SIGN_IN_USER",
        payload: userData
    };
}

export const logout = () => {
    return {
        type: "LOGOUT"
    };
}