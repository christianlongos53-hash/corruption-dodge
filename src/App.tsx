import React, { useEffect, useRef, useState } from 'react';
import { ChallengeData, CharacterId, GameState, GameStats, PROJECT_COST } from './types/game';
import { GameEngine } from './game/GameEngine';
import { StartModal } from './components/StartModal';
import { HUD } from './components/HUD';
import { GameOverModal } from './components/GameOverModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { AdBanner } from './components/AdBanner';

const parseChallengeFromUrl = (): ChallengeData | null => {
  if (typeof window === 'undefined') return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('c_name') || params.get('challenger');
    const rawScore = params.get('c_score') || params.get('score');
    const rawAvatar = params.get('c_avatar') || params.get('avatar');

    if (!name || !rawScore) return null;
    const targetScore = parseInt(rawScore, 10);
    if (isNaN(targetScore) || targetScore <= 0) return null;

    const avatarMap: Record<string, CharacterId> = {
      neli: 'neli',
      pink: 'neli',
      bico: 'neli',
      vivo: 'neli',
      blue: 'neli',
      sharah: 'sharah',
      green: 'sharah',
      vong: 'vong',
      bingbong: 'vong',
      red: 'vong',
      juan: 'juan',
      gray: 'juan',
      grey: 'juan'
    };

    const challengerAvatar: CharacterId = (rawAvatar && avatarMap[rawAvatar.toLowerCase()]) || 'juan';

    return {
      challengerName: name.trim(),
      targetScore,
      challengerAvatar
    };
  } catch (e) {
    console.error('Error parsing challenge query params:', e);
    return null;
  }
};

export const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [challengeData] = useState<ChallengeData | null>(() => parseChallengeFromUrl());
  const [gameState, setGameState] = useState<GameState>('START');
  const [playerName, setPlayerName] = useState<string>('Juan');
  const [activeCharacter, setActiveCharacter] = useState<CharacterId>('juan');
  const [finalScore, setFinalScore] = useState<number>(0);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);

  const [stats, setStats] = useState<GameStats>({
    distance: 0,
    speed: 280,
    dodgedCount: 0,
    activeCharacter: 'juan',
    playerName: 'Juan',
    weather: 'sunny',
    hits: 0,
    maxHits: 10,
    budget: 0,
    stage: 'muddy_rural',
    nextProjectBudget: PROJECT_COST,
    challenge: challengeData || undefined
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

    if (challengeData) {
      engine.setChallenge(challengeData);
    }

    engineRef.current = engine;
    engine.startLoop();

    return () => {
      engine.destroy();
    };
  }, [challengeData]);

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
            challengeData={challengeData}
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
            challengeData={challengeData}
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
