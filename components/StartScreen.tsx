import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-black/70 text-center">
      <img src="https://i.postimg.cc/2Vsp30kc/LJNshooter.png" alt="LJN Shooter Logo" className="w-4/5 max-w-lg mb-4" />
      <p className="mt-4 text-base text-gray-300 max-w-md leading-relaxed">
        The classic rubber figures are back! Can you knock down all the waves before time runs out? Grab your toys and let's play!
      </p>
      <button
        onClick={onStart}
        className="mt-12 px-12 py-4 bg-blue-600 text-white font-bold text-2xl uppercase rounded-md border-b-4 border-blue-800 shadow-lg shadow-blue-500/30 transition-all duration-300 ease-in-out hover:bg-blue-500 hover:scale-110 hover:shadow-xl hover:shadow-blue-500/50"
        style={{ fontFamily: "'Press Start 2P', cursive" }}
      >
        Play
      </button>
    </div>
  );
};

export default StartScreen;
