import React, { useEffect, useRef, useState } from 'react';
import { CharacterId, GameState, GameStats, PROJECT_COST } from './types/game';
import { GameEngine } from './game/GameEngine';
import { StartModal } from './components/StartModal';
import { HUD } from './components/HUD';
import { GameOverModal } from './components/GameOverModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { AdBanner } from './components/AdBanner';

export const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [gameState, setGameState] = useState<GameState>('START');
  const [playerName, setPlayerName] = useState<string>('Vivo');
  const [activeCharacter, setActiveCharacter] = useState<CharacterId>('bico');
  const [finalScore, setFinalScore] = useState<number>(0);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);

  const [stats, setStats] = useState<GameStats>({
    distance: 0,
    speed: 280,
    dodgedCount: 0,
    activeCharacter: 'bico',
    playerName: 'Vivo',
    weather: 'sunny',
    hits: 0,
    maxHits: 10,
    budget: 0,
    stage: 'muddy_rural',
    nextProjectBudget: PROJECT_COST
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new GameEngine(canvas, {
      onStatsUpdate: (newStats) => {
        setStats(newStats);
      },
      onGameOver: (score) => {
        setFinalScore(score);
        setGameState('GAMEOVER_MODAL');
      },
      onStateChange: (state) => {
        setGameState(state);
      }
    });

    engineRef.current = engine;
    engine.startLoop();

    return () => {
      engine.destroy();
    };
  }, []);

  const handleStartGame = (name: string, character: CharacterId) => {
    setPlayerName(name);
    setActiveCharacter(character);
    if (engineRef.current) {
      engineRef.current.setPlayerName(name);
      engineRef.current.setCharacter(character);
      engineRef.current.startGame();
    }
  };

  const handleRestart = () => {
    if (engineRef.current) {
      engineRef.current.restartGame();
    }
  };

  const isGameOverFlood = gameState === 'GAMEOVER_FLOOD' || gameState === 'GAMEOVER_MODAL';

  return (
    <div className={`game-app ${isGameOverFlood ? 'is-gameover-flood' : ''}`}>
      {/* Background Left Skyscraper Ad (Desktop & Tablet) */}
      <AdBanner type="skyscraper-left" className="gutter-ad gutter-ad-left" />

      <div className={`canvas-wrapper ${isGameOverFlood ? 'is-gameover-flood' : ''}`}>
        {/* Mobile Header Banner Ad (Screens < 768px) */}
        <AdBanner type="mobile-banner" className="mobile-header-ad" />

        <canvas ref={canvasRef} className="game-canvas" />

        {/* HUD during gameplay or rising flood */}
        {(gameState === 'PLAYING' || gameState === 'GAMEOVER_FLOOD') && (
          <HUD
            stats={stats}
            onOpenLeaderboard={() => setShowLeaderboard(true)}
          />
        )}

        {/* Start / Registration & Avatar Select Modal */}
        {gameState === 'START' && (
          <StartModal
            onStartGame={handleStartGame}
            onOpenLeaderboard={() => setShowLeaderboard(true)}
          />
        )}

        {/* Game Over Modal after floodwaters finish */}
        {gameState === 'GAMEOVER_MODAL' && (
          <GameOverModal
            score={finalScore}
            playerName={playerName}
            avatar={activeCharacter}
            onRestart={handleRestart}
            onOpenLeaderboard={() => setShowLeaderboard(true)}
          />
        )}

        {/* Top 1,000 Leaderboard Modal */}
        {showLeaderboard && (
          <LeaderboardModal
            onClose={() => setShowLeaderboard(false)}
            currentPlayerName={playerName}
          />
        )}
      </div>

      {/* Background Right Skyscraper Ad (Desktop & Tablet) */}
      <AdBanner type="skyscraper-right" className="gutter-ad gutter-ad-right" />
    </div>
  );
};

export default App;
