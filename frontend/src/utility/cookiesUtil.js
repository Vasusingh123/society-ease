import Cookies from 'js-cookie';

// Function to get the auth token from cookies
export const getAuthToken = () => {
    return Cookies.get('authToken');
};

export const getUserType = ()=> {
    return Cookies.get('userType');
}

export const getUserDetails = ()=> {
    return Cookies.get('userDetails');
}