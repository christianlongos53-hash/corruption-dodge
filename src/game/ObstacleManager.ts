import { DevelopmentStage, GovernmentProject, MONEY_VALUES, Obstacle, ObstacleType, PROJECT_COST, STAGE_CONFIGS, WeatherType, getRoadBounds } from '../types/game';
import { audioSystem } from './AudioSystem';

const OBSTACLE_TYPES: ObstacleType[] = [
  'cash_stack',
  'bribe_envelope',
  'gold_briefcase',
  'pork_barrel'
];

export class ObstacleManager {
  public obstacles: Obstacle[] = [];
  public dodgedCount: number = 0;
  public budget: number = 0; // Public funds earned from dodged bribes
  public activeProject: GovernmentProject | null = null;
  public stage: DevelopmentStage = 'muddy_rural';

  private nextId: number = 1;
  private spawnTimer: number = 0;
  private dodgedObsIds: Set<number> = new Set();

  public reset() {
    this.obstacles = [];
    this.dodgedCount = 0;
    this.budget = 0;
    this.activeProject = null;
    this.stage = 'muddy_rural';
    this.nextId = 1;
    this.spawnTimer = 0.5;
    this.dodgedObsIds.clear();
  }

  public setStage(stage: DevelopmentStage) {
    this.stage = stage;
  }

  /**
   * Updates obstacles and government projects, moving from TOP to BOTTOM.
   */
  public update(
    dt: number,
    distance: number,
    canvasWidth: number,
    canvasHeight: number,
    playerY: number,
    weather: WeatherType = 'sunny',
    time: number = 0
  ) {
    const road = getRoadBounds(canvasWidth);

    // 1. Dynamic Speed & Spawn Frequency Calculation (Progression reduced to 50%)
    const currentSpeed = Math.min(800, 260 + distance * 0.175);
    const spawnInterval = Math.max(0.32, 1.15 - (distance / 2500) * 0.7);

    // 2. Obstacle Spawn Timer
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this.spawnTimer = spawnInterval + (Math.random() * 0.15 - 0.05);
      this.spawnObstacle(canvasWidth, canvasHeight, currentSpeed, distance);
    }

    // 3. Government Project Spawning (When budget milestone reached)
    this.checkProjectSpawn(canvasWidth, currentSpeed);

    // 4. Move and update Government Project (Moving from TOP to BOTTOM)
    if (this.activeProject) {
      this.activeProject.y += this.activeProject.speed * dt;
      this.activeProject.pulsePhase += dt * 4;

      // Road clamping
      const minProjX = road.left + this.activeProject.radius + 8;
      const maxProjX = road.right - this.activeProject.radius - 8;
      this.activeProject.x = Math.max(minProjX, Math.min(maxProjX, this.activeProject.x));

      // If player missed it, respawn only if player can still afford it (1 Billion)
      if (this.activeProject.y > canvasHeight + 120) {
        if (this.budget >= PROJECT_COST) {
          this.activeProject.y = -80;
          this.activeProject.x = road.left + road.roadWidth * (0.3 + Math.random() * 0.4);
        } else {
          this.activeProject = null;
        }
      }
    }

    // 5. Move and update existing obstacles (Moving from TOP to BOTTOM)
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.y += obs.speed * dt; // Moving DOWNWARDS
      obs.pulsePhase += dt * 4;

      // Apply Wind Sway during Windy and Stormy weather
      if (weather === 'windy') {
        const swaySpeed = 3.2;
        const swayAmp = 95;
        const sway = Math.sin(obs.y * 0.014 + time * swaySpeed + obs.swaySeed) * swayAmp;
        obs.x += sway * dt;
        obs.rotation += (sway / swayAmp) * 1.0 * dt;
      } else if (weather === 'stormy') {
        const stormSpeed = 5.0;
        const stormAmp = 155;
        const sway = (Math.sin(obs.y * 0.018 + time * stormSpeed + obs.swaySeed) +
                      Math.cos(time * 2.5 + obs.swaySeed) * 0.35) * stormAmp;
        obs.x += sway * dt;
        obs.rotation += (sway / stormAmp) * 1.8 * dt;
      } else {
        obs.rotation += obs.rotationSpeed * dt;
      }

      // STRICT ROAD CLAMPING
      const minX = road.left + obs.radius + 8;
      const maxX = road.right - obs.radius - 8;
      obs.x = Math.max(minX, Math.min(maxX, obs.x));

      // Check if safely dodged past player (moving downwards past playerY)
      if (obs.y > playerY + obs.radius && !this.dodgedObsIds.has(obs.id)) {
        this.dodgedObsIds.add(obs.id);
        this.dodgedCount++;

        // EARN DODGED MONEY: add to public budget and play coin chime!
        const earned = MONEY_VALUES[obs.type] || 1000;
        this.budget += earned;
        audioSystem.playCoin();
      }

      // Remove if past bottom of canvas
      if (obs.y > canvasHeight + obs.radius * 2) {
        this.dodgedObsIds.delete(obs.id);
        this.obstacles.splice(i, 1);
      }
    }
  }

  private checkProjectSpawn(canvasWidth: number, currentSpeed: number) {
    if (this.activeProject) return;

    // The country upgrades will just appear if the player already can afford it (1 Billion).
    if (this.budget >= PROJECT_COST) {
      const currentConfig = STAGE_CONFIGS[this.stage];
      const road = getRoadBounds(canvasWidth);
      const nextStage = this.getNextStage(this.stage);

      this.activeProject = {
        id: this.nextId++,
        x: road.left + road.roadWidth * (0.35 + Math.random() * 0.3),
        y: -70,
        radius: 38,
        name: currentConfig.projectName,
        description: currentConfig.projectDescription,
        stageTarget: nextStage,
        cost: PROJECT_COST,
        speed: currentSpeed * 0.65, // Comfortable speed for player to intercept
        pulsePhase: 0
      };
    }
  }

  private getNextStage(stage: DevelopmentStage): DevelopmentStage {
    if (stage === 'muddy_rural') return 'provincial_paved';
    if (stage === 'provincial_paved') return 'national_highway';
    if (stage === 'national_highway') return 'urban_metropolis';
    return 'urban_metropolis';
  }

  private getObstacleDimensions(type: ObstacleType) {
    switch (type) {
      case 'cash_stack': // ₱500 - Smallest
        return { radius: 22, scale: 0.88 };
      case 'bribe_envelope': // ₱1,000 - Medium
        return { radius: 28, scale: 1.12 };
      case 'gold_briefcase': // ₱1,500 - Large
        return { radius: 36, scale: 1.45 };
      case 'pork_barrel': // ₱2,000 - Largest
        return { radius: 44, scale: 1.75 };
    }
  }

  private spawnObstacle(canvasWidth: number, _canvasHeight: number, baseSpeed: number, distance: number) {
    const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
    const { radius, scale } = this.getObstacleDimensions(type);

    // Strict Road Placement
    const road = getRoadBounds(canvasWidth);
    const minX = road.left + radius + 10;
    const maxX = road.right - radius - 10;
    const playableWidth = Math.max(20, maxX - minX);

    const x = minX + Math.random() * playableWidth;
    const speedVariation = 0.88 + Math.random() * 0.28;
    const speed = baseSpeed * speedVariation;
    const rotationSpeed = (Math.random() - 0.5) * 1.5;

    // Spawning at the TOP of the screen moving downwards
    this.obstacles.push({
      id: this.nextId++,
      x,
      y: -radius * 2,
      radius,
      type,
      speed,
      rotation: (Math.random() - 0.5) * 0.4,
      rotationSpeed,
      pulsePhase: Math.random() * Math.PI * 2,
      scale,
      swaySeed: Math.random() * 100
    });

    // At higher distances, spawn staggered pair strictly on opposite lane
    if (distance > 350 && Math.random() < 0.28) {
      const secondType = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
      const { radius: secondRadius, scale: secondScale } = this.getObstacleDimensions(secondType);
      const midRoad = road.left + road.roadWidth / 2;

      const secondX = x > midRoad
        ? minX + Math.random() * (playableWidth * 0.42)
        : maxX - Math.random() * (playableWidth * 0.42);

      this.obstacles.push({
        id: this.nextId++,
        x: secondX,
        y: -secondRadius * 3.5, // Staggered higher above
        radius: secondRadius,
        type: secondType,
        speed: speed * 0.95,
        rotation: (Math.random() - 0.5) * 0.4,
        rotationSpeed: (Math.random() - 0.5) * 1.2,
        pulsePhase: Math.random() * Math.PI * 2,
        scale: secondScale,
        swaySeed: Math.random() * 100
      });
    }
  }
}
