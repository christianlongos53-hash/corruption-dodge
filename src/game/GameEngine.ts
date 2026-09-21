import { CharacterId, DevelopmentStage, GameState, GameStats, PROJECT_COST, formatPeso, getWeatherForDistance } from '../types/game';
import { CanvasRenderer } from './CanvasRenderer';
import { InputController } from './InputController';
import { ObstacleManager } from './ObstacleManager';
import { CollisionSystem } from './CollisionSystem';
import { FloodAnimation } from './FloodAnimation';
import { audioSystem } from './AudioSystem';

export interface GameEngineCallbacks {
  onStatsUpdate: (stats: GameStats) => void;
  onGameOver: (finalScore: number) => void;
  onStateChange: (state: GameState) => void;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private renderer: CanvasRenderer;
  private input: InputController;
  private obstacleManager: ObstacleManager;
  private collisionSystem: CollisionSystem;
  private floodAnimation: FloodAnimation;

  private state: GameState = 'START';
  private activeCharacter: CharacterId = 'bico';
  private playerName: string = 'Hero';

  private distance: number = 0;
  private baseSpeed: number = 300; // px/s
  private currentSpeed: number = 300;

  private hits: number = 0;
  private maxHits: number = 10;
  private invulnerableTimer: number = 0;

  private stage: DevelopmentStage = 'muddy_rural';
  private projectNotification: string = '';
  private notificationTimer: number = 0;

  private animFrameId: number | null = null;
  private lastTime: number = 0;
  private totalTime: number = 0;

  private callbacks: GameEngineCallbacks;

  constructor(canvas: HTMLCanvasElement, callbacks: GameEngineCallbacks) {
    this.canvas = canvas;
    this.callbacks = callbacks;

    this.renderer = new CanvasRenderer(canvas);
    this.input = new InputController();
    this.obstacleManager = new ObstacleManager();
    this.collisionSystem = new CollisionSystem();
    this.floodAnimation = new FloodAnimation();

    this.input.attach(canvas);
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  public handleResize = () => {
    const parent = this.canvas.parentElement;
    const width = parent ? parent.clientWidth : window.innerWidth;
    const height = parent ? parent.clientHeight : window.innerHeight;
    this.renderer.resize(width, height);
  };

  public setCharacter(id: CharacterId) {
    this.activeCharacter = id;
  }

  public setPlayerName(name: string) {
    this.playerName = name.trim() || 'Hero';
  }

  public startGame() {
    this.state = 'PLAYING';
    this.distance = 0;
    this.hits = 0;
    this.invulnerableTimer = 0;
    this.currentSpeed = this.baseSpeed;
    this.stage = 'muddy_rural';
    this.projectNotification = '';
    this.notificationTimer = 0;

    this.obstacleManager.reset();
    this.collisionSystem.reset();
    this.floodAnimation.reset();

    // Position player near the bottom of the road for top-to-bottom gameplay
    const rect = this.canvas.getBoundingClientRect();
    this.input.reset(rect.width / 2, rect.height * 0.75);

    audioSystem.playStart();
    this.callbacks.onStateChange('PLAYING');

    if (!this.animFrameId) {
      this.lastTime = performance.now();
      this.loop(this.lastTime);
    }
  }

  public restartGame() {
    this.startGame();
  }

  public startLoop() {
    if (!this.animFrameId) {
      this.lastTime = performance.now();
      this.animFrameId = requestAnimationFrame(this.loop);
    }
  }

  public stopLoop() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  public destroy() {
    this.stopLoop();
    this.input.detach();
    window.removeEventListener('resize', this.handleResize);
  }

  private loop = (timestamp: number) => {
    const rawDt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;
    const dt = Math.min(rawDt, 0.05); // Cap at 50ms
    this.totalTime += dt;

    const rect = this.canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const expectedW = Math.round(width * this.renderer.getDpr());
    const expectedH = Math.round(height * this.renderer.getDpr());
    if (this.canvas.width !== expectedW || this.canvas.height !== expectedH) {
      this.renderer.resize(width, height);
    }

    const currentWeather = getWeatherForDistance(this.distance);

    if (this.state === 'START') {
      this.input.update(dt);
      this.currentSpeed = 180;
    } else if (this.state === 'PLAYING') {
      this.updatePlaying(dt, width, height, currentWeather);
    } else if (this.state === 'GAMEOVER_FLOOD' || this.state === 'GAMEOVER_MODAL') {
      this.updateFlood(dt, width, height);
    }

    // Render phase
    this.renderer.render(
      width,
      height,
      dt,
      this.currentSpeed,
      this.totalTime,
      this.input.player,
      this.activeCharacter,
      this.obstacleManager.obstacles,
      this.floodAnimation,
      this.state === 'GAMEOVER_FLOOD' || this.state === 'GAMEOVER_MODAL',
      currentWeather,
      this.invulnerableTimer > 0,
      this.stage,
      this.obstacleManager.activeProject
    );

    this.animFrameId = requestAnimationFrame(this.loop);
  };

  private updatePlaying(dt: number, width: number, height: number, weather: ReturnType<typeof getWeatherForDistance>) {
    // 1. Update pointer, keyboard, and avatar position
    this.input.update(dt);

    // 2. Invulnerability grace timer countdown
    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer -= dt;
    }

    // Notification toast timer
    if (this.notificationTimer > 0) {
      this.notificationTimer -= dt;
    }

    // 3. Dynamic speed & distance scaling (Reduced progression to 50%)
    this.distance += (this.currentSpeed * dt) / 15;
    this.currentSpeed = Math.min(800, this.baseSpeed + this.distance * 0.225);

    // 4. Update obstacles and government projects (Moving TOP to BOTTOM)
    this.obstacleManager.update(dt, this.distance, width, height, this.input.player.y, weather, this.totalTime);

    // 5. Update flood animation level and elements during gameplay
    this.floodAnimation.update(dt, width, height);

    // 6. Check Government Project Interaction (TOUCH TO ACTIVATE!)
    if (this.obstacleManager.activeProject) {
      const touchedProject = this.collisionSystem.checkProjectCollision(
        this.input.player,
        this.obstacleManager.activeProject
      );

      if (touchedProject) {
        const proj = this.obstacleManager.activeProject;

        // Deduct project cost (1 Billion) from earned money
        this.obstacleManager.budget = Math.max(0, this.obstacleManager.budget - proj.cost);

        this.stage = proj.stageTarget;
        this.obstacleManager.setStage(this.stage);
        this.obstacleManager.activeProject = null;

        // Triumphant fanfare
        audioSystem.playProjectFanfare();

        // Bonus: reduce flood level by 1 step (10%)!
        if (this.hits > 0) {
          this.hits -= 1;
          const newLevel = this.hits / this.maxHits;
          this.floodAnimation.setTargetLevel(newLevel, width, height);
        }

        this.projectNotification = `🎉 ${proj.name} ACTIVATED! (-${formatPeso(proj.cost)}) Flood Reduced!`;
        this.notificationTimer = 3.5;
      }
    }

    // 7. Collision Detection with Corruption Obstacles (Active when not invulnerable)
    if (this.invulnerableTimer <= 0) {
      const hitObstacle = this.collisionSystem.checkCollisions(
        this.input.player,
        this.obstacleManager.obstacles
      );

      if (hitObstacle) {
        this.hits += 1;
        this.invulnerableTimer = 1.2; // 1.2s invulnerability grace with flashing avatar

        // Remove the collided obstacle so it doesn't collide again
        const idx = this.obstacleManager.obstacles.indexOf(hitObstacle);
        if (idx !== -1) {
          this.obstacleManager.obstacles.splice(idx, 1);
        }

        // Set target flood level: 1/10 (10%) per touch (Flooding from TOP of screen downwards)
        const targetLevel = Math.min(1.0, this.hits / this.maxHits);
        this.floodAnimation.setTargetLevel(targetLevel, width, height);

        if (this.hits >= this.maxHits) {
          // 10th hit: Submerge entire screen and trigger Game Over flood sequence!
          this.state = 'GAMEOVER_FLOOD';
          this.floodAnimation.start(width, height);
          this.callbacks.onStateChange('GAMEOVER_FLOOD');
        } else {
          audioSystem.playCrash();
        }
      }
    }

    // Emit live stats to HUD including hits, stage, budget, and live weather
    this.callbacks.onStatsUpdate({
      distance: Math.floor(this.distance),
      speed: Math.round(this.currentSpeed),
      dodgedCount: this.obstacleManager.dodgedCount,
      activeCharacter: this.activeCharacter,
      playerName: this.playerName,
      weather,
      hits: this.hits,
      maxHits: this.maxHits,
      budget: this.obstacleManager.budget,
      stage: this.stage,
      nextProjectBudget: PROJECT_COST,
      activeProjectName: this.obstacleManager.activeProject?.name,
      projectNotification: this.notificationTimer > 0 ? this.projectNotification : undefined
    });
  }

  private updateFlood(dt: number, width: number, height: number) {
    const isFloodComplete = this.floodAnimation.update(dt, width, height);
    if (isFloodComplete && this.state === 'GAMEOVER_FLOOD') {
      this.state = 'GAMEOVER_MODAL';
      this.callbacks.onStateChange('GAMEOVER_MODAL');
      this.callbacks.onGameOver(Math.floor(this.distance));
    }
  }
}
