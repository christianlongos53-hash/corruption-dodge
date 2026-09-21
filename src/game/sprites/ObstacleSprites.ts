import { Obstacle } from '../../types/game';

/**
 * Draws a Philippine-themed corruption obstacle on the canvas.
 */
export function drawObstacle(ctx: CanvasRenderingContext2D, obs: Obstacle) {
  ctx.save();
  ctx.translate(obs.x, obs.y);
  ctx.rotate(obs.rotation);

  // Subtle pulsing effect
  const pulse = 1 + Math.sin(obs.pulsePhase) * 0.05;
  ctx.scale(obs.scale * pulse, obs.scale * pulse);

  const r = obs.radius;

  // Drop shadow
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.beginPath();
  ctx.ellipse(0, r * 0.75, r * 0.8, r * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  switch (obs.type) {
    case 'cash_stack':
      drawPhilippineCashStack(ctx, r);
      break;
    case 'bribe_envelope':
      drawSobreNgSuhol(ctx, r);
      break;
    case 'gold_briefcase':
      drawKickbackMaleta(ctx, r);
      break;
    case 'pork_barrel':
      drawPorkBarrel(ctx, r);
      break;
  }

  // Corrupt warning aura / glint (Fiery Red)
  ctx.save();
  const aura = Math.sin(obs.pulsePhase * 2);
  if (aura > 0) {
    ctx.strokeStyle = `rgba(220, 38, 38, ${0.35 * aura})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.15, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  ctx.restore();
}

/**
 * Stacks of Philippine ₱1,000 bills (Iconic blue notes with red KURAPSYON band).
 */
function drawPhilippineCashStack(ctx: CanvasRenderingContext2D, r: number) {
  const w = r * 1.6;
  const h = r * 1.0;

  // Bottom ₱1,000 banknotes (deep ocean blue)
  ctx.fillStyle = '#1E3A8A';
  ctx.beginPath();
  ctx.roundRect(-w / 2 - 3, -h / 2 + 4, w, h, 6);
  ctx.fill();

  // Middle banknote
  ctx.fillStyle = '#2563EB';
  ctx.beginPath();
  ctx.roundRect(-w / 2 + 2, -h / 2 + 2, w, h, 6);
  ctx.fill();

  // Top ₱1,000 banknote (vibrant Philippine peso blue)
  ctx.fillStyle = '#3B82F6';
  ctx.strokeStyle = '#1D4ED8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-w / 2, -h / 2, w, h, 6);
  ctx.fill();
  ctx.stroke();

  // Inner border
  ctx.strokeStyle = '#93C5FD';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(-w / 2 + 4, -h / 2 + 4, w - 8, h - 8, 4);
  ctx.stroke();

  // Red "KURAPSYON" band
  ctx.fillStyle = '#DC2626';
  ctx.fillRect(-w * 0.24, -h / 2, w * 0.48, h);

  // Big Peso Sign
  ctx.fillStyle = '#FEF08A';
  ctx.font = `bold ${Math.round(r * 0.7)}px "Fredoka", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('₱', 0, 1);
}

/**
 * "Sobre ng Suhol" - Illicit brown kraft bribe envelope with red wax seal.
 */
function drawSobreNgSuhol(ctx: CanvasRenderingContext2D, r: number) {
  const w = r * 1.7;
  const h = r * 1.2;

  // Envelope paper body
  ctx.fillStyle = '#FDF6E2'; // Manila paper / kraft color
  ctx.strokeStyle = '#B45309';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-w / 2, -h / 2, w, h, 6);
  ctx.fill();
  ctx.stroke();

  // Envelope flap folds
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-w / 2, -h / 2);
  ctx.lineTo(0, h * 0.15);
  ctx.lineTo(w / 2, -h / 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-w / 2, h / 2);
  ctx.lineTo(0, -h * 0.05);
  ctx.lineTo(w / 2, h / 2);
  ctx.stroke();

  // Red Wax Seal ("SUHOL")
  ctx.fillStyle = '#991B1B';
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.38, 0, Math.PI * 2);
  ctx.fill();

  // Gold Peso Mark
  ctx.fillStyle = '#FDE047';
  ctx.font = `bold ${Math.round(r * 0.45)}px "Fredoka", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('₱', 0, 1);
}

/**
 * "Kickback Maleta" - Executive briefcase bursting with ₱1,000 bills.
 */
function drawKickbackMaleta(ctx: CanvasRenderingContext2D, r: number) {
  const w = r * 1.7;
  const h = r * 1.3;

  // Handle
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(-w * 0.25, -h / 2 - r * 0.35, w * 0.5, r * 0.4, 4);
  ctx.stroke();

  // Case body
  ctx.fillStyle = '#0F172A';
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(-w / 2, -h / 2, w, h, 8);
  ctx.fill();
  ctx.stroke();

  // Corner trims
  ctx.fillStyle = '#F59E0B';
  const cw = r * 0.25;
  ctx.fillRect(-w / 2, -h / 2, cw, cw);
  ctx.fillRect(w / 2 - cw, -h / 2, cw, cw);
  ctx.fillRect(-w / 2, h / 2 - cw, cw, cw);
  ctx.fillRect(w / 2 - cw, h / 2 - cw, cw, cw);

  // Latches
  ctx.fillStyle = '#FDE68A';
  ctx.fillRect(-w * 0.35, -h * 0.15, r * 0.2, r * 0.3);
  ctx.fillRect(w * 0.35 - r * 0.2, -h * 0.15, r * 0.2, r * 0.3);

  // Blue ₱1,000 bills popping out
  ctx.fillStyle = '#3B82F6';
  ctx.fillRect(-w * 0.2, -2, w * 0.4, 6);
  ctx.fillStyle = '#FEF08A';
  ctx.font = `bold ${Math.round(r * 0.38)}px "Fredoka", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('₱₱₱', 0, 0);
}

/**
 * "Pork Barrel" - Classic wooden pork barrel obstacle.
 */
function drawPorkBarrel(ctx: CanvasRenderingContext2D, r: number) {
  const w = r * 1.5;
  const h = r * 1.6;

  // Wooden barrel body (rich timber brown)
  ctx.fillStyle = '#854D0E';
  ctx.beginPath();
  ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Barrel metal hoops
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(0, -h * 0.25, w * 0.48, h * 0.12, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(0, h * 0.25, w * 0.48, h * 0.12, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Wood stave lines
  ctx.strokeStyle = '#583101';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -h / 2);
  ctx.lineTo(0, h / 2);
  ctx.moveTo(-w * 0.25, -h * 0.45);
  ctx.lineTo(-w * 0.25, h * 0.45);
  ctx.moveTo(w * 0.25, -h * 0.45);
  ctx.lineTo(w * 0.25, h * 0.45);
  ctx.stroke();

  // "PORK ₱" text
  ctx.fillStyle = '#FEF08A';
  ctx.font = `bold ${Math.round(r * 0.42)}px "Fredoka", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PORK ₱', 0, 0);
}
