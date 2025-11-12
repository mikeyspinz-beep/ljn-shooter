import React from 'react';

interface EndScreenProps {
  score: number;
  onRestart: () => void;
  onMenu: () => void;
}

const EndScreen: React.FC<EndScreenProps> = ({ score, onRestart, onMenu }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-black/80 text-center backdrop-blur-sm">
      <h2 className="text-6xl font-bold uppercase text-blue-500" style={{ textShadow: '0 0 15px #3b82f6' }}>
        TIME'S UP!
      </h2>
      <p className="mt-6 text-2xl text-gray-300">Final Score:</p>
      <p className="my-4 text-8xl font-extrabold text-yellow-400" style={{ textShadow: '0 0 20px #facc15' }}>
        {score}
      </p>
      <div className="flex gap-4 mt-8">
        <button
          onClick={onRestart}
          className="px-8 py-3 bg-blue-600 text-white font-bold text-xl uppercase rounded-md border-b-4 border-blue-800 transition-all duration-300 ease-in-out hover:bg-blue-500 hover:scale-105"
        >
          Play Again
        </button>
        <button
          onClick={onMenu}
          className="px-8 py-3 bg-gray-700 text-white font-bold text-xl uppercase rounded-md border-b-4 border-gray-900 transition-all duration-300 ease-in-out hover:bg-gray-600 hover:scale-105"
        >
          Main Menu
        </button>
      </div>
    </div>
  );
};

export default EndScreen;