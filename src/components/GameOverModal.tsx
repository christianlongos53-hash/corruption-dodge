import React, { useState } from 'react';
import { ChallengeData, CharacterId } from '../types/game';
import { CHARACTER_PROFILES, getChibiAvatarDataUrl } from '../game/sprites/ChibiSprites';
import { leaderboardService } from '../services/leaderboardService';
import { RotateCcw, Trophy, Check, Send, Waves, Share2, Copy, Swords, Flame } from 'lucide-react';
import { audioSystem } from '../game/AudioSystem';
import { AdBanner } from './AdBanner';

interface GameOverModalProps {
  score: number;
  playerName: string;
  avatar: CharacterId;
  onRestart: () => void;
  onOpenLeaderboard: () => void;
  challengeData?: ChallengeData | null;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  playerName,
  avatar,
  onRestart,
  onOpenLeaderboard,
  challengeData
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRank, setSubmittedRank] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const profile = CHARACTER_PROFILES[avatar];
  const avatarUrl = getChibiAvatarDataUrl(avatar, 100);
  const estimatedRank = leaderboardService.getUserRank(score);

  const isChallenge = Boolean(challengeData && challengeData.targetScore > 0);
  const beatChallenger = isChallenge && score >= challengeData!.targetScore;
  const leadMeters = isChallenge ? score - challengeData!.targetScore : 0;
  const shortfallMeters = isChallenge ? challengeData!.targetScore - score : 0;

  // Generate Challenge Link
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://corruptiondodge.lol';
  const challengeUrl = `${currentOrigin}/?c_name=${encodeURIComponent(playerName)}&c_score=${score}&c_avatar=${avatar}`;

  // Generate Social Share Text
  const shareText = beatChallenger
    ? `🏆 I just BEAT ${challengeData!.challengerName}'s record of ${challengeData!.targetScore.toLocaleString()}m with my new score of ${score.toLocaleString()}m on Corruption Dodge! 🌊🏃 Who's next? Can you beat me? Challenge accepted: ${challengeUrl}`
    : `🌊🏃 I reached ${score.toLocaleString()} meters dodging corruption and floodwaters on Corruption Dodge! Think you can beat my score? Challenge me here: ${challengeUrl}`;

  const handleCopyLink = async () => {
    audioSystem.playClick();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy challenge text:', err);
    }
  };

  const handleNativeShare = async () => {
    audioSystem.playClick();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Corruption Dodge - Friend Challenge!',
          text: shareText,
          url: challengeUrl
        });
      } catch (err) {
        // User cancelled or share failed, fallback to copy
        console.log('Share dismissed', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleFacebookShare = () => {
    audioSystem.playClick();
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(challengeUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  const handleTwitterShare = () => {
    audioSystem.playClick();
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  const handleWhatsAppShare = () => {
    audioSystem.playClick();
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

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

        {/* Friend Challenge Face-off Outcome Banner */}
        {isChallenge && (
          <div className={`gameover-challenge-banner ${beatChallenger ? 'victory-banner' : 'defeat-banner'}`}>
            <div className="challenge-outcome-badge">
              {beatChallenger ? (
                <>
                  <Flame size={16} className="victory-flame" />
                  <span>CHALLENGE WON!</span>
                </>
              ) : (
                <>
                  <Swords size={16} />
                  <span>CHALLENGE UNFINISHED</span>
                </>
              )}
            </div>
            {beatChallenger ? (
              <p className="challenge-outcome-text">
                🎉 You crushed <strong>{challengeData!.challengerName}</strong>'s score of <strong>{challengeData!.targetScore.toLocaleString()}m</strong> by <strong>+{leadMeters.toLocaleString()}m</strong>!
              </p>
            ) : (
              <p className="challenge-outcome-text">
                Fell short of <strong>{challengeData!.challengerName}</strong>'s record of <strong>{challengeData!.targetScore.toLocaleString()}m</strong> by <strong>{shortfallMeters.toLocaleString()}m</strong>. Try again!
              </p>
            )}
          </div>
        )}

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

        {/* Challenge Friends & Social Share Section */}
        <div className="share-challenge-section">
          <div className="share-challenge-header">
            <Share2 size={16} className="share-header-icon" />
            <span className="share-header-title">
              {beatChallenger ? 'Brag to Friends & Challenge Them!' : 'Challenge Your Friends to Beat You!'}
            </span>
          </div>

          <div className="share-buttons-row">
            {/* Native Share (Mobile) */}
            <button
              type="button"
              className="cute-btn share-native-btn"
              onClick={handleNativeShare}
              title="Share via Apps"
            >
              <Share2 size={16} />
              <span>Share</span>
            </button>

            {/* Facebook */}
            <button
              type="button"
              className="share-icon-btn fb-btn"
              onClick={handleFacebookShare}
              title="Share to Facebook"
              aria-label="Share to Facebook"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>

            {/* X (Twitter) */}
            <button
              type="button"
              className="share-icon-btn twitter-btn"
              onClick={handleTwitterShare}
              title="Post to X / Twitter"
              aria-label="Post to X"
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </button>

            {/* WhatsApp */}
            <button
              type="button"
              className="share-icon-btn wa-btn"
              onClick={handleWhatsAppShare}
              title="Send via WhatsApp"
              aria-label="Send via WhatsApp"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </button>

            {/* Copy Challenge Link */}
            <button
              type="button"
              className={`cute-btn copy-link-btn ${copied ? 'copied-btn' : ''}`}
              onClick={handleCopyLink}
              title="Copy Challenge Link & Message"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
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
