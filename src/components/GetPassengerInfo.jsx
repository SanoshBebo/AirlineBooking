import React, { useState } from 'react';

const GetPassengerInfo = ({ userDetails }) => {
  const [passengers, setPassengers] = useState([
    {
      Name: '',
      Age: 0,
      Gender: '',
    },
  ]);

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = { ...updatedPassengers[index], [name]: value };
    setPassengers(updatedPassengers);
  };

  const handleAddPassenger = () => {
    if (passengers.length < 10) {
      setPassengers([...passengers, { Name: '', Age: 0, Gender: '' }]);
    } else {
      alert('Maximum passengers limit reached (10).');
    }
  };

  const handleRemovePassenger = (index) => {
    const updatedPassengers = passengers.filter((_, i) => i !== index);
    setPassengers(updatedPassengers);
  };

  const renderPassengerInputs = () => {
    return passengers.map((passenger, index) => (
      <div key={index}>
        <h3>Passenger {index + 1}</h3>
        <input
          type="text"
          placeholder="Name"
          name="Name"
          value={passenger.Name}
          onChange={(e) => handleInputChange(index, e)}
          className="block w-full px-4 py-2 border border-gray-300 rounded mb-2 focus:outline-none"
        />
        <input
          type="number"
          placeholder="Age"
          name="Age"
          value={passenger.Age}
          onChange={(e) => handleInputChange(index, e)}
          className="block w-full px-4 py-2 border border-gray-300 rounded mb-2 focus:outline-none"
        />
        <select
          name="Gender"
          value={passenger.Gender}
          onChange={(e) => handleInputChange(index, e)}
          className="block w-full px-4 py-2 border border-gray-300 rounded mb-2 focus:outline-none"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <button onClick={() => handleRemovePassenger(index)}>Remove</button>
      </div>
    ));
  };

  return (
    <div>
      <h2>Enter Passenger Information</h2>
      {renderPassengerInputs()}
      <button onClick={handleAddPassenger}>Add New Passenger</button>
      <button onClick={() => userDetails(passengers)}>Confirm Passengers</button>
    </div>
  );
};

export default GetPassengerInfo;
