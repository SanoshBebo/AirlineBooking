import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import './UnAuthorized.css';

const Unauthorized = () => {
  const [countdown, setCountdown] = useState(3); // Initial countdown value
  const navigate = useNavigate();

  // Timer effect to countdown and redirect to login page
  useEffect(() => {
    const countdownTimer = setTimeout(() => {
      if (countdown > 0) {
        setCountdown((prevCount) => prevCount - 1);
      } else {
        navigate('/userhome'); // Redirect to login page after countdown
      }
    }, 1000);

    return () => clearTimeout(countdownTimer);
  }, [countdown, navigate]);

  return (
    <div className="unauthorized-page">
      <h2>Unauthorized Access</h2>
      <p>You don't have permission to access this page.</p>
      <p>Redirecting to home page in {countdown} seconds...</p>
      {/* Add any additional content or styling as needed */}
    </div>
  );
};

export default Unauthorized;
