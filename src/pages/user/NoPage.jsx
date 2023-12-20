import React from "react";
import { useNavigate } from "react-router";

const NoPage = () => {

    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-5xl text-blue-800 font-semibold mb-2">404</h1>
      <p className="text-2xl text-blue-700 mb-4">Page Not Found</p>
      <p className="text-lg text-blue-600">We can't seem to find the page you're looking for.</p>
      
      <button onClick={()=>navigate("/")} className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
        Return to Home
      </button>
    </div>
  );
};

export default NoPage;
