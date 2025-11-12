import React from 'react';
import { BACKGROUNDS } from '../constants';

interface SelectSpotScreenProps {
  onSelect: (spotUrl: string) => void;
}

const SelectSpotScreen: React.FC<SelectSpotScreenProps> = ({ onSelect }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-black/70 text-center">
      <h2 className="text-5xl font-bold uppercase text-blue-500 mb-8" style={{ textShadow: '0 0 15px #3b82f6' }}>
        SELECT A SPOT
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {BACKGROUNDS.map((spot) => (
          <div key={spot.id} className="flex flex-col items-center gap-4">
            <button
              onClick={() => onSelect(spot.imageUrl)}
              className="w-48 h-32 rounded-md border-4 border-gray-700 hover:border-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300 ease-in-out transform hover:scale-105 bg-cover bg-center shadow-lg"
              style={{ backgroundImage: `url('${spot.imageUrl}')` }}
              aria-label={`Select ${spot.name}`}
            />
            <h3 className="text-md font-semibold text-gray-300 uppercase">{spot.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectSpotScreen;