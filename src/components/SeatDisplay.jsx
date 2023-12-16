import React from 'react'

const SeatDisplay = ({seatlist,book}) => {
  return (
    <div>
    <div className="single-flight-grid">
    {seatlist}
  </div>
  <button  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none" onClick={book}> book</button>
    </div>
  )
}

export default SeatDisplay