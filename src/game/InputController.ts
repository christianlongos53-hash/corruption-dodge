import { PlayerPosition, getRoadBounds } from '../types/game';

export class InputController {
  private canvas: HTMLCanvasElement | null = null;
  public player: PlayerPosition = {
    x: 200,
    y: 200,
    targetX: 200,
    targetY: 200,
    radius: 26 // Hitbox radius
  };

  public isPointerDown: boolean = false;
  public isActive: boolean = false;

  // Keyboard state
  private keys: { [key: string]: boolean } = {};
  private keySpeed: number = 440; // px/s for keyboard controls

  public attach(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.bindEvents();
  }

  public detach() {
    this.unbindEvents();
    this.canvas = null;
  }

  public reset(x: number, y: number) {
    this.player.x = x;
    this.player.y = y;
    this.player.targetX = x;
    this.player.targetY = y;
    this.keys = {};
  }

  private handlePointerMove = (e: PointerEvent) => {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Direct mapping in CSS pixels
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;

    // Strict road clamping: Avatar is ONLY allowed on the road
    const road = getRoadBounds(rect.width);
    const minX = road.left + this.player.radius + 4;
    const maxX = road.right - this.player.radius - 4;

    const minY = this.player.radius + 16;
    const maxY = rect.height - this.player.radius - 16;

    this.player.targetX = Math.max(minX, Math.min(maxX, canvasX));
    this.player.targetY = Math.max(minY, Math.min(maxY, canvasY));
    this.isActive = true;
  };

  private handlePointerDown = (e: PointerEvent) => {
    this.isPointerDown = true;
    try {
      if (this.canvas && e.target === this.canvas) {
        this.canvas.setPointerCapture(e.pointerId);
      }
    } catch {
      // Ignore pointer capture errors on certain browsers
    }
    this.handlePointerMove(e);
  };

  private handlePointerUp = (e: PointerEvent) => {
    this.isPointerDown = false;
    try {
      if (this.canvas && this.canvas.hasPointerCapture(e.pointerId)) {
        this.canvas.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    this.keys[e.key] = true;
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.keys[e.key] = false;
  };

  private bindEvents() {
    if (!this.canvas) return;
    this.canvas.style.touchAction = 'none'; // Prevent mobile page scrolling

    this.canvas.addEventListener('pointerdown', this.handlePointerDown);
    window.addEventListener('pointermove', this.handlePointerMove);
    window.addEventListener('pointerup', this.handlePointerUp);
    window.addEventListener('pointercancel', this.handlePointerUp);

    // Keyboard support (Arrows / WASD)
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  private unbindEvents() {
    if (this.canvas) {
      this.canvas.removeEventListener('pointerdown', this.handlePointerDown);
    }
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerup', this.handlePointerUp);
    window.removeEventListener('pointercancel', this.handlePointerUp);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  /**
   * Updates player position smoothly towards target, strictly clamped to the road.
   */
  public update(dt: number) {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const road = getRoadBounds(rect.width);
    const minX = road.left + this.player.radius + 4;
    const maxX = road.right - this.player.radius - 4;
    const minY = this.player.radius + 16;
    const maxY = rect.height - this.player.radius - 16;

    // Handle keyboard movement
    let kx = 0;
    let ky = 0;
    if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) kx -= 1;
    if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) kx += 1;
    if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) ky -= 1;
    if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) ky += 1;

    if (kx !== 0 || ky !== 0) {
      const len = Math.sqrt(kx * kx + ky * ky);
      const moveDist = this.keySpeed * dt;
      this.player.targetX += (kx / len) * moveDist;
      this.player.targetY += (ky / len) * moveDist;
      this.player.targetX = Math.max(minX, Math.min(maxX, this.player.targetX));
      this.player.targetY = Math.max(minY, Math.min(maxY, this.player.targetY));
    }

    // Fast responsive lerp towards target pointer
    const lerpFactor = Math.min(1, 1 - Math.exp(-28 * dt));
    this.player.x += (this.player.targetX - this.player.x) * lerpFactor;
    this.player.y += (this.player.targetY - this.player.y) * lerpFactor;

    // Enforce strict road clamp on player current position
    this.player.x = Math.max(minX, Math.min(maxX, this.player.x));
    this.player.y = Math.max(minY, Math.min(maxY, this.player.y));
  }
}
