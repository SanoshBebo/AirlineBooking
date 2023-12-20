import React from "react";

const SeatDisplay = ({ seatlist, book }) => {
  return (
    <div className="flex flex-col items-left">
      <div className="single-flight-grid">{seatlist}</div>
      <button
        className=" py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
        onClick={book}
      >
        {" "}
        book
      </button>
    </div>
  );
};

export default SeatDisplay;
