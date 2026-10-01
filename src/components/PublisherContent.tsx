import React from 'react';
import { 
  ShieldCheck, 
  Gamepad2, 
  Users, 
  Droplets, 
  HelpCircle, 
  AlertTriangle, 
  ChevronDown
} from 'lucide-react';
import { CHARACTER_PROFILES, getChibiAvatarDataUrl } from '../game/sprites/ChibiSprites';
import { LegalModalType } from './LegalModals';

interface PublisherContentProps {
  onOpenLegal: (type: LegalModalType) => void;
  onOpenLeaderboard: () => void;
  onScrollToGame: () => void;
}

export const PublisherContent: React.FC<PublisherContentProps> = ({
  onOpenLegal,
  onOpenLeaderboard,
  onScrollToGame
}) => {
  return (
    <article className="publisher-content-container">
      {/* Quick Navigation Anchor Bar */}
      <nav className="publisher-nav" aria-label="Article sections">
        <div className="publisher-nav-inner">
          <span className="publisher-nav-label">Jump to Section:</span>
          <a href="#about-mission" className="publisher-nav-link">About Mission</a>
          <a href="#how-to-play" className="publisher-nav-link">How to Play & Guide</a>
          <a href="#character-dossiers" className="publisher-nav-link">Character Dossiers</a>
          <a href="#flood-primer" className="publisher-nav-link">Flood Defense Primer</a>
          <a href="#game-faq" className="publisher-nav-link">FAQ</a>
          <button 
            type="button" 
            className="publisher-nav-btn"
            onClick={() => onOpenLegal('privacy')}
          >
            Privacy Policy
          </button>
        </div>
      </nav>

      {/* Section 1: The Mission & Civic Advocacy */}
      <section id="about-mission" className="pub-section">
        <div className="pub-section-header">
          <div className="pub-badge">
            <ShieldCheck size={16} />
            <span>Civic Gaming & Satire</span>
          </div>
          <h2 className="pub-title">The Mission: Gamifying Civic Awareness & Flood Disaster Resilience</h2>
        </div>

        <div className="pub-text-block">
          <p className="pub-lead">
            <strong>Corruption Dodge</strong> is a satirical civic endless runner created to address one of the most persistent socio-economic and public health crises in the Philippines: recurrent catastrophic flooding driven by anomalous infrastructure spending and substandard public works.
          </p>
          <p>
            Every monsoon season (<em>Habagat</em>) and tropical cyclone, thousands of Filipino communities in Metro Manila, Central Luzon, Bicol, and across the archipelago are submerged under hazardous floodwaters. While billions of pesos in taxpayers' hard-earned funds are allocated annually for flood mitigation dikes, river dredging, and stormwater pumping stations, investigative reporting and government audits routinely uncover bloated kickbacks, ghost projects, and uncompleted floodgates.
          </p>
          
          <div className="pub-highlight-card">
            <div className="pub-highlight-icon">💡</div>
            <div className="pub-highlight-content">
              <h4>Why Gamify Anti-Corruption?</h4>
              <p>
                Civic education often suffers from bureaucratic language that fails to engage the public. By translating the complex struggle of public fund management into an intuitive, high-stakes dodge mechanic, <strong>Corruption Dodge</strong> empowers players of all ages to recognize how corrupt kickbacks directly escalate disaster risks—and why transparent engineering saves lives.
              </p>
            </div>
          </div>

          <div className="pub-satire-disclaimer">
            <AlertTriangle size={18} className="satire-icon" />
            <p>
              <strong>Satire & Fair Use Disclaimer:</strong> Corruption Dodge is a parody and civic awareness initiative protected under constitutional guarantees of freedom of expression and fair use. All avatars, political caricatures, and names are works of artistic satire designed for civic commentary and disaster preparedness education.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: How to Play & Comprehensive Game Mechanics */}
      <section id="how-to-play" className="pub-section">
        <div className="pub-section-header">
          <div className="pub-badge">
            <Gamepad2 size={16} />
            <span>Player's Manual</span>
          </div>
          <h2 className="pub-title">Complete Game Guide: Controls, Obstacles & Stages</h2>
        </div>

        <div className="pub-text-block">
          <p>
            Your objective is simple yet demanding: sprint through challenging roads, dodge corrupt obstacles that threaten civic integrity, collect legitimate public budget allocations, and build vital flood control projects before rising floodwaters drown your community!
          </p>

          <h3 className="pub-subtitle">1. Master the Controls</h3>
          <div className="controls-grid">
            <div className="control-card">
              <span className="control-icon">⌨️</span>
              <h4>Desktop Controls</h4>
              <p>Use <strong>Left / Right Arrow Keys</strong> or <strong>A / D Keys</strong> to switch lanes quickly. You can also click and drag your mouse across the road to guide your avatar.</p>
            </div>
            <div className="control-card">
              <span className="control-icon">📱</span>
              <h4>Mobile & Touch Controls</h4>
              <p>Touch and drag your finger smoothly across the screen horizontally. Your chibi character follows your finger instantly with responsive zero-lag physics.</p>
            </div>
          </div>

          <h3 className="pub-subtitle">2. Obstacle Threat Matrix</h3>
          <p>Every obstacle represents an illicit siphon on public treasury. Touching an obstacle damages your character and causes floodwaters to surge by 10%:</p>
          
          <div className="table-responsive">
            <table className="pub-table">
              <thead>
                <tr>
                  <th>Obstacle</th>
                  <th>Symbolism</th>
                  <th>Impact & Behavior</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>✉️ Bribe Envelopes</strong></td>
                  <td>Under-the-table grease money in government permits.</td>
                  <td>Fast, sleek, and frequently spawns in succession to test reaction speeds.</td>
                </tr>
                <tr>
                  <td><strong>💵 Cash Stacks</strong></td>
                  <td>Misallocated discretionary funds and untracked cash disbursements.</td>
                  <td>Medium-sized bundles that drift slightly across roadway lanes.</td>
                </tr>
                <tr>
                  <td><strong>💼 Gold Kickback Briefcases</strong></td>
                  <td>High-level procurement kickbacks and contract rigging.</td>
                  <td>Bulky, highly visible obstacles with wide collision hitboxes.</td>
                </tr>
                <tr>
                  <td><strong>🛢️ Bloated Pork Barrels</strong></td>
                  <td>Unscrutinized legislative pork barrels and substandard ghost projects.</td>
                  <td>Heavy rolling barrels that occupy major portions of the highway.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="pub-subtitle">3. Infrastructure Milestones & Stages</h3>
          <p>
            As you cover distance and collect civic funding, the game dynamically upgrades your environment through four distinct developmental stages:
          </p>
          <div className="stages-flow">
            <div className="stage-step">
              <div className="stage-step-num">Stage 1</div>
              <h4>🌾 Muddy Countryside</h4>
              <p>Unpaved rural roads vulnerable to quick flash floods. Pave with concrete to build the <em>Farm-to-Market Road</em>.</p>
            </div>
            <div className="stage-step">
              <div className="stage-step-num">Stage 2</div>
              <h4>🛤️ Provincial Paved Road</h4>
              <p>Two-lane highway with initial drainage culverts. Complete the drainage project to clear clogged channels.</p>
            </div>
            <div className="stage-step">
              <div className="stage-step-num">Stage 3</div>
              <h4>🛣️ National Highway</h4>
              <p>Wide four-lane arterial avenue. Fund heavy reinforced concrete dikes along surrounding riverbanks.</p>
            </div>
            <div className="stage-step">
              <div className="stage-step-num">Stage 4</div>
              <h4>🏙️ Urban Metropolis</h4>
              <p>High-density cityscape. Install automated stormwater mega pumping stations and deep retention floodgates!</p>
            </div>
          </div>

          <div className="pub-action-callout">
            <p>Ready to put your reflexes to the test and defend the national budget?</p>
            <button type="button" className="cute-btn primary-btn" onClick={onScrollToGame}>
              <span>Play Corruption Dodge Now!</span>
            </button>
          </div>
        </div>
      </section>

      {/* Section 3: Character Dossiers & Satirical Lore */}
      <section id="character-dossiers" className="pub-section">
        <div className="pub-section-header">
          <div className="pub-badge">
            <Users size={16} />
            <span>Civic Avatars</span>
          </div>
          <h2 className="pub-title">Character Dossiers: Parody, Leadership & The Citizen</h2>
        </div>

        <div className="pub-text-block">
          <p>
            Players can choose from four distinct avatars representing different roles in the nation's governance and civic sphere:
          </p>

          <div className="characters-editorial-grid">
            {/* Juan */}
            <div className="char-editorial-card">
              <div className="char-editorial-avatar" style={{ backgroundColor: CHARACTER_PROFILES.juan.secondaryColor }}>
                <img src={getChibiAvatarDataUrl('juan', 80)} alt="Juan - Citizen" />
              </div>
              <div className="char-editorial-info">
                <h3>Juan</h3>
                <span className="char-editorial-role role-juan">Citizen (Default Dodger)</span>
                <p>
                  The resilient, everyday Filipino taxpayer. Juan navigates severe commute delays, waterlogged alleys, and rising inflation with humor and indomitable courage. Representing honest civic virtue, Juan relies purely on vigilance and agile footwork to steer clear of dirty kickbacks.
                </p>
              </div>
            </div>

            {/* BingBong */}
            <div className="char-editorial-card">
              <div className="char-editorial-avatar" style={{ backgroundColor: CHARACTER_PROFILES.vong.secondaryColor }}>
                <img src={getChibiAvatarDataUrl('vong', 80)} alt="BingBong - Red President" />
              </div>
              <div className="char-editorial-info">
                <h3>BingBong</h3>
                <span className="char-editorial-role role-vong">Red President</span>
                <p>
                  The charismatic executive with a signature red jacket and swept-back action hairstyle. BingBong dashes ahead with grand slogans, promises of national modernization, and high-profile diplomatic summits, challenging players to balance bold momentum with disaster vigilance.
                </p>
              </div>
            </div>

            {/* Sharah */}
            <div className="char-editorial-card">
              <div className="char-editorial-avatar" style={{ backgroundColor: CHARACTER_PROFILES.sharah.secondaryColor }}>
                <img src={getChibiAvatarDataUrl('sharah', 80)} alt="Sharah - Green Vice President" />
              </div>
              <div className="char-editorial-info">
                <h3>Sharah</h3>
                <span className="char-editorial-role role-sharah">Green Vice President</span>
                <p>
                  The stern, security-focused leader sporting a crisp green blouse and neat bob hairstyle. Sharah maneuvers with disciplined precision, asserting order over chaotic situations while calling for robust institutional security against corruption.
                </p>
              </div>
            </div>

            {/* Neli */}
            <div className="char-editorial-card">
              <div className="char-editorial-avatar" style={{ backgroundColor: CHARACTER_PROFILES.neli.secondaryColor }}>
                <img src={getChibiAvatarDataUrl('neli', 80)} alt="Neli - Pink Mayor" />
              </div>
              <div className="char-editorial-info">
                <h3>Neli</h3>
                <span className="char-editorial-role role-neli">Pink Mayor</span>
                <p>
                  The grassroots reformer wearing vibrant pink with styled bangs. Renowned for volunteer mobilization, transparent village audits, and swift emergency relief operations, Neli inspires communities to work collaboratively during flood disasters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Flood Infrastructure & Civic Engineering Primer */}
      <section id="flood-primer" className="pub-section">
        <div className="pub-section-header">
          <div className="pub-badge">
            <Droplets size={16} />
            <span>Civic Engineering</span>
          </div>
          <h2 className="pub-title">Philippine Flood Infrastructure: Why Honest Engineering Saves Lives</h2>
        </div>

        <div className="pub-text-block">
          <p className="pub-lead">
            Floods in tropical river basins are a hydrologic reality, but their catastrophic human and economic toll is largely preventable through scientifically sound, uncompromised civil engineering.
          </p>

          <div className="infra-grid">
            <div className="infra-card">
              <div className="infra-icon">🌊</div>
              <h4>1. Reinforced River Dikes & Spillways</h4>
              <p>
                Riverbanks along major basins (such as the Marikina, Cagayan, and Pampanga rivers) require concrete revetments and controlled spillways to channel excess stormwater safely into bays and oceans without breaching densely populated residential settlements.
              </p>
            </div>

            <div className="infra-card">
              <div className="infra-icon">⚙️</div>
              <h4>2. Automated High-Capacity Pumping Stations</h4>
              <p>
                Low-lying urban areas located below sea level during high tide rely entirely on continuous Archimedes-screw and submersible centrifugal pumps. Keeping fuel budgets and maintenance schedules uncorrupted is the single difference between dry homes and submerged neighborhoods.
              </p>
            </div>

            <div className="infra-card">
              <div className="infra-icon">🏞️</div>
              <h4>3. Stormwater Retention Basins</h4>
              <p>
                Upstream retention ponds temporarily capture sudden cloudburst runoff, slowly releasing water after river crests have subsided. Eliminating ghost projects ensures that these essential earthworks are actually excavated to spec.
              </p>
            </div>

            <div className="infra-card">
              <div className="infra-icon">🌱</div>
              <h4>4. Mangrove Greenbelts & Watershed Protection</h4>
              <p>
                Nature-based solutions work in harmony with concrete. Reforestation of the Sierra Madre mountain ranges and coastal mangrove greenbelts significantly slows peak flow velocities and stabilizes riverbank erosion.
              </p>
            </div>
          </div>

          <div className="pub-audit-box">
            <h4>The Role of the Citizen in Public Audits</h4>
            <p>
              Under the Philippine Government Auditing Code and Freedom of Information portals, citizens have the constitutional right to inspect local government project status boards, verify contractor compliance, and flag unfinished infrastructure. Civic transparency turns public funds into tangible community protection.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Frequently Asked Questions (FAQ) */}
      <section id="game-faq" className="pub-section">
        <div className="pub-section-header">
          <div className="pub-badge">
            <HelpCircle size={16} />
            <span>Questions & Answers</span>
          </div>
          <h2 className="pub-title">Frequently Asked Questions (FAQ)</h2>
        </div>

        <div className="pub-faq-list">
          <details className="pub-faq-item" name="faq-group">
            <summary className="pub-faq-question">
              <span>Is Corruption Dodge completely free to play?</span>
              <ChevronDown size={18} className="faq-chevron" />
            </summary>
            <div className="pub-faq-answer">
              <p>
                Yes! <strong>Corruption Dodge</strong> is 100% free to play directly in your web browser on desktop, tablet, and mobile devices. No app installation, user registration, or paid microtransactions are ever required.
              </p>
            </div>
          </details>

          <details className="pub-faq-item" name="faq-group">
            <summary className="pub-faq-question">
              <span>How does the Flood System work in the game?</span>
              <ChevronDown size={18} className="faq-chevron" />
            </summary>
            <div className="pub-faq-answer">
              <p>
                Whenever your runner collides with an illicit obstacle (such as a bribe envelope or pork barrel), you take corruption damage and floodwaters rise by 10%. If you sustain 10 hits (reaching 100% flood level), the murky floodwaters completely engulf the street and the game ends. However, touching public works projects and paving roads helps you stay ahead of the rising tide!
              </p>
            </div>
          </details>

          <details className="pub-faq-item" name="faq-group">
            <summary className="pub-faq-question">
              <span>How is score calculated and verified on the Leaderboard?</span>
              <ChevronDown size={18} className="faq-chevron" />
            </summary>
            <div className="pub-faq-answer">
              <p>
                Your score reflects the total distance (in meters and kilometers) that your avatar successfully dodged through. At the end of every round, your score is automatically recorded to our high-performance Top 1,000 public leaderboard. You can filter and view the total kilometers conquered by each avatar in the Leaderboard modal!
              </p>
            </div>
          </details>

          <details className="pub-faq-item" name="faq-group">
            <summary className="pub-faq-question">
              <span>How do I challenge a friend to beat my distance record?</span>
              <ChevronDown size={18} className="faq-chevron" />
            </summary>
            <div className="pub-faq-answer">
              <p>
                On the Game Over screen, click the <strong>Copy Link</strong> or social share buttons (Facebook, X, WhatsApp). It generates a custom challenge URL containing your nickname, avatar, and record score. When your friend opens your link, the game displays a special challenge banner daring them to outrun your record!
              </p>
            </div>
          </details>

          <details className="pub-faq-item" name="faq-group">
            <summary className="pub-faq-question">
              <span>How does Google AdSense work on Corruption Dodge?</span>
              <ChevronDown size={18} className="faq-chevron" />
            </summary>
            <div className="pub-faq-answer">
              <p>
                We use Google AdSense to serve non-intrusive banner advertisements along the gutters of the screen. Revenue generated helps offset web hosting costs and backend server fees for maintaining the live global leaderboard. Third-party vendors like Google use cookies (such as the DART cookie) to deliver relevant ads. For details on how to manage or opt out of personalized cookies, please review our <button type="button" className="link-inline-btn" onClick={() => onOpenLegal('privacy')}>Privacy Policy</button>.
              </p>
            </div>
          </details>

          <details className="pub-faq-item" name="faq-group">
            <summary className="pub-faq-question">
              <span>Is my personal data or gameplay tracked?</span>
              <ChevronDown size={18} className="faq-chevron" />
            </summary>
            <div className="pub-faq-answer">
              <p>
                We do not collect sensitive personal identities, email addresses, or phone numbers. Only your self-selected display nickname, avatar selection, and distance score are stored in our secure database. Gameplay sound settings and previous nicknames are saved strictly on your local browser via LocalStorage.
              </p>
            </div>
          </details>

          <details className="pub-faq-item" name="faq-group">
            <summary className="pub-faq-question">
              <span>Who created this project and how can I contact the creators?</span>
              <ChevronDown size={18} className="faq-chevron" />
            </summary>
            <div className="pub-faq-answer">
              <p>
                Corruption Dodge was built by independent game developers and civic technology enthusiasts. For feedback, educational inquiries, or suggestions, you can email us directly at <a href="mailto:contact@corruptiondodge.lol">contact@corruptiondodge.lol</a>.
              </p>
            </div>
          </details>
        </div>
      </section>

      {/* Publisher Portal Footer */}
      <footer className="publisher-footer">
        <div className="footer-top-row">
          <div className="footer-brand">
            <span className="footer-logo">🏃🇵🇭 Corruption Dodge</span>
            <p className="footer-tagline">
              Endless civic dodge game & flood defense awareness platform.
            </p>
          </div>

          <div className="footer-links-group">
            <span className="footer-links-title">Quick Actions</span>
            <button type="button" className="footer-link-btn" onClick={onScrollToGame}>Play Game</button>
            <button type="button" className="footer-link-btn" onClick={onOpenLeaderboard}>Global Leaderboard</button>
          </div>

          <div className="footer-links-group">
            <span className="footer-links-title">Legal & Trust</span>
            <button type="button" className="footer-link-btn" onClick={() => onOpenLegal('privacy')}>Privacy Policy</button>
            <button type="button" className="footer-link-btn" onClick={() => onOpenLegal('terms')}>Terms of Service</button>
            <button type="button" className="footer-link-btn" onClick={() => onOpenLegal('about')}>About Us & Contact</button>
          </div>
        </div>

        <div className="footer-bottom-row">
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} Corruption Dodge (<a href="https://corruptiondodge.lol">corruptiondodge.lol</a>). All rights reserved.
          </p>
          <p className="footer-disclaimer-sub">
            A satirical civic awareness initiative. All characters are parodies. Dedicated to community disaster preparedness and public works transparency.
          </p>
        </div>
      </footer>
    </article>
  );
};
