import { CharacterId, DevelopmentStage, GovernmentProject, Obstacle, PlayerPosition, WeatherType, getRoadBounds } from '../types/game';
import { drawChibiCharacter } from './sprites/ChibiSprites';
import { drawObstacle } from './sprites/ObstacleSprites';
import { drawGovernmentProject } from './sprites/ProjectSprites';
import { FloodAnimation } from './FloodAnimation';

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private scrollOffset: number = 0;
  private dpr: number = 1;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) throw new Error('Could not get 2D context');
    this.ctx = context;
  }

  /**
   * Adjusts canvas resolution to match client display size and device pixel ratio.
   */
  public resize(width: number, height: number) {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for performance
    this.canvas.width = Math.round(width * this.dpr);
    this.canvas.height = Math.round(height * this.dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.ctx.resetTransform();
    this.ctx.scale(this.dpr, this.dpr);
  }

  public getDpr(): number {
    return this.dpr;
  }

  /**
   * Main rendering pass.
   */
  public render(
    width: number,
    height: number,
    dt: number,
    speed: number,
    time: number,
    player: PlayerPosition,
    characterId: CharacterId,
    obstacles: Obstacle[],
    floodAnimation: FloodAnimation,
    isGameOver: boolean,
    weather: WeatherType = 'sunny',
    isInvulnerable: boolean = false,
    stage: DevelopmentStage = 'muddy_rural',
    activeProject: GovernmentProject | null = null
  ) {
    // Advance scroll offset (Moving from TOP to BOTTOM)
    if (!isGameOver) {
      this.scrollOffset = (this.scrollOffset + speed * dt) % 10000;
    }

    const ctx = this.ctx;

    // Reset transform & scale to guarantee clean coordinate system every frame
    ctx.resetTransform();
    ctx.scale(this.dpr, this.dpr);

    // 1. Draw Country Track & Scenery based on Development Stage (Scrolling top to bottom)
    this.drawBackground(width, height, this.scrollOffset, time, stage);

    // 2. Draw Active Government Infrastructure Project (if present on road)
    if (activeProject) {
      drawGovernmentProject(ctx, activeProject, time);
    }

    // 3. Draw Corruption Money Obstacles
    for (const obs of obstacles) {
      drawObstacle(ctx, obs);
    }

    // 4. Draw Player Chibi Avatar (stationed near bottom, with arcade blinking when invulnerable)
    if (!isInvulnerable || Math.floor(time * 14) % 2 === 0) {
      drawChibiCharacter(ctx, characterId, player.x, player.y, player.radius * 2.5, time);
    }

    // Explicitly reset transform & scale to guarantee clean full-screen coordinate system
    // for weather and flood overlays so they NEVER follow the avatar!
    ctx.resetTransform();
    ctx.scale(this.dpr, this.dpr);

    // 5. Draw Weather Visual Effects (Whole-screen overlay)
    this.drawWeather(width, height, weather, time);

    // 6. Draw Progressive Floodwaters Overlay (Flooding from TOP of screen downwards)
    floodAnimation.render(ctx, width, height, time);
  }

  /**
   * Draws vibrant atmospheric weather effects covering the ENTIRE screen.
   */
  private drawWeather(width: number, height: number, weather: WeatherType, time: number) {
    const ctx = this.ctx;
    ctx.save();

    if (weather === 'sunny') {
      // ☀️ Sunny: Full-screen warm radiant sunshine & sunbeams
      ctx.fillStyle = 'rgba(254, 240, 138, 0.16)';
      ctx.fillRect(0, 0, width, height);

      const sunGrad = ctx.createRadialGradient(width * 0.1, 0, 10, width * 0.1, 0, width * 0.9);
      sunGrad.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
      sunGrad.addColorStop(0.5, 'rgba(253, 224, 71, 0.14)');
      sunGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      for (let i = 0; i < 5; i++) {
        const beamAngle = 0.28 + i * 0.22 + Math.sin(time * 0.8 + i) * 0.03;
        const beamWidth = 60 + i * 25;
        ctx.beginPath();
        ctx.moveTo(width * 0.1, 0);
        ctx.lineTo(width * 0.1 + Math.cos(beamAngle) * (height * 1.8), Math.sin(beamAngle) * (height * 1.8));
        ctx.lineTo(width * 0.1 + Math.cos(beamAngle) * (height * 1.8) + beamWidth, Math.sin(beamAngle) * (height * 1.8));
        ctx.closePath();
        ctx.fill();
      }
    } else if (weather === 'windy') {
      // 🍃 Windy: Full-screen breezy atmosphere & swirling tropical leaves
      ctx.fillStyle = 'rgba(224, 242, 254, 0.12)';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)';
      ctx.lineWidth = 1.8;
      ctx.setLineDash([35, 25]);
      for (let i = 0; i < 8; i++) {
        const gustY = ((time * 260 + i * 140) % (height + 150)) - 80;
        const curveX = Math.sin(time * 2.8 + i * 1.2) * 45;
        ctx.beginPath();
        ctx.moveTo(-40, gustY);
        ctx.bezierCurveTo(width * 0.3 + curveX, gustY - 30, width * 0.7 - curveX, gustY + 30, width + 40, gustY);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Swirling flying green leaves
      for (let i = 0; i < 28; i++) {
        const seed = i * 137.5;
        const leafSpeed = 220 + (i % 6) * 55;
        const lx = ((time * leafSpeed + seed) % (width + 120)) - 60;
        const ly = ((seed * 3.7 + time * 130 + Math.sin(time * 3.5 + i) * 60) % (height + 80)) - 40;
        const lRot = time * 5 + i;

        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(lRot);
        ctx.fillStyle = i % 2 === 0 ? '#10B981' : '#059669';
        ctx.beginPath();
        ctx.ellipse(0, 0, 9, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    } else if (weather === 'stormy') {
      // ⛈️ Stormy: Full-screen dark typhoon gloom, torrential rain, and thunder flashes
      ctx.fillStyle = 'rgba(15, 23, 42, 0.58)';
      ctx.fillRect(0, 0, width, height);

      // Random lightning flash across whole screen
      const flash = Math.sin(time * 11.5) > 0.94;
      if (flash) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = '#FEF08A';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        let lx = width * 0.45;
        let ly = 0;
        ctx.moveTo(lx, ly);
        for (let seg = 0; seg < 6; seg++) {
          lx += (Math.random() - 0.5) * 60;
          ly += height / 6;
          ctx.lineTo(lx, ly);
        }
        ctx.stroke();
      }

      // Torrential diagonal rain streaks
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.65)';
      ctx.lineWidth = 1.6;
      for (let i = 0; i < 90; i++) {
        const rx = ((i * 37 + time * 650) % (width + 100)) - 50;
        const ry = ((i * 61 + time * 950) % (height + 100)) - 50;
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx + 14, ry + 28);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  /**
   * Draws the country track, roadside scenery, and infrastructure evolution.
   * Scrolling smoothly from TOP to BOTTOM.
   */
  private drawBackground(
    width: number,
    height: number,
    offset: number,
    time: number,
    stage: DevelopmentStage
  ) {
    const ctx = this.ctx;
    const { roadWidth, roadMargin } = getRoadBounds(width);

    switch (stage) {
      case 'muddy_rural':
        this.drawMuddyRuralStage(ctx, width, height, roadMargin, roadWidth, offset, time);
        break;
      case 'provincial_paved':
        this.drawProvincialStage(ctx, width, height, roadMargin, roadWidth, offset, time);
        break;
      case 'national_highway':
        this.drawHighwayStage(ctx, width, height, roadMargin, roadWidth, offset, time);
        break;
      case 'urban_metropolis':
        this.drawMetropolisStage(ctx, width, height, roadMargin, roadWidth, offset, time);
        break;
    }
  }

  /**
   * STAGE 1: Muddy Rural Countryside
   * Unpaved brown dirt road with muddy tire ruts, puddles, bamboo fences, and Bahay Kubo.
   */
  private drawMuddyRuralStage(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    roadMargin: number,
    roadWidth: number,
    offset: number,
    _time: number
  ) {
    // 1. Muddy grass terrain (earthy yellowish green)
    ctx.fillStyle = '#3F6212';
    ctx.fillRect(0, 0, width, height);

    // Mud patches on the sides
    ctx.fillStyle = '#78350F';
    for (let y = -80; y < height + 80; y += 90) {
      const drawY = y + (offset % 90);
      ctx.beginPath();
      ctx.ellipse(roadMargin * 0.35, drawY, 22, 14, 0.3, 0, Math.PI * 2);
      ctx.ellipse(width - roadMargin * 0.35, drawY + 45, 24, 16, -0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Unpaved Wet Dirt Road (Brown earth)
    ctx.fillStyle = '#713F12';
    ctx.fillRect(roadMargin, 0, roadWidth, height);

    // Dark muddy tire ruts running vertically down the road
    ctx.fillStyle = '#451A03';
    const rut1 = roadMargin + roadWidth * 0.28;
    const rut2 = roadMargin + roadWidth * 0.72;
    ctx.fillRect(rut1 - 8, 0, 16, height);
    ctx.fillRect(rut2 - 8, 0, 16, height);

    // Rough gravel / mud border along the road
    ctx.fillStyle = '#92400E';
    for (let y = -40; y < height + 40; y += 35) {
      const drawY = y + (offset % 35);
      ctx.fillRect(roadMargin - 6, drawY, 8, 18);
      ctx.fillRect(roadMargin + roadWidth - 2, drawY, 8, 18);
    }

    // 3. Roadside Scenery: Bamboo Fences, Bahay Kubo, Coconut Palms
    const itemSpacing = 240;
    for (let y = -itemSpacing; y < height + itemSpacing; y += itemSpacing) {
      const drawY = y + (offset % itemSpacing);

      // Left: Bamboo Fence & Coconut Palm
      this.drawBambooFence(ctx, roadMargin * 0.45, drawY, 60);
      this.drawCoconutPalm(ctx, roadMargin * 0.35, drawY + 80, 20);

      // Right: Traditional Bahay Kubo (Nipa Hut)
      if (width - roadMargin > 50) {
        this.drawBahayKubo(ctx, width - roadMargin * 0.5, drawY + 40);
      }
    }
  }

  /**
   * STAGE 2: Provincial Concrete Town
   * Gray concrete slab road with expansion joints, sari-sari stores, utility poles, and tricycles.
   */
  private drawProvincialStage(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    roadMargin: number,
    roadWidth: number,
    offset: number,
    _time: number
  ) {
    // 1. Lush Green Provincial Grass
    ctx.fillStyle = '#15803D';
    ctx.fillRect(0, 0, width, height);

    // 2. Concrete Road Slabs (Light gray)
    ctx.fillStyle = '#94A3B8';
    ctx.fillRect(roadMargin, 0, roadWidth, height);

    // Gravel shoulders
    ctx.fillStyle = '#CBD5E1';
    ctx.fillRect(roadMargin - 8, 0, 8, height);
    ctx.fillRect(roadMargin + roadWidth, 0, 8, height);

    // Transverse expansion joint lines every 110px
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 3;
    for (let y = -110; y < height + 110; y += 110) {
      const jointY = y + (offset % 110);
      ctx.beginPath();
      ctx.moveTo(roadMargin, jointY);
      ctx.lineTo(roadMargin + roadWidth, jointY);
      ctx.stroke();
    }

    // Center dividing line (faint yellow paint)
    ctx.strokeStyle = '#FDE047';
    ctx.lineWidth = 4;
    ctx.setLineDash([35, 30]);
    ctx.lineDashOffset = -offset;
    const center = roadMargin + roadWidth * 0.5;
    ctx.beginPath();
    ctx.moveTo(center, 0);
    ctx.lineTo(center, height);
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. Roadside Scenery: Utility Poles, Sari-Sari Stores, Tricycles
    const itemSpacing = 230;
    for (let y = -itemSpacing; y < height + itemSpacing; y += itemSpacing) {
      const drawY = y + (offset % itemSpacing);

      // Left: Wooden Utility Pole with wires & Palm
      this.drawUtilityPole(ctx, roadMargin * 0.4, drawY);
      this.drawCoconutPalm(ctx, roadMargin * 0.35, drawY + 90, 18);

      // Right: Sari-Sari Store or Tricycle
      const isStore = Math.floor((drawY + offset) / itemSpacing) % 2 === 0;
      if (width - roadMargin > 50) {
        if (isStore) {
          this.drawSariSariStore(ctx, width - roadMargin * 0.5, drawY + 30);
        } else {
          this.drawTricycle(ctx, width - roadMargin * 0.5, drawY + 40);
        }
      }
    }
  }

  /**
   * STAGE 3: National Highway
   * Smooth asphalt, painted yellow/black curbs, lane dashes, streetlights, and Jeepneys.
   */
  private drawHighwayStage(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    roadMargin: number,
    roadWidth: number,
    offset: number,
    _time: number
  ) {
    // 1. Manicured grass
    ctx.fillStyle = '#16A34A';
    ctx.fillRect(0, 0, width, height);

    // 2. Yellow and Black Curbs
    const kerbWidth = 12;
    const kerbSegment = 30;
    const kerbShift = offset % (kerbSegment * 2);

    for (let y = -kerbSegment * 4; y < height + kerbSegment * 4; y += kerbSegment) {
      const drawY = y + kerbShift;
      const isYellow = Math.abs(Math.floor((drawY - offset) / kerbSegment)) % 2 === 0;
      ctx.fillStyle = isYellow ? '#F59E0B' : '#1E293B';
      ctx.fillRect(roadMargin - kerbWidth, drawY, kerbWidth, kerbSegment);
      ctx.fillRect(roadMargin + roadWidth, drawY, kerbWidth, kerbSegment);
    }

    // 3. Dark Slate Asphalt
    ctx.fillStyle = '#334155';
    ctx.fillRect(roadMargin, 0, roadWidth, height);

    // White edge boundary lines
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(roadMargin, 0, 3, height);
    ctx.fillRect(roadMargin + roadWidth - 3, 0, 3, height);

    // Yellow center dashes
    ctx.strokeStyle = '#FDE047';
    ctx.lineWidth = 5;
    ctx.setLineDash([40, 30]);
    ctx.lineDashOffset = -offset;

    if (roadWidth > 380) {
      const lane1 = roadMargin + roadWidth * 0.33;
      const lane2 = roadMargin + roadWidth * 0.66;
      ctx.beginPath();
      ctx.moveTo(lane1, 0);
      ctx.lineTo(lane1, height);
      ctx.moveTo(lane2, 0);
      ctx.lineTo(lane2, height);
      ctx.stroke();
    } else {
      const center = roadMargin + roadWidth * 0.5;
      ctx.beginPath();
      ctx.moveTo(center, 0);
      ctx.lineTo(center, height);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // 4. Roadside Scenery: Streetlights, Jeepneys, Commercial Billboards
    const itemSpacing = 220;
    for (let y = -itemSpacing; y < height + itemSpacing; y += itemSpacing) {
      const drawY = y + (offset % itemSpacing);

      // Left: Streetlight & Palm
      this.drawStreetlight(ctx, roadMargin * 0.4, drawY);
      this.drawCoconutPalm(ctx, roadMargin * 0.35, drawY + 80, 20);

      // Right: Philippine Jeepney
      if (width - roadMargin > 50) {
        this.drawJeepney(ctx, width - roadMargin * 0.5, drawY + 40);
      }
    }
  }

  /**
   * STAGE 4: Modern Urban Smart Metropolis
   * Pristine multi-lane highway, glowing solar road studs, glass skyscrapers, and elevated transit.
   */
  private drawMetropolisStage(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    roadMargin: number,
    roadWidth: number,
    offset: number,
    _time: number
  ) {
    // 1. Sleek Urban Parkway with concrete sidewalks
    ctx.fillStyle = '#064E3B';
    ctx.fillRect(0, 0, width, height);

    // Sidewalks (Clean light granite)
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(roadMargin - 16, 0, 16, height);
    ctx.fillRect(roadMargin + roadWidth, 0, 16, height);

    // 2. High-Tech Slate Highway
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(roadMargin, 0, roadWidth, height);

    // Glowing LED Road Studs along borders
    ctx.fillStyle = '#38BDF8';
    for (let y = -40; y < height + 40; y += 40) {
      const studY = y + (offset % 40);
      ctx.beginPath();
      ctx.arc(roadMargin + 4, studY, 3, 0, Math.PI * 2);
      ctx.arc(roadMargin + roadWidth - 4, studY, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Crisp white double lane markings
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 4;
    ctx.setLineDash([45, 35]);
    ctx.lineDashOffset = -offset;

    const lane1 = roadMargin + roadWidth * 0.33;
    const lane2 = roadMargin + roadWidth * 0.66;
    ctx.beginPath();
    ctx.moveTo(lane1, 0);
    ctx.lineTo(lane1, height);
    ctx.moveTo(lane2, 0);
    ctx.lineTo(lane2, height);
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. Roadside Scenery: Glass Skyscrapers, Elevated Transit Viaduct, Solar Streetlights
    const itemSpacing = 240;
    for (let y = -itemSpacing; y < height + itemSpacing; y += itemSpacing) {
      const drawY = y + (offset % itemSpacing);

      // Left: Modern Solar Streetlight & Manicured Tree
      this.drawStreetlight(ctx, roadMargin * 0.45, drawY);

      // Right: Glass Skyscraper & Elevated Monorail
      if (width - roadMargin > 50) {
        this.drawSkyscraper(ctx, width - roadMargin * 0.55, drawY + 20, 48, 70);
      }
    }
  }

  /**
   * Draws a traditional Philippine Bahay Kubo (Nipa Hut on stilts).
   */
  private drawBahayKubo(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(0.85, 0.85);

    // Wooden stilts / bamboo posts
    ctx.strokeStyle = '#78350F';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-14, 18);
    ctx.lineTo(-14, 30);
    ctx.moveTo(14, 18);
    ctx.lineTo(14, 30);
    ctx.moveTo(0, 18);
    ctx.lineTo(0, 30);
    ctx.stroke();

    // Woven bamboo house body (Amakan walls)
    ctx.fillStyle = '#D97706';
    ctx.fillRect(-18, 4, 36, 18);

    // Open bamboo window
    ctx.fillStyle = '#78350F';
    ctx.fillRect(-8, 8, 16, 10);

    // Thatched Nipa / Cogon Grass Roof (Pyramidal overhang)
    ctx.fillStyle = '#B45309';
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(-24, 6);
    ctx.lineTo(24, 6);
    ctx.closePath();
    ctx.fill();

    // Roof texture lines
    ctx.strokeStyle = '#78350F';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(-12, 6);
    ctx.moveTo(0, -18);
    ctx.lineTo(12, 6);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Draws a rustic Philippine bamboo fence.
   */
  private drawBambooFence(ctx: CanvasRenderingContext2D, x: number, y: number, length: number) {
    ctx.save();
    ctx.translate(x, y);

    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 2.5;

    // Horizontal rails
    ctx.beginPath();
    ctx.moveTo(-15, 0);
    ctx.lineTo(-15, length);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, length);
    ctx.stroke();

    // Vertical bamboo posts
    ctx.lineWidth = 3.5;
    for (let py = 0; py <= length; py += 18) {
      ctx.beginPath();
      ctx.moveTo(-20, py);
      ctx.lineTo(5, py);
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Draws a colorful Philippine Sari-Sari Store.
   */
  private drawSariSariStore(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(0.85, 0.85);

    // Store box body
    ctx.fillStyle = '#0284C7'; // Vibrant blue
    ctx.fillRect(-16, -6, 32, 28);

    // Opening window with metal grill
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(-12, 0, 24, 14);

    // Hanging snack packets (colorful dots)
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(-10, 2, 4, 4);
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(-4, 2, 4, 4);
    ctx.fillStyle = '#10B981';
    ctx.fillRect(2, 2, 4, 4);

    // Striped awning roof
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.moveTo(-20, -6);
    ctx.lineTo(20, -6);
    ctx.lineTo(16, -18);
    ctx.lineTo(-16, -18);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  /**
   * Draws a wooden utility pole with overhead cables.
   */
  private drawUtilityPole(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    ctx.translate(x, y);

    // Wood post
    ctx.fillStyle = '#78350F';
    ctx.fillRect(-3, -22, 6, 44);

    // Crossbar
    ctx.fillRect(-14, -18, 28, 4);

    // Insulators (white caps)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-12, -22, 4, 4);
    ctx.fillRect(8, -22, 4, 4);

    ctx.restore();
  }

  /**
   * Draws a modern solar-powered streetlight.
   */
  private drawStreetlight(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    ctx.translate(x, y);

    // Steel pole
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(0, -18);
    ctx.lineTo(10, -24);
    ctx.stroke();

    // Solar panel on top
    ctx.fillStyle = '#1E3A8A';
    ctx.fillRect(-8, -28, 16, 4);

    // LED lamp head
    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.arc(10, -22, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Draws a modern glass skyscraper with glowing window grid.
   */
  private drawSkyscraper(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    ctx.save();
    ctx.translate(x, y);

    // Tower base
    ctx.fillStyle = '#0F172A';
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h, 4);
    ctx.fill();
    ctx.stroke();

    // Window grid
    ctx.fillStyle = '#7DD3FC';
    const cols = 3;
    const rows = 5;
    const padX = w / (cols + 1);
    const padY = h / (rows + 1);

    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= cols; c++) {
        const wx = -w / 2 + c * padX - 3;
        const wy = -h / 2 + r * padY - 3;
        ctx.fillRect(wx, wy, 6, 6);
      }
    }

    ctx.restore();
  }

  /**
   * Draws a cute tropical Coconut Palm Tree.
   */
  private drawCoconutPalm(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
    ctx.save();
    ctx.translate(x, y);

    // Curved palm trunk
    ctx.strokeStyle = '#78350F';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, r * 1.2);
    ctx.quadraticCurveTo(r * 0.3, r * 0.5, 0, 0);
    ctx.stroke();

    // Palm fronds
    ctx.fillStyle = '#059669';
    const angles = [-2.4, -1.8, -1.2, -0.6, 0];
    for (const a of angles) {
      ctx.save();
      ctx.rotate(a);
      ctx.beginPath();
      ctx.ellipse(r * 0.7, 0, r * 0.75, r * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 3 Coconuts at center
    ctx.fillStyle = '#713F12';
    ctx.beginPath();
    ctx.arc(-3, 0, 4, 0, Math.PI * 2);
    ctx.arc(3, 0, 4, 0, Math.PI * 2);
    ctx.arc(0, 4, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Draws a cute roadside Jeepney.
   */
  private drawJeepney(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(0.85, 0.85);

    // Jeepney body
    ctx.fillStyle = '#2563EB'; // Royal Blue body
    ctx.beginPath();
    ctx.roundRect(-16, -26, 32, 52, 6);
    ctx.fill();

    // Stainless steel hood
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(-14, -24, 28, 14);

    // Windshield
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(-12, -8, 24, 8);

    // Colorful roof
    ctx.fillStyle = '#F59E0B'; // Yellow roof
    ctx.fillRect(-14, 2, 28, 22);

    // Headlights
    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.arc(-10, -25, 3, 0, Math.PI * 2);
    ctx.arc(10, -25, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Draws a cute roadside Tricycle.
   */
  private drawTricycle(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(0.8, 0.8);

    // Motorcycle side
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(-6, -16, 12, 32);

    // Sidecar (Passenger cab in bright red)
    ctx.fillStyle = '#DC2626';
    ctx.beginPath();
    ctx.roundRect(8, -14, 20, 28, 4);
    ctx.fill();

    // Sidecar windshield
    ctx.fillStyle = '#7DD3FC';
    ctx.fillRect(10, -12, 16, 6);

    ctx.restore();
  }
}
