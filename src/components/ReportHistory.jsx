import React, { useState } from 'react';
import "../components/ReportHistory.css";
import { AiOutlineDelete } from 'react-icons/ai'; // Import the delete icon

const HistorySidebar = ({ ReportHistory, Favorites, onItemClick, onDeleteHistory, onDeleteFavorite }) => {
  const [selectedItem, setSelectedItem] = useState({ type: null, item: null });
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  return (
    <div className='min-h-[600px] text-white max-sm:hidden'>
      <div className="bg-zinc-900 w-full h-1/2 p-4 overflow-y-auto no-scrollbar">
        <h2 className="text-lg font-semibold mb-4">Favorites</h2>
        <ul className="overflow-x-hidden overflow-y-auto h-full">
          {Favorites.map((item, index) => (
            <li key={index} className="cursor-pointer py-2 border-b border-gray-300 relative">
              <div onClick={() => onItemClick(item)}>{item}</div>
              <div
                className="absolute right-0 top-0 h-full w-10 flex items-center justify-center"
                onClick={() => {setIsPopUpOpen(!isPopUpOpen); setSelectedItem({ type: 'favorite', item })}}
              >
                <span>...</span>
              </div>
              {selectedItem.type === 'favorite' && selectedItem.item === item && isPopUpOpen && (
                <div className="absolute bg-black border border-gray-300 p-2 top-2 right-10">
                  <AiOutlineDelete style={{ color: 'white' }} onClick={() => onDeleteFavorite(item)} />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-zinc-950 w-full h-1/2 p-4 overflow-y-auto no-scrollbar">
        <h2 className="text-lg font-semibold mb-4">Recently Viewed</h2>
        <ul className="overflow-x-hidden h-full">
          {ReportHistory.map((item, index) => (
            <li key={index} className="cursor-pointer py-2 border-b border-gray-300 relative">
              <div onClick={() => {onItemClick(item); }}>{item}</div>
              <div
                className="absolute right-0 top-0 h-full w-10 flex items-center justify-center"
                onClick={() => {setIsPopUpOpen(!isPopUpOpen); setSelectedItem({ type: 'report', item })}}
              >
                <span>...</span>
              </div>
              {selectedItem.type === 'report' && selectedItem.item === item && isPopUpOpen && (
                <div className="absolute bg-white border border-gray-300 p-2 top-2 right-10">
                  <AiOutlineDelete style={{ color: 'black' }} onClick={() => onDeleteHistory(item)} />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HistorySidebar;
