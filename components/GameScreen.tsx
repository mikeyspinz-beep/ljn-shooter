import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Figure, Projectile, GunId, Explosion, Difficulty, FloatingText } from '../types';
import { ENEMY_DATA, GUNS } from '../constants';
import HUD from './HUD';

interface GameScreenProps {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  onGameOver: (score: number) => void;
  backgroundUrl: string;
  difficulty: Difficulty;
}

const SPAWN_ANIMATION_DURATION = 600; // ms
const EXPLOSION_DURATION = 400; // ms
const FLOATING_TEXT_DURATION = 1200; // ms

const GameScreen: React.FC<GameScreenProps> = ({ score, setScore, onGameOver, backgroundUrl, difficulty }) => {
  const [timeLeft, setTimeLeft] = useState(difficulty.duration);
  const [gunX, setGunX] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [activeGunId, setActiveGunId] = useState<GunId>('nerf_gun');
  const [screenShake, setScreenShake] = useState(false);
  const [screenFlash, setScreenFlash] = useState(false);
  const [screenRedFlash, setScreenRedFlash] = useState(false);
  const [waveClearMessage, setWaveClearMessage] = useState(false);
  const [, setTick] = useState(0); // Used to force re-renders

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>();
  const isGameOver = useRef(false);
  const isLevelTransitioning = useRef(false);

  // Refs for canonical game state
  const enemiesRef = useRef<Figure[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);
  const explosionsRef = useRef<Explosion[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);

  const activeGun = GUNS[activeGunId];

  useEffect(() => {
    if (gameAreaRef.current) {
        setGunX(gameAreaRef.current.offsetWidth / 2);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const gunIds = Object.keys(GUNS) as GunId[];
      const keyIndex = parseInt(event.key, 10) - 1;

      if (!isNaN(keyIndex) && keyIndex >= 0 && keyIndex < gunIds.length) {
        setActiveGunId(gunIds[keyIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const spawnWave = useCallback(() => {
    if (!gameAreaRef.current) return;
    isLevelTransitioning.current = true;
    const newEnemies: Figure[] = [];
    const waveSize = Math.min(currentLevel * 2 + 3, 15);

    for (let i = 0; i < waveSize; i++) {
        const enemyData = ENEMY_DATA[Math.floor(Math.random() * ENEMY_DATA.length)];
        const side = Math.random() > 0.5 ? 'left' : 'right';

        let dx = (side === 'left' ? 1 : -1) * (Math.random() * 0.4 + 0.4) * difficulty.speedMultiplier;
        let dy = (Math.random() - 0.5) * 0.2 * difficulty.speedMultiplier;

        if (enemyData.id === 'perfect') dx *= 1.4;
        if (enemyData.id === 'rude') dy *= 1.8;
        
        newEnemies.push({
            id: Date.now() + i,
            characterId: enemyData.id,
            x: side === 'left' ? -10 : 110,
            y: Math.random() * 30 + 10, // Keep them in the upper part of the screen
            width: enemyData.width,
            height: enemyData.height,
            imageUrl: enemyData.imageUrl,
            status: 'standing',
            dx, dy,
            scale: 1,
            phase: Math.random() * Math.PI * 2,
            spawnTime: Date.now(),
        });
    }
    enemiesRef.current = newEnemies;
    setTimeout(() => { isLevelTransitioning.current = false; }, 200);
  }, [currentLevel, difficulty.speedMultiplier]);

  useEffect(() => {
    spawnWave();
  }, [currentLevel, spawnWave]);
  
  const handleGameOver = useCallback((currentScore: number) => {
      if (!isGameOver.current) {
          isGameOver.current = true;
          if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
          onGameOver(currentScore);
      }
  }, [onGameOver]);

  useEffect(() => {
    if (timeLeft <= 0) handleGameOver(score);
    const timer = setInterval(() => setTimeLeft(prev => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, score, handleGameOver]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    setGunX(Math.max(0, Math.min(event.clientX - rect.left, rect.width)));
  };

  const handleFire = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!gameAreaRef.current || isGameOver.current || isLevelTransitioning.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const targetX = event.clientX - rect.left;
    const targetY = event.clientY - rect.top;
    const startX = gunX;
    const startY = rect.height * activeGun.fireOffsetY;
    const angle = Math.atan2(targetY - startY, targetX - startX) * (180 / Math.PI) + 90;

    projectilesRef.current.push({
      id: Date.now(), startX, startY, x: startX, y: startY,
      targetX, targetY, angle, progress: 0, type: activeGunId,
    });
  };
  
  const gameLoop = useCallback(() => {
    if (isGameOver.current || !gameAreaRef.current) {
        animationFrameId.current = requestAnimationFrame(gameLoop);
        return;
    }
    const gameRect = gameAreaRef.current.getBoundingClientRect();
    const time = Date.now();
    const previousStandingCount = enemiesRef.current.filter(e => e.status === 'standing').length;

    // 1. Update Projectiles
    projectilesRef.current = projectilesRef.current.map(p => ({
        ...p,
        progress: p.progress + GUNS[p.type].speed,
        x: p.startX + (p.targetX - p.startX) * (p.progress + GUNS[p.type].speed),
        y: p.startY + (p.targetY - p.startY) * (p.progress + GUNS[p.type].speed),
    })).filter(p => p.progress < 1);

    // 2. Update Enemies & Hit Detection
    const projectilesToRemove = new Set<number>();
    let scoreToAdd = 0;

    enemiesRef.current = enemiesRef.current.map(enemy => {
        if (enemy.status === 'falling') return enemy;

        // Hit detection
        if (enemy.status === 'standing' && !isLevelTransitioning.current) {
            for (const p of projectilesRef.current) {
                if (projectilesToRemove.has(p.id)) continue;

                const enemyWidthPx = (enemy.width / 100) * gameRect.width * enemy.scale;
                const enemyHeightPx = (enemy.height / 100) * gameRect.height * enemy.scale;
                const enemyLeft = (enemy.x / 100) * gameRect.width - enemyWidthPx / 2;
                const enemyTop = (enemy.y / 100) * gameRect.height - enemyHeightPx / 2;
                
                if (p.x > enemyLeft && p.x < enemyLeft + enemyWidthPx && p.y > enemyTop && p.y < enemyTop + enemyHeightPx) {
                    const enemyData = ENEMY_DATA.find(e => e.id === enemy.characterId);
                    const isHeadshot = enemyData?.headshotRect && 
                                       p.y < (enemyTop + (enemyData.headshotRect.y * enemyHeightPx) + (enemyData.headshotRect.height * enemyHeightPx));

                    if (isHeadshot) {
                        scoreToAdd += 250;
                        floatingTextsRef.current.push({ id: time + Math.random(), text: 'HEADSHOT!', x: p.x, y: p.y - 20, type: 'headshot', createdAt: time });
                        setScreenRedFlash(true);
                        setTimeout(() => setScreenRedFlash(false), 150);
                    } else {
                        scoreToAdd += 100;
                        floatingTextsRef.current.push({ id: time + Math.random(), text: '+100', x: p.x, y: p.y, type: 'score', createdAt: time });
                    }
                    
                    projectilesToRemove.add(p.id);
                    enemy.status = 'falling';
                    enemy.fallStartTime = time;

                    if (p.type === 'grenade_launcher' || p.type === 'water_gun') {
                        const explosionColor = p.type === 'grenade_launcher' ? 'bg-orange-500/80' : 'bg-pink-500/80';
                        const explosionShadow = p.type === 'grenade_launcher' ? '0 0 30px 20px #f97316, 0 0 10px 5px #fff' : '0 0 30px 20px #ec4899, 0 0 10px 5px #fff';
                        explosionsRef.current.push({ id: time, x: p.x, y: p.y, color: explosionColor, shadow: explosionShadow, createdAt: time });
                        setScreenShake(true); setScreenFlash(true);
                        setTimeout(() => setScreenShake(false), 500);
                        setTimeout(() => setScreenFlash(false), 100);
                    }
                    break;
                }
            }
        }

        // Entry Animation
        const timeSinceSpawn = time - enemy.spawnTime;
        if (timeSinceSpawn < SPAWN_ANIMATION_DURATION) {
            const progress = timeSinceSpawn / SPAWN_ANIMATION_DURATION;
            const easedProgress = 1 - Math.pow(1 - progress, 4); // Ease-out
            const initialScale = 3;
            const initialY = 110;
            const currentScale = initialScale - (initialScale - enemy.scale) * easedProgress;
            const currentY = initialY - (initialY - enemy.y) * easedProgress;
            return { ...enemy, scale: currentScale, y: currentY };
        }

        // Regular Movement
        let newX = enemy.x + enemy.dx, newDx = enemy.dx;
        if ((newX > 100 + enemy.width / 2 && newDx > 0) || (newX < 0 - enemy.width / 2 && newDx < 0)) newDx = -newDx;
        let newY = enemy.y + enemy.dy, newDy = enemy.dy;
        if ((newY > 40 && newDy > 0) || (newY < 10 && newDy < 0)) newDy = -newDy; // Keep them in the upper area
        const newScale = 1 + Math.sin(time * 0.002 + enemy.phase) * 0.15;
        
        return { ...enemy, x: newX, dx: newDx, y: newY, dy: newDy, scale: newScale };
    });

    if (scoreToAdd > 0) setScore(s => s + scoreToAdd);
    projectilesRef.current = projectilesRef.current.filter(p => !projectilesToRemove.has(p.id));
    enemiesRef.current = enemiesRef.current.filter(e => e.status !== 'falling' || (e.fallStartTime && time - e.fallStartTime < 800));

    // 3. Update Effects
    explosionsRef.current = explosionsRef.current.filter(e => time - e.createdAt < EXPLOSION_DURATION);
    floatingTextsRef.current = floatingTextsRef.current.filter(t => time - t.createdAt < FLOATING_TEXT_DURATION);

    // 4. Check for Wave Clear
    const nextStandingCount = enemiesRef.current.filter(e => e.status === 'standing').length;
    if (previousStandingCount > 0 && nextStandingCount === 0 && !isLevelTransitioning.current) {
        isLevelTransitioning.current = true;
        setWaveClearMessage(true);
        setTimeout(() => setWaveClearMessage(false), 1200);
        setTimeout(() => setCurrentLevel(prev => prev + 1), 1200);
    }
    
    // 5. Force re-render
    setTick(t => t + 1);
    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, []);

  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(gameLoop);
    return () => { if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current); };
  }, [gameLoop]);

 const renderProjectile = (projectile: Projectile) => {
    switch (projectile.type) {
        case 'grenade_launcher':
            return <div key={projectile.id} className="absolute z-30" style={{ left: projectile.x, top: projectile.y, transform: `translate(-50%, -50%) rotate(${projectile.progress * 720}deg)` }}><div className="w-5 h-5 bg-green-600 rounded-full border-2 border-green-800" /></div>;
        case 'water_gun':
             return <div key={projectile.id} className="absolute z-30" style={{ left: projectile.x, top: projectile.y, transform: `translate(-50%, -50%) rotate(${projectile.progress * 720}deg)` }}><div className="w-5 h-5 bg-pink-500 rounded-full border-2 border-pink-700" /></div>;
        case 'nerf_gun': default:
            return <div key={projectile.id} className="absolute z-30" style={{ left: projectile.x, top: projectile.y, transform: `translate(-50%, -50%)` }}><div className="w-3 h-3 bg-yellow-400 rounded-full border border-black shadow-sm" /></div>;
    }
};

  return (
    <div 
        ref={gameAreaRef}
        onClick={handleFire}
        onMouseMove={handleMouseMove}
        className="w-full h-full cursor-crosshair relative bg-cover bg-center overflow-hidden"
        style={{backgroundImage: `url('${backgroundUrl}')`}}
    >
        <HUD score={score} timeLeft={timeLeft} wave={currentLevel + 1} />
        
        <div className={`w-full h-full absolute top-0 left-0 ${screenShake ? 'animate-shake' : ''}`}>
            <div className="w-full h-full absolute top-0 left-0" style={{boxShadow: 'inset 0 0 100px 20px rgba(0,0,0,0.7)'}}></div>
            
            {enemiesRef.current.map(enemy => (
                <img
                key={enemy.id}
                src={enemy.imageUrl}
                alt="Enemy Figure"
                className={`absolute transition-transform duration-500 ease-out ${
                    enemy.status === 'falling' ? 'rotate-[720deg] scale-0 opacity-0' : 'opacity-100'
                }`}
                style={{
                    left: `${enemy.x}%`,
                    top: `${enemy.y}%`,
                    width: `${enemy.width}%`,
                    height: `${enemy.height}%`,
                    maxWidth: '180px',
                    maxHeight: '210px',
                    transform: `translateX(-50%) translateY(-50%) scale(${enemy.scale})`,
                    filter: 'drop-shadow(2px 4px 6px black)',
                    willChange: 'transform, top, left',
                }}
                />
            ))}

            {projectilesRef.current.map(renderProjectile)}

            {explosionsRef.current.map(exp => (
                <div
                key={exp.id}
                className={`absolute w-24 h-24 ${exp.color} rounded-full explosion z-50`}
                style={{ left: `${exp.x}px`, top: `${exp.y}px`, boxShadow: exp.shadow, transformOrigin: 'center center' }}
                />
            ))}

            {activeGun.imageUrl && (
                <img
                    key={activeGun.id}
                    src={activeGun.imageUrl}
                    alt="Gun"
                    className={`absolute bottom-0 ${activeGun.className} pointer-events-none z-20`}
                    style={{ left: gunX, bottom: '-40px', transform: 'translateX(-50%)' }}
                />
            )}
        </div>

        <div className="absolute top-20 left-4 z-40 flex flex-col gap-2">
            {(Object.keys(GUNS) as GunId[]).map((gunId, index) => (
                <div key={gunId} className="relative">
                     <span className="absolute -left-3 top-1/2 -translate-y-1/2 text-white text-lg font-bold" style={{textShadow:'2px 2px 3px #000'}}>{index + 1}</span>
                    <button
                        onClick={(e) => { e.stopPropagation(); setActiveGunId(gunId as GunId); }}
                        className={`w-20 h-16 rounded-lg bg-black/50 p-1 border-2 transition-all ${activeGunId === gunId ? 'border-blue-400 scale-110' : 'border-transparent hover:border-gray-500'}`}
                    >
                        <img src={GUNS[gunId as GunId].thumbUrl} alt={`${gunId} thumbnail`} className="w-full h-full object-contain"/>
                    </button>
                </div>
            ))}
        </div>

        {screenFlash && <div className="absolute inset-0 bg-white/70 z-[60] pointer-events-none"></div>}
        {screenRedFlash && <div className="absolute inset-0 bg-red-600/50 z-[60] pointer-events-none"></div>}

        {floatingTextsRef.current.map(text => {
            const isHeadshot = text.type === 'headshot';
            const textClass = isHeadshot
                ? 'text-red-500 headshot-pop text-4xl uppercase'
                : 'text-yellow-400 float-up text-2xl';
            const textShadow = isHeadshot
                ? '2px 2px 0px #000, 0 0 15px #ef4444'
                : '2px 2px 4px rgba(0,0,0,0.7)';
            return (
                <div
                    key={text.id}
                    className={`absolute ${textClass} font-bold pointer-events-none z-50`}
                    style={{ left: text.x, top: text.y, textShadow, transform: 'translateX(-50%)' }}
                >
                    {text.text}
                </div>
            );
        })}
        
        {waveClearMessage && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-pop-out z-50 pointer-events-none">
                <p className="text-6xl text-center font-bold text-yellow-400" style={{textShadow: '0 0 15px #facc15, 0 0 5px #000'}}>WAVE</p>
                <p className="text-8xl text-center font-bold text-yellow-400" style={{textShadow: '0 0 15px #facc15, 0 0 5px #000'}}>CLEAR!</p>
            </div>
        )}
    </div>
  );
};

export default GameScreen;