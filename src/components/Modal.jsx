import React, { useEffect, useState } from "react";
import { GetUserFavorite } from "../api/UserHistoryAndFavorites";

const Modal = ({ children, onClose, onAddToFavorite, onRemoveFavorite, name, favorites }) => {

  const isFavorite = favorites.includes(name);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-90 overflow-hidden">
      <div className="bg-zinc-900 rounded-md p-10 min-w-md mx-auto  w-[70%]">
        <div className="flex gap-5 justify-end">
          
        {isFavorite ? (
            <button
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={onRemoveFavorite}
            >
              Remove Favorite
            </button>
          ) : (
            <button
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={onAddToFavorite}
            >
              Add to Favorite
            </button>
          )}

          <button
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={onClose}
          >
            Close
          </button>

        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
