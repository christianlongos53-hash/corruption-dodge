import React, { useMemo } from 'react';
import { CharacterId, CharacterProfile } from '../types/game';
import { getChibiAvatarDataUrl } from '../game/sprites/ChibiSprites';

interface ChibiAvatarCardProps {
  profile: CharacterProfile;
  isSelected: boolean;
  onSelect: (id: CharacterId) => void;
}

export const ChibiAvatarCard: React.FC<ChibiAvatarCardProps> = ({
  profile,
  isSelected,
  onSelect
}) => {
  // Pre-render high-res, perfectly centered avatar image
  const avatarUrl = useMemo(() => getChibiAvatarDataUrl(profile.id, 128), [profile.id]);

  // Role / title label for quick recognition
  const colorLabel = profile.description;

  return (
    <div
      onClick={() => onSelect(profile.id)}
      className={`chibi-card ${isSelected ? 'selected' : ''}`}
      style={{
        borderColor: isSelected ? profile.primaryColor : 'transparent'
      }}
      role="button"
      tabIndex={0}
      aria-label={`Select ${profile.name} (${colorLabel})`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect(profile.id);
        }
      }}
    >
      <div className="chibi-preview-wrapper" style={{ backgroundColor: profile.secondaryColor }}>
        <img src={avatarUrl} alt={profile.name} className="chibi-card-img" />
      </div>

      <div className="chibi-info">
        <div className="chibi-name-row">
          <span className="chibi-name" style={{ color: profile.primaryColor }}>
            {profile.name}
          </span>
          {isSelected && (
            <span className="selected-badge" style={{ backgroundColor: profile.primaryColor }}>
              ✓
            </span>
          )}
        </div>
        <span className="chibi-color-pill" style={{ color: profile.primaryColor }}>
          {colorLabel}
        </span>
      </div>
    </div>
  );
};
