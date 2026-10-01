import React, { useState } from 'react';
import { Trophy, Volume2, VolumeX, ShieldCheck, BookOpen, Users, Droplets } from 'lucide-react';
import { audioSystem } from '../game/AudioSystem';
import { LegalModalType } from './LegalModals';

interface SiteHeaderProps {
  onOpenLeaderboard: () => void;
  onOpenLegal: (type: LegalModalType) => void;
  onScrollToGame: () => void;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({
  onOpenLeaderboard,
  onOpenLegal,
  onScrollToGame
}) => {
  const [muted, setMuted] = useState(() => audioSystem.isMuted());

  const handleToggleSound = () => {
    const isNowMuted = audioSystem.toggleMute();
    setMuted(isNowMuted);
  };

  return (
    <header className="site-header" role="banner">
      <div className="site-header-container">
        {/* Brand */}
        <div className="site-brand" onClick={onScrollToGame} role="button" tabIndex={0}>
          <span className="site-logo-emoji">🏃</span>
          <div className="site-title-group">
            <span className="site-brand-title">Corruption <span className="brand-accent">Dodge</span></span>
            <span className="site-brand-subtitle">Civic Arcade & Flood Defense</span>
          </div>
        </div>

        {/* Quick Nav for Crawlers and Users */}
        <nav className="site-nav" aria-label="Main Navigation">
          <button type="button" className="nav-btn" onClick={onScrollToGame}>
            <span className="nav-btn-icon">🎮</span>
            <span>Play</span>
          </button>
          <a href="#how-to-play" className="nav-btn">
            <BookOpen size={16} />
            <span>Guide</span>
          </a>
          <a href="#character-dossiers" className="nav-btn">
            <Users size={16} />
            <span>Avatars</span>
          </a>
          <a href="#flood-primer" className="nav-btn">
            <Droplets size={16} />
            <span>Flood Defense</span>
          </a>
          <button
            type="button"
            className="nav-btn nav-btn-highlight"
            onClick={onOpenLeaderboard}
          >
            <Trophy size={16} />
            <span>Leaderboard</span>
          </button>
        </nav>

        {/* Header Right Actions */}
        <div className="site-header-actions">
          <button
            type="button"
            className="sound-toggle-btn"
            onClick={handleToggleSound}
            aria-label={muted ? 'Unmute Sound' : 'Mute Sound'}
            title={muted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          <button
            type="button"
            className="privacy-badge-btn"
            onClick={() => onOpenLegal('privacy')}
            title="View Privacy Policy & Ad Disclosures"
          >
            <ShieldCheck size={14} />
            <span>Privacy</span>
          </button>
        </div>
      </div>
    </header>
  );
};
