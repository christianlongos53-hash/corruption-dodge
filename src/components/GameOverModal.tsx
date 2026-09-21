import React, { useState } from 'react';
import { CharacterId } from '../types/game';
import { CHARACTER_PROFILES, getChibiAvatarDataUrl } from '../game/sprites/ChibiSprites';
import { leaderboardService } from '../services/leaderboardService';
import { RotateCcw, Trophy, Check, Send, Waves } from 'lucide-react';
import { audioSystem } from '../game/AudioSystem';
import { AdBanner } from './AdBanner';

interface GameOverModalProps {
  score: number;
  playerName: string;
  avatar: CharacterId;
  onRestart: () => void;
  onOpenLeaderboard: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  playerName,
  avatar,
  onRestart,
  onOpenLeaderboard
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRank, setSubmittedRank] = useState<number | null>(null);

  const profile = CHARACTER_PROFILES[avatar];
  const avatarUrl = getChibiAvatarDataUrl(avatar, 100);
  const estimatedRank = leaderboardService.getUserRank(score);

  const handleSubmitScore = async () => {
    if (isSubmitting || isSubmitted) return;
    setIsSubmitting(true);
    audioSystem.playClick();

    try {
      const result = await leaderboardService.submitScore(playerName, avatar, score);
      setSubmittedRank(result.rank);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error submitting score:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay gameover-modal-overlay">
      <div className="modal-content cute-card gameover-modal animate-bounce-in">
        {/* Flood Alert Icon */}
        <div className="gameover-header">
          <div className="flood-icon-circle">
            <Waves size={34} className="flood-icon" />
          </div>
          <h2 className="gameover-title">Overtaken by Floodwaters!</h2>
          <p className="gameover-desc">
            Bribes and pork barrels blocked the road! The floodwaters rose due to blocked drainage and ghost projects!
          </p>
        </div>

        {/* Character Card & Score Showcase */}
        <div className="score-showcase-box">
          <div className="score-avatar-wrap" style={{ backgroundColor: profile.secondaryColor }}>
            <img src={avatarUrl} alt={profile.name} className="score-avatar-img" />
          </div>

          <div className="score-details">
            <span className="score-hero-name">{playerName} ({profile.name})</span>
            <div className="score-value-wrap">
              <span className="score-number">{score.toLocaleString()}</span>
              <span className="score-units">meters reached</span>
            </div>
            <div className="rank-preview-pill">
              <Trophy size={14} />
              <span>
                {submittedRank ? `Rank #${submittedRank} in the Country!` : `Estimated Rank #${estimatedRank}`}
              </span>
            </div>
          </div>
        </div>

        {/* Sponsored Display Ad Slot */}
        <AdBanner type="rectangle" className="gameover-ad-slot" />

        {/* Modal Actions */}
        <div className="modal-actions gameover-actions">
          <button
            className="cute-btn secondary-btn"
            onClick={() => {
              audioSystem.playClick();
              onRestart();
            }}
          >
            <RotateCcw size={20} />
            <span>Try Again</span>
          </button>

          {!isSubmitted ? (
            <button
              className="cute-btn primary-btn pulse-glow"
              onClick={handleSubmitScore}
              disabled={isSubmitting}
            >
              <Send size={18} />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Score'}</span>
            </button>
          ) : (
            <button
              className="cute-btn success-btn"
              onClick={() => {
                audioSystem.playClick();
                onOpenLeaderboard();
              }}
            >
              <Check size={18} />
              <span>View in Leaderboard</span>
            </button>
          )}
        </div>

        {!isSubmitted && (
          <button
            className="text-link-btn"
            onClick={() => {
              audioSystem.playClick();
              onOpenLeaderboard();
            }}
          >
            View Top 1,000 Leaderboard
          </button>
        )}
      </div>
    </div>
  );
};
