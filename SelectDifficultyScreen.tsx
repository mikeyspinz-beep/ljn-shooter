import React from 'react';
import { DIFFICULTY_LEVELS } from '../constants';
import { Difficulty } from '../types';

interface SelectDifficultyScreenProps {
  onSelect: (difficulty: Difficulty) => void;
}

const SelectDifficultyScreen: React.FC<SelectDifficultyScreenProps> = ({ onSelect }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-black/70 text-center">
      <h2 className="text-5xl font-bold uppercase text-blue-500 mb-12" style={{ textShadow: '0 0 15px #3b82f6' }}>
        SELECT DIFFICULTY
      </h2>
      <div className="flex flex-col gap-6">
        {DIFFICULTY_LEVELS.map((level) => (
          <button
            key={level.id}
            onClick={() => onSelect(level)}
            className="px-10 py-4 w-96 bg-gray-800 text-white font-bold text-lg uppercase rounded-md border-2 border-gray-600 shadow-lg shadow-blue-500/10 transition-all duration-300 ease-in-out hover:bg-blue-600 hover:border-blue-500 hover:scale-110"
          >
            {level.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelectDifficultyScreen;