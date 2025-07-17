import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useState, useContext, useEffect } from "react";
import { AppContext } from "../contexts/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { AppConstants } from "../util/constants"; 

const Login = () => {
  
  const [isCreateAccount, setIsCreateAccount] = useState(false); 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); 

  const navigate = useNavigate(); 

  
  const { getUserData, setIsLoggedIn, userData } = useContext(AppContext);
  const backendURL = AppConstants.BACKEND_URL; 

  
  useEffect(() => {
    setName("");      
    setEmail("");     
    setPassword("");  
  }, [isCreateAccount]);

  
  const onSubmitHandler = async (e) => {
    e.preventDefault(); 
    setLoading(true); 
    axios.defaults.withCredentials = true; 

    try {
      let response;
      if (isCreateAccount) { 
        response = await axios.post(`${backendURL}/register`, {
          name,
          email,
          password,
        });

        if (response.status === 201) { 
          toast.success("Account created successfully. Please login.");
          
          
          setName("");
          setEmail("");
          setPassword("");
          setIsCreateAccount(false); 

          navigate("/login"); 
        } else {
          
          toast.error("Account creation failed. Please try again.");
        }
      } else { 
        response = await axios.post(`${backendURL}/login`, { email, password });

        if (response.status === 200) { 
          setIsLoggedIn(true); 
          await getUserData(); 
          toast.success("Logged in successfully!");
          navigate("/"); 
        } else {
          
          toast.error("Login failed. Please check credentials.");
        }
      }
    } catch (error) {
      
      console.error("API Call Error:", error); 

      if (error.response) {
      
        const errorMessage = error.response.data.message || `Error: ${error.response.statusText}`;
        toast.error(errorMessage);
      } else if (error.request) {
       
        toast.error("Network error: Backend not reachable. Please ensure the server is running.");
      } else {
        toast.error("An unexpected client-side error occurred: " + error.message);
      }
      

    } finally {
      setLoading(false); 
    }
  };

  return (
    <div
      className="position-relative d-flex align-items-center justify-content-center min-vh-100"
      style={{ background: "linear-gradient(90deg, #6a5af9, #8268f9)", border: "none" }}
    >
      
      <Link to="/" className="position-absolute top-0 start-0 p-4 d-flex align-items-center text-decoration-none gap-2">
        <img src={assets.landing} alt="logo" width={32} height={32} />
        <span className="fs-4 fw-semibold text-light">Authify</span>
      </Link>

       <div className="container"> 
        <div className="row justify-content-center"> 
          <div className="col-12 col-sm-8 col-md-6 col-lg-4 px-0 mx-auto"> 
            <div className="card p-4 shadow" 
                 style={{ /* Removed maxWidth and width from here */ }}>
              <h2 className="text-center mb-4">
                {isCreateAccount ? "Create Account" : "Login"}
              </h2>
              <form onSubmit={onSubmitHandler}>
                {isCreateAccount && (
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="form-control"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Id
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="off"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    placeholder={isCreateAccount ? "**********" : "**********"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>

                {!isCreateAccount && (
                  <div className="d-flex justify-content-between mb-3">
                    <Link to="/reset-password" className="text-decoration-none">
                      Forgot password?
                    </Link>
                  </div>
                )}

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? "Loading..." : isCreateAccount ? "Sign Up" : "Login"}
                </button>
              </form>

              <div className="text-center mt-3">
                {isCreateAccount ? (
                  <span>
                    Already have an account?{" "}
                    <Link to="#" onClick={() => setIsCreateAccount(false)}>
                      Login here
                    </Link>
                  </span>
                ) : (
                  <span>
                    Don't have an account?{" "}
                    <Link to="#" onClick={() => setIsCreateAccount(true)}>
                      Sign Up
                    </Link>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;