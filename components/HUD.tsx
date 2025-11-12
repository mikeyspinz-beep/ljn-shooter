import React from 'react';

interface HUDProps {
  score: number;
  timeLeft: number;
  wave: number;
}

const HUD: React.FC<HUDProps> = ({ score, timeLeft, wave }) => {
  return (
    <div 
      className="absolute top-0 left-0 right-0 h-16 bg-black/50 z-10 flex items-center justify-around p-2 text-white shadow-lg backdrop-blur-sm"
      style={{
        fontFamily: "'Press Start 2P', cursive",
      }}
    >
      <div className="text-center">
        <p className="text-xs text-gray-400">SCORE</p>
        <p className="text-2xl tracking-wider">{score.toString().padStart(6, '0')}</p>
      </div>

      <div className="text-center">
         <p className="text-xs text-gray-400">WAVE</p>
         <p className="text-2xl">{wave}</p>
      </div>
      
      <div className="text-center">
        <p className="text-xs text-gray-400">TIME</p>
        <p className={`text-3xl ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-yellow-400'}`}>
          {timeLeft}
        </p>
      </div>
    </div>
  );
};

export default HUD;
