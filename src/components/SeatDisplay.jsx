import React from "react";

const SeatDisplay = ({ seatlist, book }) => {
  return (
    <div className="flex flex-col bg-blue-200 p-4 rounded-md">
      
      <div className="">{seatlist}</div>
      <button
        className=" p-3 mt-5 bg-blue-500 w-full text-white rounded hover:bg-blue-600 focus:outline-none"
        onClick={book}
      >
        {" "}
        Confirm Seats
      </button>
    </div>
  );
};

export default SeatDisplay;
