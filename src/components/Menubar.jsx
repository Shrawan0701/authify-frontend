import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext, useState, useRef, useEffect } from "react";
import { AppContext } from "../contexts/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Menubar = () => {
  const navigate = useNavigate();
  const {userData, backendURL, setUserData, setIsLoggedIn} = useContext(AppContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect( () => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [])

  const handleLogout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(backendURL+"/logout");
      if (response.status === 200) {
        setIsLoggedIn(false);
        setUserData(false);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  
   const sendVerificationOtp = async () => {
    
    if (!userData || !userData.email) {
      toast.error("User email not available for verification. Please log in again.");
      setDropdownOpen(false); 
      navigate("/login"); // Redirect to login if user data is missing
      return;
    }

    setDropdownOpen(false); 

    try {
      axios.defaults.withCredentials = true; 
      const emailToSend = userData.email;

      
      const response = await axios.post(`${backendURL}/send-otp?email=${encodeURIComponent(emailToSend)}`);
      

      if (response.status === 200 || response.status === 204) { 
        navigate("/email-verify");
        toast.success("Verification OTP sent to your email!");
      } else {
        
        toast.error("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending verification OTP:", error); 
      if (error.response) {
        toast.error(error.response.data.message || "Failed to send OTP.");
      } else if (error.request) {
        toast.error("Network error: Backend unreachable. Is your backend server running?");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  }


  console.log("Current userData:", userData); 
  console.log("isAccountVerified status:", userData?.isAccountVerified);

  return (
    <nav className="navbar bg-white px-5 py-4 d-flex justify-content-between align-items-center">

      <div className="d-flex align-items-center gap-2">

        <img src={assets.landing} alt="logo" width={32} height={32} />
        <span className="fs-4 fw-bold text-dark">Authify</span>

        </div>

        {userData ? (
          <div className="position-relative" ref={dropdownRef}>
            <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center"
             style={{
              width: "40px", 
              height: "40px", 
              cursor: "pointer",
              userSelect: "none",
              }} 
              onClick={() => setDropdownOpen((prev) => !prev)}>
              
               {userData.name[0].toUpperCase()}
              </div>
            {dropdownOpen && (
              <div className="position-absolute shadow bg-white rounded-2" 
              style={{
                top: "50px",
                right: "0",
                zIndex: 100,
              }}
              >
                {!userData.isAccountVerified && (
                  <div className="dropdown-item py-1 px-2" 
                  style={{cursor : "pointer"}} onClick={sendVerificationOtp}>
                    Verify Email
                  </div>

                )}

               

              
                <div className="dropdown-item py-1 px-2 text-danger" 
                style={{cursor : "pointer"}}
                onClick={handleLogout}
                >
                  Logout
                </div>
              </div>
            )}
          
          </div>

        ) : (
          <div className="btn btn-outline-dark rounded-pill px-3" onClick={() => navigate("/login")}>
          Login <i className="bi bi-arrow-right ms-2"></i>
          </div>

        )}

        
      </nav>
  )
}

export default Menubar;