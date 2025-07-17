import { createContext, useEffect, useState } from "react";
import { AppConstants } from "../util/constants.js";
import { toast } from "react-toastify";
import axios from "axios";


export const AppContext = createContext();

export const AppContextProvider = (props) => {

  const backendURL = AppConstants.BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null); 
  const [loadingAuth, setLoadingAuth] = useState(true); 

  

  
  axios.defaults.withCredentials = true; 

  const getUserData = async () => {
   
    try {
      
      const response = await axios.get(`${backendURL}/profile`); 
      if (response.status === 200) {
        setUserData(response.data);
        setIsLoggedIn(true); 
      } else {
        
        console.error("Failed to fetch user data with status:", response.status);
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      
      setIsLoggedIn(false);
      setUserData(null);
    }
  };

  const getAuthState = async () => {
    setLoadingAuth(true); 
    try {
      
      const response = await axios.get(`${backendURL}/is-authenticated`); 

      if (response.status === 200 && response.data === true) {
        setIsLoggedIn(true);
        await getUserData(); 
      } else {
        
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (error) {
      console.error("Error checking authentication status:", error);
      
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        
        setIsLoggedIn(false);
        setUserData(null);
      } else if (error.request) {
       
        toast.error("Network error: Could not reach backend to check authentication status.");
        setIsLoggedIn(false);
        setUserData(null);
      } else {
        
        toast.error("An unexpected error occurred while checking authentication.");
        setIsLoggedIn(false);
        setUserData(null);
      }
    } finally {
      setLoadingAuth(false);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []); 
  const contextValue = {
    backendURL,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
    loadingAuth, 
  
  };

  
  if (loadingAuth) {
      return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px', color: '#fff', backgroundColor: '#6a5af9' }}>
              Checking authentication status...
          </div>
      );
  }

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};