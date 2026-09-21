import React, { useState } from 'react';
import { GameStats, PROJECT_COST, STAGE_CONFIGS, formatPeso } from '../types/game';
import { CHARACTER_PROFILES, getChibiAvatarDataUrl } from '../game/sprites/ChibiSprites';
import { Volume2, VolumeX, Trophy, ShieldCheck, Sun, Wind, CloudLightning, Droplets, Coins, Sparkles } from 'lucide-react';
import { audioSystem } from '../game/AudioSystem';

interface HUDProps {
  stats: GameStats;
  onOpenLeaderboard: () => void;
}

export const HUD: React.FC<HUDProps> = ({ stats, onOpenLeaderboard }) => {
  const [muted, setMuted] = useState(audioSystem.isMuted());
  const profile = CHARACTER_PROFILES[stats.activeCharacter || 'bico'];
  const avatarUrl = getChibiAvatarDataUrl(stats.activeCharacter || 'bico', 80);

  const weather = stats.weather || 'sunny';
  const nextWeatherIn = 5000 - (stats.distance % 5000);
  const hits = stats.hits || 0;
  const maxHits = stats.maxHits || 10;
  const stageConfig = STAGE_CONFIGS[stats.stage || 'muddy_rural'];
  const budget = stats.budget || 0;
  const canAfford = budget >= PROJECT_COST;

  const toggleSound = () => {
    const nextMute = audioSystem.toggleMute();
    setMuted(nextMute);
    if (!nextMute) {
      audioSystem.playClick();
    }
  };

  return (
    <div className="hud-container">
      {/* Top Center: Project Activation Banner or Upcoming Alert */}
      {stats.projectNotification && (
        <div className="hud-notification-banner celebration-pulse">
          <Sparkles size={18} className="hud-sparkle-icon" />
          <span>{stats.projectNotification}</span>
        </div>
      )}

      {stats.activeProjectName && !stats.projectNotification && (
        <div className="hud-project-alert project-incoming-pulse">
          <span>🚨 UPCOMING PROJECT: <strong>{stats.activeProjectName}</strong> (Cost: {formatPeso(PROJECT_COST)}) — TOUCH TO ACTIVATE!</span>
        </div>
      )}

      {/* Top Left: Active Character Badge & Distance Score */}
      <div className="hud-left">
        <div className="hud-profile-pill cute-card-sm" style={{ borderLeftColor: profile.primaryColor }}>
          <div className="hud-avatar-frame" style={{ backgroundColor: profile.secondaryColor }}>
            <img src={avatarUrl} alt={profile.name} className="hud-avatar-img" />
          </div>
          <div className="hud-info">
            <div className="hud-name-row">
              <span className="hud-name">{stats.playerName || profile.name}</span>
              <span className="hud-char-tag" style={{ color: profile.primaryColor }}>
                ({profile.name})
              </span>
            </div>
            <div className="hud-distance-row">
              <span className="hud-distance-value">{stats.distance.toLocaleString()}</span>
              <span className="hud-distance-unit">meters</span>
            </div>
          </div>
        </div>

        {/* Badges Row: Public Funds, Country Stage, Flood Level, Weather */}
        <div className="hud-badges-row">
          {/* Public Funds (Earned by dodging bribes) */}
          <div
            className={`hud-budget-pill ${canAfford ? 'can-afford-upgrade' : ''}`}
            title={`Total Funds: ₱${budget.toLocaleString()}`}
          >
            <Coins size={15} className="hud-coin-icon" />
            <span>{formatPeso(budget)}</span>
            {canAfford ? (
              <span className="budget-ready-tag">✨ Can Afford {formatPeso(PROJECT_COST)}!</span>
            ) : (
              <span className="budget-target-tag">(/{formatPeso(PROJECT_COST)})</span>
            )}
          </div>

          {/* Development Stage Badge */}
          <div className={`hud-stage-pill stage-${stats.stage || 'muddy_rural'}`}>
            <span>{stageConfig.icon} {stageConfig.shortName}</span>
          </div>

          {/* Dodged Count */}
          <div className="hud-dodged-pill">
            <ShieldCheck size={15} className="hud-shield-icon" />
            <span>Dodged: {stats.dodgedCount}</span>
          </div>

          {/* 10-Touch Progressive Flood Indicator (10% per touch) */}
          <div className={`hud-flood-pill flood-level-${hits}`}>
            <Droplets size={15} className="hud-flood-icon" />
            <span>Flood: {hits}/{maxHits} ({Math.round((hits / maxHits) * 100)}%)</span>
          </div>

          {/* Dynamic Weather Badge (Every 5,000m) */}
          <div className={`hud-weather-pill weather-${weather}`}>
            {weather === 'sunny' && (
              <>
                <Sun size={15} className="weather-icon sun-spin" />
                <span>Sunny</span>
              </>
            )}
            {weather === 'windy' && (
              <>
                <Wind size={15} className="weather-icon wind-blow" />
                <span>Windy</span>
              </>
            )}
            {weather === 'stormy' && (
              <>
                <CloudLightning size={15} className="weather-icon storm-pulse" />
                <span>Stormy</span>
              </>
            )}
            <span className="weather-countdown">({nextWeatherIn}m)</span>
          </div>
        </div>
      </div>

      {/* Top Right: Controls (Sound toggle, Leaderboard) */}
      <div className="hud-right">
        <button
          className="hud-icon-btn"
          onClick={toggleSound}
          title={muted ? 'Unmute Sound' : 'Mute Sound'}
          aria-label="Toggle Sound"
        >
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <button
          className="hud-icon-btn hud-trophy-btn"
          onClick={() => {
            audioSystem.playClick();
            onOpenLeaderboard();
          }}
          title="Top 1,000 Leaderboard"
          aria-label="View Leaderboard"
        >
          <Trophy size={20} />
        </button>
      </div>
    </div>
  );
};
