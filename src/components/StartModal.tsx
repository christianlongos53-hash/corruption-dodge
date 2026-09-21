import React, { useState } from 'react';
import { ChallengeData, CharacterId } from '../types/game';
import { CHARACTER_PROFILES, getChibiAvatarDataUrl } from '../game/sprites/ChibiSprites';
import { ChibiAvatarCard } from './ChibiAvatarCard';
import { Play, Trophy, ShieldAlert, Swords } from 'lucide-react';
import { audioSystem } from '../game/AudioSystem';

interface StartModalProps {
  onStartGame: (name: string, character: CharacterId) => void;
  onOpenLeaderboard: () => void;
  challengeData?: ChallengeData | null;
}

export const StartModal: React.FC<StartModalProps> = ({
  onStartGame,
  onOpenLeaderboard,
  challengeData
}) => {
  const [playerName, setPlayerName] = useState('Vivo');
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterId>('bico');

  const handleSelectCharacter = (id: CharacterId) => {
    audioSystem.playClick();
    setSelectedCharacter(id);
    setPlayerName(CHARACTER_PROFILES[id].name);
  };

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = playerName.trim() || CHARACTER_PROFILES[selectedCharacter].name;

    audioSystem.playClick();
    onStartGame(cleanName, selectedCharacter);
  };

  const challengerProfile = challengeData ? CHARACTER_PROFILES[challengeData.challengerAvatar] || CHARACTER_PROFILES['bico'] : null;
  const challengerAvatarUrl = challengeData ? getChibiAvatarDataUrl(challengeData.challengerAvatar, 70) : '';

  return (
    <div className="modal-overlay">
      <div className="modal-content cute-card start-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="badge-pill ph-badge">
            <ShieldAlert size={14} />
            <span>Anti-Corruption Endless Runner</span>
          </div>
          <h1 className="game-title">
            Corruption <span className="title-dodge">Dodge</span>
          </h1>
          <p className="game-subtitle">
            Dodge bribe envelopes, pork barrels, and kickbacks. Outrun the murky floodwaters!
          </p>
        </div>

        {/* Friend Challenge Alert Banner (if link contains challenge params) */}
        {challengeData && (
          <div className="start-challenge-banner animate-bounce-in">
            <div className="challenge-banner-avatar" style={{ backgroundColor: challengerProfile?.secondaryColor }}>
              <img src={challengerAvatarUrl} alt={challengeData.challengerName} className="challenge-avatar-img" />
            </div>
            <div className="challenge-banner-info">
              <div className="challenge-badge">
                <Swords size={13} />
                <span>DIRECT CHALLENGE</span>
              </div>
              <p className="challenge-banner-text">
                <strong>{challengeData.challengerName}</strong> reached <strong>{challengeData.targetScore.toLocaleString()} meters</strong> and challenged you to beat it!
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleStart} className="start-form">
          {/* Player Name Input */}
          <div className="input-group">
            <label htmlFor="playerName" className="input-label">
              Player / Politician Name
            </label>
            <input
              id="playerName"
              type="text"
              className="cute-input"
              placeholder="e.g. Vivo, Sharah, BingBong, Juan..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={18}
              autoFocus
            />
          </div>

          {/* Avatar Selection */}
          <div className="avatar-selection-section">
            <label className="input-label">Choose Your Politician Avatar</label>
            <div className="avatar-grid">
              {(Object.keys(CHARACTER_PROFILES) as CharacterId[]).map((id) => (
                <ChibiAvatarCard
                  key={id}
                  profile={CHARACTER_PROFILES[id]}
                  isSelected={selectedCharacter === id}
                  onSelect={handleSelectCharacter}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="modal-actions">
            <button
              type="button"
              className="cute-btn secondary-btn"
              onClick={() => {
                audioSystem.playClick();
                onOpenLeaderboard();
              }}
            >
              <Trophy size={18} />
              <span>Leaderboard</span>
            </button>

            <button type="submit" className="cute-btn primary-btn pulse-glow">
              <Play size={20} />
              <span>Start Game!</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
