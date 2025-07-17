import { assets } from "../assets/assets";
import { useContext } from "react";
import { AppContext } from "../contexts/AppContext";


const Header = () => {
  const {userData} = useContext(AppContext);
  return (
    
    <div className="text-center d-flex flex-column align-items-center justify-content-center py-5 px-3" style={{minHeight:"80vh"}}>

      
      <div className="container"> 
        <div className="row justify-content-center"> 
          
          <div className="col-12 col-sm-10 col-md-8 col-lg-6">
            
            <img src={assets.header} alt="header" width={120} className=" mb-4" />

            <h5 className="fw-semibold">
              Hey {userData ? userData.name : 'Developer'} <span role="img" aria-label="wave">👋</span>
            </h5>

            <h1 className="fw-bold display-5 mb-3"> Welcome To Authify</h1>

            <p className="text-muted fs-5 mb-4">
              A simple authentication system for your web applications.
            </p>
            

            <button className="btn btn-outline-dark rounded-pill px-4 py-2">
              Get Started
            </button>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default Header;