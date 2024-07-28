import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

// Create a context with an empty initial state
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(Cookies.get('authToken') || null);
    const [userType, setUserType] = useState(Cookies.get('userType') || null);
    const [userDetails, setUserDetails] = useState(Cookies.get('userDetails') || null);

    const login = (token, userType, userDetails) => {
        setAuthToken(token);
        Cookies.set('authToken', token, { expires: 7 }); // Save token in a cookie for 7 days
        setUserDetails(userDetails);
        Cookies.set('userDetails', userDetails, {expires: 7});
        setUserType(userType);
        Cookies.set('userType', userType, {expires: 7})
    };

    const logout = () => {
        setAuthToken(null);
        Cookies.remove('authToken'); // Remove the token cookie
        setUserType(null);
        Cookies.remove('userType');
        setUserDetails(null);
        Cookies.remove('userDetails');
    };

    useEffect(() => {
        const token = Cookies.get('authToken');
        const userType = Cookies.get('userType');
        const userDetails = Cookies.get('userDetails');
        if (token) {
            setAuthToken(token);
        }
        if(userType) {
            setUserType(userType);
        }
        if(userDetails){
            setUserDetails(userDetails);
        }

    }, []);

    

    return (
        <AuthContext.Provider value={{ authToken, userType, userDetails, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};
