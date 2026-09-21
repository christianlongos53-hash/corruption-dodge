import { GovernmentProject, formatPeso } from '../../types/game';

/**
 * Draws a glowing, unmistakable Government Infrastructure Project milestone on the road.
 * This is a friendly interactable that the player MUST TOUCH to activate and upgrade the country!
 */
export function drawGovernmentProject(ctx: CanvasRenderingContext2D, project: GovernmentProject, time: number) {
  ctx.save();
  ctx.translate(project.x, project.y);

  const pulse = Math.sin(time * 5 + project.pulsePhase) * 0.12 + 1.0;
  ctx.scale(pulse, pulse);

  // 1. Golden Glowing Aura / Halo
  const haloGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, project.radius * 2.2);
  haloGrad.addColorStop(0, 'rgba(250, 204, 21, 0.65)'); // Radiant gold
  haloGrad.addColorStop(0.55, 'rgba(59, 130, 246, 0.45)'); // Vibrant civic blue
  haloGrad.addColorStop(1, 'rgba(59, 130, 246, 0)');
  ctx.fillStyle = haloGrad;
  ctx.beginPath();
  ctx.arc(0, 0, project.radius * 2.2, 0, Math.PI * 2);
  ctx.fill();

  // 2. Outer Rotating Seal Ring
  ctx.save();
  ctx.rotate(time * 1.5);
  ctx.strokeStyle = '#FACC15';
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.arc(0, 0, project.radius * 1.35, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 3. Central Circular Emblem Base (Civic Blue & Gold)
  ctx.fillStyle = '#1D4ED8';
  ctx.strokeStyle = '#FDE047';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(0, 0, project.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 4. Architectural Blueprint & Construction Icon
  // Rolled Blueprint scroll
  ctx.fillStyle = '#60A5FA';
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-16, -10, 32, 20, 4);
  ctx.fill();
  ctx.stroke();

  // Blueprint grid lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-12, -5);
  ctx.lineTo(12, -5);
  ctx.moveTo(-12, 0);
  ctx.lineTo(12, 0);
  ctx.moveTo(-12, 5);
  ctx.lineTo(12, 5);
  ctx.stroke();

  // Golden Construction Crane / Ruler
  ctx.strokeStyle = '#FACC15';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-18, 12);
  ctx.lineTo(18, -12);
  ctx.stroke();

  // 5. Sparkling starbursts
  const sparklePhase = time * 6;
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2 + sparklePhase * 0.5;
    const dist = project.radius * 1.45;
    const sx = Math.cos(angle) * dist;
    const sy = Math.sin(angle) * dist;
    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.arc(sx, sy, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // 6. "TOUCH TO ACTIVATE (-₱500K)" Banner
  ctx.save();
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const costLabel = formatPeso(project.cost);

  // Pill badge below
  const bannerY = project.radius + 17;
  ctx.fillStyle = '#F59E0B';
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-78, bannerY - 11, 156, 22, 11);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(`✨ TOUCH TO ACTIVATE (-${costLabel})`, 0, bannerY);

  // Project name badge above
  const nameY = -project.radius - 15;
  ctx.fillStyle = '#1E3A8A';
  ctx.strokeStyle = '#FDE047';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(-80, nameY - 11, 160, 22, 9);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FDE047';
  ctx.fillText(`${project.name} (${costLabel})`, 0, nameY);

  ctx.restore();

  ctx.restore();
}
