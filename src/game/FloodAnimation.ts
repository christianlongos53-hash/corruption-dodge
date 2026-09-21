import { audioSystem } from './AudioSystem';

interface Bubble {
  x: number;
  y: number;
  radius: number;
  speed: number;
  wobbleSpeed: number;
  wobbleAmount: number;
}

type GarbageType = 'bottle' | 'can' | 'bag' | 'styrofoam' | 'carton';

interface GarbageItem {
  x: number;
  y: number;
  type: GarbageType;
  rotation: number;
  rotationSpeed: number;
  speedY: number;
  speedX: number;
  scale: number;
}

interface RatItem {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  scale: number;
  swimPhase: number;
}

export class FloodAnimation {
  private active: boolean = false;
  private currentLevel: number = 0; // 0.0 to 1.0 (portion of screen flooded from the TOP)
  private targetLevel: number = 0; // 0, 0.25, 0.5, 0.75, 1.0
  private progress: number = 0; // 0 to 1 for final game over surge
  private duration: number = 1.1; // Surge duration
  private holdTimer: number = 0;
  private holdDuration: number = 0.5; // Hold submerged before showing game over modal
  private bubbles: Bubble[] = [];
  private garbages: GarbageItem[] = [];
  private rats: RatItem[] = [];

  /**
   * Initializes bubbles, garbages, and rats across the screen.
   */
  public initItems(canvasWidth: number, canvasHeight: number) {
    this.bubbles = [];
    this.garbages = [];
    this.rats = [];

    // 1. Muddy water bubbles
    for (let i = 0; i < 80; i++) {
      this.bubbles.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        radius: 4 + Math.random() * 10,
        speed: 100 + Math.random() * 160,
        wobbleSpeed: 3 + Math.random() * 6,
        wobbleAmount: 6 + Math.random() * 14
      });
    }

    // 2. Floating Urban Garbages distributed across screen
    const types: GarbageType[] = ['bottle', 'can', 'bag', 'styrofoam', 'carton'];
    for (let i = 0; i < 60; i++) {
      this.garbages.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        type: types[i % types.length],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 3.0,
        speedY: 20 + Math.random() * 50,
        speedX: (Math.random() - 0.5) * 50,
        scale: 1.35 + Math.random() * 0.65
      });
    }

    // 3. Swimming Rats paddling across the flood
    for (let i = 0; i < 35; i++) {
      this.rats.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        speedX: (i % 2 === 0 ? 1 : -1) * (55 + Math.random() * 80),
        speedY: 20 + Math.random() * 45,
        scale: 1.5 + Math.random() * 0.55,
        swimPhase: Math.random() * Math.PI * 2
      });
    }
  }

  /**
   * Sets progressive flood target level (0.25, 0.5, 0.75, 1.0) on obstacle touch or reduction on project activation.
   */
  public setTargetLevel(level: number, canvasWidth?: number, canvasHeight?: number) {
    this.targetLevel = Math.min(1.0, Math.max(0, level));
    if (this.bubbles.length === 0 && canvasWidth && canvasHeight) {
      this.initItems(canvasWidth, canvasHeight);
    }
  }

  /**
   * Final Game Over surge (fills 100% of screen from top to bottom).
   */
  public start(canvasWidth: number, canvasHeight: number) {
    this.active = true;
    this.targetLevel = 1.0;
    this.progress = 0;
    this.holdTimer = 0;

    if (this.bubbles.length === 0) {
      this.initItems(canvasWidth, canvasHeight);
    }

    audioSystem.playFlood();
  }

  public reset() {
    this.active = false;
    this.currentLevel = 0;
    this.targetLevel = 0;
    this.progress = 0;
    this.holdTimer = 0;
    this.bubbles = [];
    this.garbages = [];
    this.rats = [];
  }

  public isActive(): boolean {
    return this.active || this.currentLevel > 0;
  }

  public getCurrentLevel(): number {
    return this.currentLevel;
  }

  /**
   * Updates animations continuously during PLAYING, GAMEOVER_FLOOD, and GAMEOVER_MODAL.
   */
  public update(dt: number, canvasWidth: number, canvasHeight: number): boolean {
    if (this.bubbles.length === 0 && (this.targetLevel > 0 || this.active)) {
      this.initItems(canvasWidth, canvasHeight);
    }

    // Smoothly interpolate currentLevel towards targetLevel (both rising and receding)
    if (this.currentLevel < this.targetLevel) {
      this.currentLevel = Math.min(this.targetLevel, this.currentLevel + dt * 0.85);
    } else if (this.currentLevel > this.targetLevel) {
      this.currentLevel = Math.max(this.targetLevel, this.currentLevel - dt * 0.65);
    }

    // Game Over sequence handling when active and targetLevel is 1.0
    if (this.active && this.targetLevel >= 1.0) {
      if (this.progress < 1) {
        this.progress += dt / this.duration;
        if (this.progress >= 1) {
          this.progress = 1;
          audioSystem.playGameOver();
        }
      } else {
        this.holdTimer += dt;
      }
    }

    if (this.currentLevel <= 0.001) return false;

    // Flood descends from top (0) down to floodBottom
    const floodBottom = canvasHeight * this.currentLevel;

    // Continuously update bubbles in flooded region (rising upward toward surface at y=0)
    for (const b of this.bubbles) {
      b.y -= b.speed * dt;
      if (b.y < -30) {
        b.y = floodBottom + Math.random() * 20;
        b.x = Math.random() * canvasWidth;
      }
    }

    // Continuously update floating garbages in flooded region (0 to floodBottom)
    for (const g of this.garbages) {
      g.y += g.speedY * dt * 0.6;
      g.x += g.speedX * dt;
      g.rotation += g.rotationSpeed * dt;

      if (g.x < -70) g.x = canvasWidth + 50;
      if (g.x > canvasWidth + 70) g.x = -50;
      if (g.y > floodBottom + 20) {
        g.y = -40;
        g.x = Math.random() * canvasWidth;
      }
    }

    // Continuously update swimming rats in flooded region (0 to floodBottom)
    for (const r of this.rats) {
      r.y += r.speedY * dt * 0.5;
      r.x += r.speedX * dt;
      r.swimPhase += dt * 14;

      if (r.x < -90) r.x = canvasWidth + 60;
      if (r.x > canvasWidth + 90) r.x = -60;

      if (r.y > floodBottom + 25) {
        r.y = -50;
        r.x = Math.random() * canvasWidth;
      }
    }

    return this.active && this.progress >= 1 && this.holdTimer >= this.holdDuration;
  }

  /**
   * Renders the brown murky floodwaters, swimming rats, and urban garbage.
   * Covers from TOP (y = 0) down to floodBottom based on currentLevel.
   */
  public render(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
    if (this.currentLevel <= 0.001) return;

    ctx.save();

    // Flood descends from y = 0 down to floodBottom
    const floodBottom = height * this.currentLevel;

    // 1. Turbid brown water gradient covering from TOP (y = -60) down to floodBottom
    const brownGrad = ctx.createLinearGradient(0, 0, 0, floodBottom);
    brownGrad.addColorStop(0, '#582F0E'); // Deep murky sediment brown at top
    brownGrad.addColorStop(0.7, '#854D0E'); // Turbid coffee brown
    brownGrad.addColorStop(1, '#A16207'); // Murky yellowish flood crest
    ctx.fillStyle = brownGrad;
    ctx.fillRect(-60, -60, width + 120, floodBottom + 60);

    // 2. Dynamic Muddy Wave Swells within the flooded zone
    ctx.fillStyle = 'rgba(254, 240, 138, 0.16)';
    for (let cy = 15; cy < floodBottom; cy += 45) {
      ctx.beginPath();
      const waveY = cy + Math.sin(time * 3.5 + cy * 0.05) * 8;
      ctx.ellipse(width / 2, waveY, width * 0.8, 14, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Frothy yellowish muddy foam wave crest right along the advancing flood boundary (floodBottom)
    ctx.strokeStyle = '#FDE68A';
    ctx.lineWidth = 5.5;
    this.strokeWaveCrest(ctx, width, floodBottom, time * 5, 9, 0.02);

    // Additional foam wave lines within water
    ctx.lineWidth = 3.5;
    for (let i = 1; i <= 2; i++) {
      const rippleY = floodBottom - i * (floodBottom / 3);
      if (rippleY > 10) {
        this.strokeWaveCrest(ctx, width, rippleY, time * 4 + i, 6, 0.016);
      }
    }

    // 4. Floating Urban Garbages (rendered in the flooded zone: 0 to floodBottom)
    for (const g of this.garbages) {
      if (g.y <= floodBottom + 20 && g.y >= -60) {
        this.drawGarbage(ctx, g);
      }
    }

    // 5. Swimming Rats (swimming actively across the flooded zone)
    for (const r of this.rats) {
      if (r.y <= floodBottom + 25 && r.y >= -70) {
        this.drawSwimmingRat(ctx, r, time);
      }
    }

    // 6. Muddy water sediment bubbles in flooded zone
    ctx.fillStyle = 'rgba(254, 243, 199, 0.75)';
    for (const b of this.bubbles) {
      if (b.y <= floodBottom + 10 && b.y >= -40) {
        const wobbleX = b.x + Math.sin(time * b.wobbleSpeed) * b.wobbleAmount;
        ctx.beginPath();
        ctx.arc(wobbleX, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
        ctx.beginPath();
        ctx.arc(wobbleX - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(254, 243, 199, 0.75)';
      }
    }

    ctx.restore();
  }

  /**
   * Draws a chubby swimming rat struggling and paddling in the flood.
   */
  private drawSwimmingRat(ctx: CanvasRenderingContext2D, rat: RatItem, time: number) {
    ctx.save();
    ctx.translate(rat.x, rat.y);
    ctx.scale(rat.scale * (rat.speedX < 0 ? -1 : 1), rat.scale);

    const pawWiggle = Math.sin(rat.swimPhase);
    const tailWiggle = Math.sin(time * 9);

    // 1. Long pink rat tail wriggling behind
    ctx.strokeStyle = '#F472B6';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.quadraticCurveTo(-26, tailWiggle * 10, -36, tailWiggle * 18);
    ctx.stroke();

    // 2. Rat Chubby Body (Dark gray with brown tint)
    ctx.fillStyle = '#374151';
    ctx.strokeStyle = '#1F2937';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 3. Paddling Paws (Pink)
    ctx.fillStyle = '#F472B6';
    // Front paddling paw
    ctx.beginPath();
    ctx.arc(10, 8 + pawWiggle * 4, 4, 0, Math.PI * 2);
    ctx.fill();
    // Back paddling paw
    ctx.beginPath();
    ctx.arc(-8, 8 - pawWiggle * 4, 4, 0, Math.PI * 2);
    ctx.fill();

    // 4. Rat Head & Snout
    ctx.fillStyle = '#1F2937';
    ctx.beginPath();
    ctx.ellipse(14, -2, 10, 7, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // 5. Pink Inner Ear
    ctx.fillStyle = '#F472B6';
    ctx.beginPath();
    ctx.ellipse(8, -9, 5, 4, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // 6. Beady Black Eye with shine
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(16, -3, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(16.8, -3.8, 1, 0, Math.PI * 2);
    ctx.fill();

    // 7. Bright Pink Nose
    ctx.fillStyle = '#EC4899';
    ctx.beginPath();
    ctx.arc(23, -1, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 8. Whiskers
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(21, -1);
    ctx.lineTo(30, -5);
    ctx.moveTo(21, 0);
    ctx.lineTo(30, 2);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Draws a floating piece of urban garbage with bright, high-contrast colors.
   */
  private drawGarbage(ctx: CanvasRenderingContext2D, g: GarbageItem) {
    ctx.save();
    ctx.translate(g.x, g.y);
    ctx.rotate(g.rotation);
    ctx.scale(g.scale, g.scale);

    switch (g.type) {
      case 'bottle':
        ctx.fillStyle = '#60A5FA';
        ctx.strokeStyle = '#1D4ED8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-14, -6, 28, 12, 3);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(14, -3, 5, 6);
        ctx.fillStyle = '#2563EB';
        ctx.fillRect(-4, -6, 10, 12);
        break;

      case 'can':
        ctx.fillStyle = '#EF4444';
        ctx.strokeStyle = '#7F1D1D';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-12, -7, 24, 14, 3);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#E2E8F0';
        ctx.fillRect(-13, -7, 3, 14);
        ctx.fillRect(10, -7, 3, 14);
        break;

      case 'bag':
        ctx.fillStyle = '#111827';
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(0, 2, 16, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-5, -8);
        ctx.lineTo(0, -14);
        ctx.lineTo(5, -8);
        ctx.fill();
        break;

      case 'styrofoam':
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-14, -9, 28, 18, 4);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = '#CBD5E1';
        ctx.beginPath();
        ctx.moveTo(-14, 0);
        ctx.lineTo(14, 0);
        ctx.stroke();
        break;

      case 'carton':
        ctx.fillStyle = '#D97706';
        ctx.strokeStyle = '#78350F';
        ctx.lineWidth = 2;
        ctx.fillRect(-12, -9, 24, 18);
        ctx.strokeRect(-12, -9, 24, 18);
        ctx.fillStyle = '#FEF08A';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('₱', 0, 0);
        break;
    }

    ctx.restore();
  }

  private strokeWaveCrest(
    ctx: CanvasRenderingContext2D,
    width: number,
    baseY: number,
    phase: number,
    amplitude: number,
    frequency: number
  ) {
    const extra = 60;
    ctx.beginPath();
    const step = 6;
    for (let x = -extra; x <= width + extra; x += step) {
      const y = baseY + Math.sin(x * frequency + phase) * amplitude + Math.cos(x * 0.008 + phase * 0.6) * (amplitude * 0.35);
      if (x === -extra) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }
}
