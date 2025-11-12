import React, { useState, useCallback } from 'react';
import GameScreen from './components/GameScreen';
import StartScreen from './components/StartScreen';
import EndScreen from './components/EndScreen';
import SelectSpotScreen from './components/SelectSpotScreen';
import SelectDifficultyScreen from './components/SelectDifficultyScreen';
import { GameStatus, Difficulty } from './types';
import { BACKGROUNDS, DIFFICULTY_LEVELS } from './constants';

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.Start);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedSpot, setSelectedSpot] = useState<string>(BACKGROUNDS[0].imageUrl);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(DIFFICULTY_LEVELS[1]);

  const handleStart = useCallback(() => {
    setStatus(GameStatus.SelectingSpot);
  }, []);

  const handleSpotSelect = useCallback((spotUrl: string) => {
    setSelectedSpot(spotUrl);
    setStatus(GameStatus.SelectingDifficulty);
  }, []);

  const handleDifficultySelect = useCallback((difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    setScore(0);
    setStatus(GameStatus.Playing);
  }, []);

  const gameOver = useCallback((currentScore: number) => {
    setFinalScore(currentScore);
    setStatus(GameStatus.GameOver);
  }, []);

  const backToMenu = useCallback(() => {
    setStatus(GameStatus.Start);
  }, []);
  
  const playAgain = useCallback(() => {
    setScore(0);
    setStatus(GameStatus.Playing);
  }, []);

  const renderContent = () => {
    switch (status) {
      case GameStatus.SelectingSpot:
        return <SelectSpotScreen onSelect={handleSpotSelect} />;
      case GameStatus.SelectingDifficulty:
        return <SelectDifficultyScreen onSelect={handleDifficultySelect} />;
      case GameStatus.Playing:
        return <GameScreen score={score} setScore={setScore} onGameOver={gameOver} backgroundUrl={selectedSpot} difficulty={selectedDifficulty} />;
      case GameStatus.GameOver:
        return <EndScreen score={finalScore} onRestart={playAgain} onMenu={backToMenu} />;
      case GameStatus.Start:
      default:
        return <StartScreen onStart={handleStart} />;
    }
  };

  return (
    <div className="w-full h-full max-w-4xl max-h-[768px] mx-auto bg-gray-800 shadow-lg shadow-blue-500/30 border-4 border-gray-600 aspect-[4/3] relative">
      {renderContent()}
    </div>
  );
};

export default App;
