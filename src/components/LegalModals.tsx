import React, { useEffect } from 'react';
import { X, ShieldCheck, FileText, Mail, ExternalLink, Info, AlertTriangle } from 'lucide-react';
import { audioSystem } from '../game/AudioSystem';

export type LegalModalType = 'privacy' | 'terms' | 'about' | null;

interface LegalModalProps {
  type: LegalModalType;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!type) return null;

  const handleClose = () => {
    audioSystem.playClick();
    onClose();
  };

  return (
    <div className="modal-overlay legal-modal-overlay" onClick={handleClose}>
      <div
        className="modal-content cute-card legal-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
      >
        <button
          className="modal-close-btn"
          onClick={handleClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {type === 'privacy' && (
          <div className="legal-content">
            <div className="legal-header">
              <div className="badge-pill ph-badge">
                <ShieldCheck size={16} />
                <span>Compliance & Trust</span>
              </div>
              <h2 id="legal-modal-title" className="legal-title">Privacy Policy</h2>
              <p className="legal-date">Last Updated: October 2026</p>
            </div>

            <div className="legal-body-scroll">
              <section className="legal-section">
                <h3>1. Introduction</h3>
                <p>
                  Welcome to <strong>Corruption Dodge</strong> (accessible at <a href="https://corruptiondodge.lol" target="_blank" rel="noopener noreferrer">https://corruptiondodge.lol</a>). 
                  We respect the privacy of our visitors and players. This Privacy Policy document explains the types of personal information that is collected and recorded by Corruption Dodge and how we use it.
                </p>
              </section>

              <section className="legal-section highlight-box">
                <h3>2. Google AdSense & Third-Party Advertising (Important Disclosure)</h3>
                <p>
                  We use <strong>Google AdSense</strong> to serve advertisements on our website. Google is a third-party vendor that uses cookies to serve ads based on a user's prior visits to this website or other websites on the Internet:
                </p>
                <ul>
                  <li>
                    <strong>DoubleClick DART Cookie:</strong> Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visits to our site and/or other sites on the web.
                  </li>
                  <li>
                    <strong>Opting Out of Personalized Advertising:</strong> Users may opt out of personalized advertising by visiting the official{' '}
                    <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
                      Google Ads Settings <ExternalLink size={12} />
                    </a>{' '}
                    or by visiting{' '}
                    <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">
                      www.aboutads.info <ExternalLink size={12} />
                    </a>.
                  </li>
                  <li>
                    Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Corruption Dodge. They automatically receive your IP address when this occurs.
                  </li>
                </ul>
              </section>

              <section className="legal-section">
                <h3>3. Log Files and Web Analytics</h3>
                <p>
                  Corruption Dodge follows standard industry procedures using log files. These files log visitors when they access websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and optionally the number of clicks. None of this data is linked to any personally identifiable information.
                </p>
              </section>

              <section className="legal-section">
                <h3>4. Game Data & Leaderboard Storage</h3>
                <p>
                  When you play Corruption Dodge and submit a score to the public leaderboard:
                </p>
                <ul>
                  <li>We collect your chosen Player Display Name, chosen Avatar character, and final Distance Score (in meters).</li>
                  <li>We do <strong>not</strong> collect real identities, emails, or passwords for gameplay.</li>
                  <li>Leaderboard records are securely processed via Supabase backend services and displayed publicly on the Leaderboard.</li>
                  <li>Your preferences (audio mute status and recent player nickname) are saved locally on your device via HTML5 LocalStorage.</li>
                </ul>
              </section>

              <section className="legal-section">
                <h3>5. GDPR & CCPA Rights</h3>
                <p>
                  Users possess the right to request access to any personal data held about them, request correction or erasure of their public leaderboard entries, and request that we cease processing specific data. If you wish to exercise any of these rights, please contact our administrative team.
                </p>
              </section>

              <section className="legal-section">
                <h3>6. Contact Us</h3>
                <p>
                  If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at: <a href="mailto:contact@corruptiondodge.lol">contact@corruptiondodge.lol</a>.
                </p>
              </section>
            </div>
          </div>
        )}

        {type === 'terms' && (
          <div className="legal-content">
            <div className="legal-header">
              <div className="badge-pill ph-badge">
                <FileText size={16} />
                <span>Terms & Rules</span>
              </div>
              <h2 id="legal-modal-title" className="legal-title">Terms of Service</h2>
              <p className="legal-date">Last Updated: October 2026</p>
            </div>

            <div className="legal-body-scroll">
              <section className="legal-section highlight-box">
                <div className="satire-alert">
                  <AlertTriangle size={18} />
                  <span><strong>Satirical Parody & Civic Art Notice</strong></span>
                </div>
                <p>
                  <strong>Corruption Dodge</strong> is an interactive work of political satire, civic gaming, and public interest social commentary. All characters, names, caricatures, and scenarios depicted in this game are works of parody and artistic expression. Any resemblance to real persons, living or deceased, is intended strictly for political satire, civic education, and freedom of expression under applicable constitutional protections and fair use doctrines.
                </p>
              </section>

              <section className="legal-section">
                <h3>1. Acceptance of Terms</h3>
                <p>
                  By accessing and playing Corruption Dodge at <a href="https://corruptiondodge.lol">https://corruptiondodge.lol</a>, you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
                </p>
              </section>

              <section className="legal-section">
                <h3>2. Fair Play & Leaderboard Conduct</h3>
                <p>
                  Our public leaderboard celebrates player skill and community fun. Players agree not to:
                </p>
                <ul>
                  <li>Use automated bots, scripts, or exploit network vulnerabilities to forge fake high scores.</li>
                  <li>Submit profane, abusive, harassing, or defamatory nicknames on the public leaderboard.</li>
                  <li>Disrupt or overload server infrastructure powering the game.</li>
                </ul>
                <p>We reserve the right to remove any fraudulent or offensive leaderboard submission without prior notice.</p>
              </section>

              <section className="legal-section">
                <h3>3. Intellectual Property</h3>
                <p>
                  Original game assets, sprites, game mechanics code, and sound compositions are the intellectual property of the Corruption Dodge team. You may freely share gameplay recordings, screenshots, and challenge links on social media for personal, educational, and commentary purposes.
                </p>
              </section>

              <section className="legal-section">
                <h3>4. Disclaimer of Warranty</h3>
                <p>
                  The game is provided on an "as is" and "as available" basis without warranties of any kind. We do not guarantee uninterrupted or error-free gameplay.
                </p>
              </section>

              <section className="legal-section">
                <h3>5. Contact Information</h3>
                <p>
                  Inquiries regarding these Terms should be sent to <a href="mailto:contact@corruptiondodge.lol">contact@corruptiondodge.lol</a>.
                </p>
              </section>
            </div>
          </div>
        )}

        {type === 'about' && (
          <div className="legal-content">
            <div className="legal-header">
              <div className="badge-pill ph-badge">
                <Info size={16} />
                <span>Editorial Mission</span>
              </div>
              <h2 id="legal-modal-title" className="legal-title">About Corruption Dodge</h2>
              <p className="legal-date">A Civic Awareness & Disaster Resilience Project</p>
            </div>

            <div className="legal-body-scroll">
              <section className="legal-section">
                <h3>Our Mission</h3>
                <p>
                  <strong>Corruption Dodge</strong> was created to combine fast-paced arcade gaming with meaningful civic awareness. In many developing nations—particularly in monsoon-prone archipelagos like the Philippines—millions of citizens face annual catastrophic flooding.
                </p>
                <p>
                  Investigative journalism and public audits repeatedly uncover substandard public works, blocked waterways, and misappropriated flood mitigation funds. We believe that gamifying these civic realities helps spark discussion, promotes vigilance against anomalous expenditures, and emphasizes the life-saving necessity of honest civil engineering.
                </p>
              </section>

              <section className="legal-section">
                <h3>Who We Are</h3>
                <p>
                  We are independent game developers, civic advocates, and web designers passionate about creating accessible browser games that educate, entertain, and inspire civic participation.
                </p>
              </section>

              <section className="legal-section">
                <h3>Contact & Feedback</h3>
                <p>
                  Got an idea for a new civic infrastructure stage? Want to report a bug or discuss partnerships?
                </p>
                <p>
                  Email us directly at: <a href="mailto:contact@corruptiondodge.lol"><Mail size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> contact@corruptiondodge.lol</a>
                </p>
              </section>
            </div>
          </div>
        )}

        <div className="modal-actions legal-actions">
          <button className="cute-btn primary-btn" onClick={handleClose}>
            <span>Understood & Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
