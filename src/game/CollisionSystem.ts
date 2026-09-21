import { GovernmentProject, Obstacle, PlayerPosition } from '../types/game';
import { audioSystem } from './AudioSystem';

export class CollisionSystem {
  private nearMissedIds: Set<number> = new Set();

  public reset() {
    this.nearMissedIds.clear();
  }

  /**
   * Checks collision between player circular hitbox and obstacles.
   * Returns the collided Obstacle if a collision occurs, or null otherwise.
   */
  public checkCollisions(player: PlayerPosition, obstacles: Obstacle[]): Obstacle | null {
    // Player effective circular hitbox (slightly forgiving for fun gameplay)
    const playerHitboxRadius = player.radius * 0.72;

    for (const obs of obstacles) {
      const obsHitboxRadius = obs.radius * 0.72;
      const dx = player.x - obs.x;
      const dy = player.y - obs.y;
      const distSq = dx * dx + dy * dy;
      const collisionDist = playerHitboxRadius + obsHitboxRadius;

      // 1. Direct Collision
      if (distSq <= collisionDist * collisionDist) {
        return obs;
      }

      // 2. Near-miss dodge sound effect
      const nearMissDist = collisionDist * 1.6;
      if (distSq <= nearMissDist * nearMissDist && !this.nearMissedIds.has(obs.id)) {
        this.nearMissedIds.add(obs.id);
        audioSystem.playDodge();
      }
    }

    return null;
  }

  /**
   * Checks if player touched the Government Project to activate it.
   * Uses a generous, friendly hitbox so players can easily intercept and activate.
   */
  public checkProjectCollision(player: PlayerPosition, project: GovernmentProject | null): boolean {
    if (!project) return false;

    const dx = player.x - project.x;
    const dy = player.y - project.y;
    const distSq = dx * dx + dy * dy;
    const touchDist = player.radius + project.radius + 8;

    return distSq <= touchDist * touchDist;
  }
}
