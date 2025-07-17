import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useRef, useState, useContext, useEffect } from "react";
import { AppContext } from "../contexts/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { AppConstants } from "../util/constants"; 


const EmailVerify = () => {
  const inputRef = useRef([]);
  const [loading, setLoading] = useState(false);
  const { getUserData, isLoggedIn, userData } = useContext(AppContext);
  const navigate = useNavigate();

  // Get backend URL from AppConstants
  const backendURL = AppConstants.BACKEND_URL;

  
  useEffect(() => {
    if (inputRef.current[0]) {
      inputRef.current.forEach(input => input.value = ""); 
      inputRef.current[0].focus(); 
    }
  }, [userData]);

  
  useEffect(() => {
    
    if (isLoggedIn && userData && userData.isAccountVerified) {
        navigate("/");
    } else if (!isLoggedIn && !userData) {
        
        toast.info("Please log in to verify your email.");
        navigate("/login");
    }
    
  }, [isLoggedIn, userData, navigate]);


  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, "");
    e.target.value = value; 
    if (value && index < 5) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, 6).split("");
    paste.forEach((digit, i) => {
      if (inputRef.current[i]) {
        inputRef.current[i].value = digit;
      }
    });
    const next = paste.length < 6 ? paste.length : 5;
    if (inputRef.current[next]) {
      inputRef.current[next].focus();
    }
  };

  const handleVerify = async () => {
    const otp = inputRef.current.map(input => input.value).join("");
    if (otp.length < 6) {
        toast.error("Please enter 6 digits of OTP");
        return;
    }

    
    if (!userData || !userData.email) {
        toast.error("User email not found. Please log in again to verify.");
        navigate("/login");
        return;
    }

    setLoading(true);
    axios.defaults.withCredentials = true; 

    try {
        const response = await axios.post(backendURL + "/verify-otp", {
            otp: otp,
            email: userData.email
        });

        if (response.status === 200) {
            toast.success("Email verified successfully!");
            getUserData(); 
            navigate("/"); 
        } else {
            toast.error("Invalid OTP or verification failed.");
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        if (error.response) {
            toast.error(error.response.data.message || "Failed to verify OTP. Please try again.");
        } else {
            toast.error("Network error or unexpected issue during OTP verification.");
        }
    } finally {
        setLoading(false);
    }
  };


  return (
    <div className="email-verify-container d-flex align-items-center justify-content-center vh-100 position-relative"
      style={{ background: "linear-gradient(90deg, #6a5af9, #8268f9)", borderRadius: "none" }}>

      
      <Link to="/" className="position-absolute top-0 start-0 p-4 d-flex align-items-center text-decoration-none gap-2">
        <img src={assets.landing} alt="logo" height={32} width={32} />
        <span className="fs-4 fw-semibold text-light">Authify</span>
      </Link>

      
      <div className="container"> 
        <div className="row justify-content-center"> 
          <div className="col-12 col-sm-8 col-md-6 col-lg-4"> 
            <div className="card p-5 rounded-4 shadow bg-white"
                 style={{ /* removed width:"400px" from here */ }}>
              <h4 className="text-center fw-bold mb-2">Email Verification OTP</h4>
              <p className="text-center mb-4">
                Please enter the 6 digit OTP sent to your email to verify your account.
              </p>

              <div className="d-flex justify-content-center gap-2 mb-4 text-center text-white-50 mb-2">
                {[...Array(6)].map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    className="form-control text-center fs-4 otp-input"
                    ref={(el) => (inputRef.current[i] = el)}
                    onChange={(e) => handleChange(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    onPaste={handlePaste}
                  />
                ))}
              </div>

              <button className="btn btn-primary w-100 fw-semibold" disabled={loading} onClick={handleVerify}>
                {loading ? "Verifying..." : "Verify Email"}
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default EmailVerify;