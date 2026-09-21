import { CharacterId, LeaderboardEntry } from '../types/game';

const STORAGE_KEY = 'country_vs_corruption_leaderboard';
const MAX_LEADERBOARD_ENTRIES = 1000;

export interface BackendConfig {
  apiUrl?: string;
  firebaseProjectId?: string;
}

class LeaderboardService {
  private backendConfig: BackendConfig = {};

  public configure(config: BackendConfig) {
    this.backendConfig = config;
  }

  /**
   * Retrieves the Top 1,000 leaderboard entries sorted descending by score.
   * Does NOT include dummy or seed players.
   */
  public async getTop1000(): Promise<LeaderboardEntry[]> {
    // If external REST API is configured, try fetching from it
    if (this.backendConfig.apiUrl) {
      try {
        const res = await fetch(`${this.backendConfig.apiUrl}/leaderboard?limit=1000`);
        if (res.ok) {
          const data: LeaderboardEntry[] = await res.json();
          return this.rankEntries(data);
        }
      } catch (err) {
        console.warn('Failed to fetch from remote API, falling back to local storage:', err);
      }
    }

    return this.getLocalEntries();
  }

  /**
   * Submits a new score to the leaderboard. Keeps only top 1,000 entries.
   */
  public async submitScore(
    name: string,
    avatar: CharacterId,
    score: number
  ): Promise<{ rank: number; entries: LeaderboardEntry[] }> {
    const newEntry: LeaderboardEntry = {
      id: `score_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name: name.trim() || 'Hero',
      avatar,
      score,
      timestamp: Date.now()
    };

    // If external REST API is configured, sync to it
    if (this.backendConfig.apiUrl) {
      try {
        await fetch(`${this.backendConfig.apiUrl}/leaderboard`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEntry)
        });
      } catch (err) {
        console.warn('Remote sync failed, saving locally:', err);
      }
    }

    const currentEntries = this.getLocalEntries();
    currentEntries.push(newEntry);

    // Sort descending by score, tie-break with older timestamp
    currentEntries.sort((a, b) => b.score - a.score || a.timestamp - b.timestamp);

    // Keep only top 1,000
    const top1000 = currentEntries.slice(0, MAX_LEADERBOARD_ENTRIES);
    const ranked = this.rankEntries(top1000);

    // Persist to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ranked));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }

    const assignedRank = ranked.findIndex(e => e.id === newEntry.id) + 1;
    return { rank: assignedRank > 0 ? assignedRank : top1000.length, entries: ranked };
  }

  /**
   * Calculates what rank a given score would achieve.
   */
  public getUserRank(score: number): number {
    const entries = this.getLocalEntries();
    if (entries.length === 0) return 1;
    const rank = entries.findIndex(e => score >= e.score);
    return rank === -1 ? Math.min(entries.length + 1, MAX_LEADERBOARD_ENTRIES) : rank + 1;
  }

  private getLocalEntries(): LeaderboardEntry[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: LeaderboardEntry[] = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Filter out any leftover dummy seed entries from previous runs
          const realEntries = parsed.filter(e => e.id && !e.id.startsWith('seed_'));
          if (realEntries.length !== parsed.length) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(realEntries));
          }
          return this.rankEntries(realEntries);
        }
      }
    } catch (e) {
      console.warn('Error reading leaderboard from localStorage:', e);
    }

    return [];
  }

  private rankEntries(entries: LeaderboardEntry[]): LeaderboardEntry[] {
    return entries.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
  }
}

export const leaderboardService = new LeaderboardService();
