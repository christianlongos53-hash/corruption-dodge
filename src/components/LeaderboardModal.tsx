import React, { useEffect, useState, useMemo } from 'react';
import { LeaderboardEntry } from '../types/game';
import { leaderboardService } from '../services/leaderboardService';
import { CHARACTER_PROFILES, getChibiAvatarDataUrl } from '../game/sprites/ChibiSprites';
import { Trophy, Search, X, Medal, Crown, Sparkles } from 'lucide-react';
import { audioSystem } from '../game/AudioSystem';

interface LeaderboardModalProps {
  onClose: () => void;
  currentPlayerName?: string;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  onClose,
  currentPlayerName
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    leaderboardService.getTop1000().then((data) => {
      if (mounted) {
        setEntries(data);
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    const q = searchQuery.toLowerCase().trim();
    return entries.filter(
      (e) => e.name.toLowerCase().includes(q) || e.avatar.toLowerCase().includes(q)
    );
  }, [entries, searchQuery]);

  const renderRankBadge = (rank?: number) => {
    if (!rank) return null;
    if (rank === 1) {
      return (
        <div className="rank-badge rank-gold" title="Rank 1 - Champion">
          <Crown size={16} />
          <span>1</span>
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="rank-badge rank-silver" title="Rank 2">
          <Medal size={16} />
          <span>2</span>
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="rank-badge rank-bronze" title="Rank 3">
          <Medal size={16} />
          <span>3</span>
        </div>
      );
    }
    return <span className="rank-number">#{rank}</span>;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content cute-card leaderboard-modal animate-bounce-in">
        {/* Header */}
        <div className="modal-header-row">
          <div className="leaderboard-title-wrap">
            <div className="leaderboard-trophy-icon">
              <Trophy size={26} />
            </div>
            <div>
              <h2 className="modal-title">Top 1,000 Leaderboard</h2>
              <p className="modal-subtitle">Honor roll of heroes standing up against corruption!</p>
            </div>
          </div>
          <button
            className="close-btn"
            onClick={() => {
              audioSystem.playClick();
              onClose();
            }}
            aria-label="Close Leaderboard"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Filter Bar */}
        {entries.length > 0 && (
          <div className="leaderboard-search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search player name or character..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                <X size={14} />
              </button>
            )}
          </div>
        )}

        {/* Leaderboard Table / List */}
        <div className="leaderboard-list-wrap">
          {isLoading ? (
            <div className="leaderboard-loading">Loading champions...</div>
          ) : entries.length === 0 ? (
            <div className="leaderboard-empty-state">
              <div className="empty-trophy-circle">
                <Trophy size={48} className="empty-trophy" />
              </div>
              <h3 className="empty-title">No heroes on the leaderboard yet!</h3>
              <p className="empty-desc">
                Be the very first player to sprint, dodge dirty bribe obstacles, and claim Rank #1!
              </p>
              <div className="empty-sparkle-row">
                <Sparkles size={16} />
                <span>Play a sprint and submit your distance!</span>
              </div>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="leaderboard-empty">No heroes match "{searchQuery}"</div>
          ) : (
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th className="col-rank">Rank</th>
                  <th className="col-hero">Hero</th>
                  <th className="col-character">Character</th>
                  <th className="col-score">Distance</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry) => {
                  const profile = CHARACTER_PROFILES[entry.avatar || 'bico'];
                  const avatarUrl = getChibiAvatarDataUrl(entry.avatar || 'bico', 50);
                  const isCurrent =
                    currentPlayerName &&
                    entry.name.toLowerCase() === currentPlayerName.toLowerCase();

                  return (
                    <tr
                      key={entry.id}
                      className={`leaderboard-row ${isCurrent ? 'current-player-row' : ''}`}
                    >
                      <td className="col-rank">{renderRankBadge(entry.rank)}</td>
                      <td className="col-hero">
                        <div className="hero-cell">
                          <img
                            src={avatarUrl}
                            alt={profile.name}
                            className="table-avatar-img"
                            style={{ backgroundColor: profile.secondaryColor }}
                          />
                          <span className="table-hero-name">
                            {entry.name}
                            {isCurrent && <span className="you-tag">YOU</span>}
                          </span>
                        </div>
                      </td>
                      <td className="col-character">
                        <span
                          className="table-char-badge"
                          style={{
                            backgroundColor: profile.secondaryColor,
                            color: profile.primaryColor
                          }}
                        >
                          {profile.name}
                        </span>
                      </td>
                      <td className="col-score">
                        <span className="table-score-value">
                          {entry.score.toLocaleString()} <span className="m-unit">m</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer info */}
        <div className="leaderboard-footer">
          <span>
            {entries.length === 0
              ? 'Leaderboard ready for your first record!'
              : `Showing ${filteredEntries.length} of ${entries.length} hero entries`}
          </span>
          <button
            className="cute-btn secondary-btn"
            onClick={() => {
              audioSystem.playClick();
              onClose();
            }}
          >
            Back to Game
          </button>
        </div>
      </div>
    </div>
  );
};
