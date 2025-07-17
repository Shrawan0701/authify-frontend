import axios from "axios";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState, useContext } from "react";
import { AppContext } from "../contexts/AppContext";
import { toast } from "react-toastify";
import { AppConstants } from "../util/constants"; 

const ResetPassword = () => {
  const inputRef = useRef([]); 
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

 
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState(""); 

  
  const [isEmailSent, setIsEmailSent] = useState(false); 
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false); 

  // Context for backendURL
  const { backendURL } = useContext(AppContext); 

  axios.defaults.withCredentials = true; 

  
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

  // Step 1: Submit Email to send OTP
  const onSubmitEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      
      const response = await axios.post(`${backendURL}/send-reset-otp?email=${encodeURIComponent(email)}`);
      
      if (response.status === 200 || response.status === 204) { 
        toast.success("Password reset OTP sent successfully to your email!");
        setIsEmailSent(true); 
      } else {
        
        toast.error("Failed to send OTP. Please try again with valid email.");
      }
    } catch (error) {
      console.error("Error submitting email for OTP:", error);
      if (error.response) {
        toast.error(error.response.data.message || `Error: ${error.response.statusText}`);
      } else if (error.request) {
        toast.error("Network error: Could not reach the server.");
      } else {
        toast.error("An unexpected error occurred: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => { 
    const enteredOtp = inputRef.current.map((input) => input.value).join("");
    if (enteredOtp.length !== 6) {
      toast.error("Please enter all 6 digits of OTP");
      return;
    }
    setOtp(enteredOtp); 

    setLoading(true);
    try {
      
      const response = await axios.post(backendURL + "/verify-otp", {
        email: email, 
        otp: enteredOtp,
      });

      if (response.status === 200) {
        setIsOtpSubmitted(true); 
        toast.success("OTP verified successfully!");
      } else {
        toast.error("Invalid OTP. Please try again.");
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

  // Step 3: Submit New Password
  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      
      const response = await axios.post(backendURL + "/reset-password", {
        email,
        otp, 
        newPassword
      });
      if (response.status === 200) {
        toast.success("Password reset successfully! Please login.");
        navigate("/login");
      } else {
        toast.error("Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      if (error.response) {
        toast.error(error.response.data.message || "Password reset failed.");
      } else {
        toast.error("Network error or unexpected issue.");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="d-flex align-items-center justify-content-center vh-100 position-relative"
      style={{ background: "linear-gradient(90deg, #6a5af9, #8268f9)", borderRadius: "none" }}>

      
      <Link to="/" className="position-absolute top-0 start-0 p-4 d-flex align-items-center text-decoration-none gap-2">
        <img src={assets.landing} alt="logo" width={32} height={32} />
        <span className="fs-4 fw-semibold text-light">Authify</span>
      </Link>

      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-8 col-md-6 col-lg-4"> 

           
            {!isEmailSent && (
              <div className="card p-5 rounded-4 shadow bg-white" 
                   style={{ /* Removed maxWidth and width from here */ }}>
                <h4 className="mb-2 text-center fw-bold">Reset Password</h4>
                <p className="mb-4 text-center">Enter your registered Email Id</p>
                <form onSubmit={onSubmitEmail}>
                  <div className="input-group mb-4 bg-secondary bg-opacity-10 rounded-pill">
                    <span className="input-group-text bg-transparent border-0 ps-4">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control border-0 bg-transparent ps-1 pe-4 rounded-end"
                      placeholder="Enter your email"
                      style={{ height: '50px' }}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="off"
                    />
                  </div>
                  <button className="btn btn-primary w-100 py-2" type="submit" disabled={loading}>
                    {loading ? "Sending OTP..." : "Submit"}
                  </button>
                </form>
              </div>
            )}

            
            {isEmailSent && !isOtpSubmitted && (
              <div className="card p-5 rounded-4 shadow bg-white"
                   style={{ /* Removed maxWidth and width from here */ }}>
                <h4 className="text-center fw-bold mb-2">Password Verification OTP</h4>
                <p className="text-center mb-4">
                  Please enter the 6 digit OTP sent to <span className="fw-bold">{email}</span>.
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

                <button className="btn btn-primary w-100 fw-semibold" disabled={loading} onClick={handleVerifyOtp}> 
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            )}

            
            {isEmailSent && isOtpSubmitted && ( 
              <div className="card p-5 rounded-4 text-center bg-white"
                   style={{ /* Removed maxWidth and width from here */ }}>
                <h4 className="mb-2">Set New Password</h4>
                <p className="mb-4">Enter the new password</p>
                <form onSubmit={onSubmitNewPassword}>
                  <div className="input-group mb-4 bg-secondary bg-opacity-10 rounded-pill">
                    <span className="input-group-text bg-transparent border-0 ps-4">
                      <i className="bi bi-person-fill-lock"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control bg-transparent border-0 ps-1 pe-4 rounded-end"
                      placeholder="***********"
                      style={{ height: '50px' }}
                      onChange={(e) => setNewPassword(e.target.value)}
                      value={newPassword}
                      required
                      autoComplete="new-password"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? "Loading..." : "Submit"}
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>
      
    </div>
  );
};

export default ResetPassword;