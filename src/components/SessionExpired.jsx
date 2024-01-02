import React, { useEffect, useState } from 'react';
import './SessionExpired.css'; // Include your CSS for styling
import { useNavigate } from 'react-router';

const SessionExpired = ({message,redirectUrl}) => {
  const [countdown, setCountdown] = useState(3);
const navigate = useNavigate()

  useEffect(() => {
    console.log("hi")
    console.log(message,redirectUrl)
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
        if(redirectUrl == "/login"){
            localStorage.clear("");
            sessionStorage.clear("");
        }
        navigate(`${redirectUrl}`);// Redirect to the login page after countdown
    }
  }, [countdown]);

  return (
    <div className="session-expired-container">
      <div className="session-expired-modal">
        <h2>{message}</h2>
        <p>Redirecting to login page in {countdown}...</p>
      </div>
    </div>
  );
};

export default SessionExpired;
