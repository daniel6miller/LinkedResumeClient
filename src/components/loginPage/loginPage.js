import React, { useState } from 'react';
import Brand from './brand/brand';
import Login from './login/login';
import SignUp from './signUp/signUp';
import ForgetPassword from './forgetPassword/forgetPassword';
import './login.css';

function LoginPage() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showForgetPassword, setShowForgetPassword] = useState(false);

  const handleForgetPasswordClick = () => {
    setShowForgetPassword(true);
  };

  const handleCloseForgetPassword = () => {
    setShowForgetPassword(false);
  };


  const handleSignUpClick = () => {
    setShowSignUp(true);
  };

  const handleCloseSignUp = () => {
    setShowSignUp(false);
  };

  return (
    <div className="wrapper">
      {!showSignUp && ( // Only show Brand and Login if showSignUp is false
        <>
          <div className="wrapperItem">
            <Brand />
          </div>
          <div className="wrapperItem">
            <Login onSignUpClick={handleSignUpClick} onForgetPasswordClick={handleForgetPasswordClick} />
          </div>
        </>
      )}
      {showForgetPassword && (
        <ForgetPassword onClose={handleCloseForgetPassword} /> // Show SignUp if showSignUp is true
      )}
      {showSignUp && (
        <SignUp onClose={handleCloseSignUp} /> // Show SignUp if showSignUp is true
      )}
    </div>
  );
}

export default LoginPage;