import { useState, useEffect } from 'react';
import React from 'react';
import "../assetDisplayComponent/BookingCompletedModal.css"

const BookingCompletedModal = ({ showModal }) => {
  return (
    <div className={`fixed z-50 inset-0 overflow-y-auto ${showModal ? '' : 'hidden'}`}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-gray-800 opacity-75"></div>
        <div className="bg-white rounded-lg p-8 max-w-md text-center z-10 relative">
          <h2 className="text-3xl font-bold mb-4">
            Flights Booked Successfully
          </h2>
          <p>Your booking has been confirmed. Have a great trip!</p>
          <div className="confetti-left"></div>
          <div className="confetti-right"></div>
        </div>
      </div>
    </div>
  );
};

  export default BookingCompletedModal;