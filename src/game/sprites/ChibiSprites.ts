import { CharacterId, CharacterProfile } from '../../types/game';

export const CHARACTER_PROFILES: Record<CharacterId, CharacterProfile> = {
  bico: {
    id: 'bico',
    name: 'Vivo',
    title: 'Blue Mayor',
    tagline: 'Vote Vivo! The Blue Mayor dodging corruption and floodwaters!',
    primaryColor: '#2563EB', // Blue Campaign
    secondaryColor: '#DBEAFE',
    accentColor: '#F59E0B',
    description: 'Blue Mayor'
  },
  sharah: {
    id: 'sharah',
    name: 'Sharah',
    title: 'Green Vice President',
    tagline: 'Public service with elegance! The Green Vice President!',
    primaryColor: '#059669', // Green Campaign
    secondaryColor: '#D1FAE5',
    accentColor: '#047857',
    description: 'Green Vice President'
  },
  vong: {
    id: 'vong',
    name: 'BingBong',
    title: 'Red President',
    tagline: 'Action star of the nation! The Red President with swagger!',
    primaryColor: '#DC2626', // Red Campaign
    secondaryColor: '#FEE2E2',
    accentColor: '#991B1B',
    description: 'Red President'
  },
  juan: {
    id: 'juan',
    name: 'Juan',
    title: 'Citizen',
    tagline: 'Everyday Filipino citizen! Standing strong against corruption!',
    primaryColor: '#4B5563', // Classic Gray
    secondaryColor: '#F3F4F6',
    accentColor: '#F59E0B',
    description: 'Citizen'
  }
};

/**
 * Draws a Philippine Politician Effigy character ("Dodger").
 * Features traditional Barong Tagalog, campaign sash, gold bling, slicked pompadour hair,
 * and an expressive satirical papier-mâché effigy grin.
 */
export function drawChibiCharacter(
  ctx: CanvasRenderingContext2D,
  characterId: CharacterId,
  x: number,
  y: number,
  size: number = 70,
  animTime: number = 0
) {
  ctx.save();
  ctx.translate(x, y);

  // Bobbing / breathing motion
  const bob = Math.sin(animTime * 6) * (size * 0.03);
  const breath = 1 + Math.sin(animTime * 4) * 0.02;
  ctx.translate(0, bob);
  ctx.scale(breath, 2 - breath);

  const r = size / 2;
  const profile = CHARACTER_PROFILES[characterId];

  // 1. Soft Drop Shadow
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
  ctx.beginPath();
  ctx.ellipse(0, r * 0.98, r * 0.78, r * 0.26, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. Politician Body: Traditional Barong Tagalog with Translucent Piña Fabric
  ctx.save();

  // Barong Torso (Ivory / Off-White Piña Silk)
  const barongGrad = ctx.createLinearGradient(0, r * 0.1, 0, r * 0.85);
  barongGrad.addColorStop(0, '#FAF7F0'); // Creamy silk
  barongGrad.addColorStop(0.5, '#F5EFEB');
  barongGrad.addColorStop(1, '#E8DFD8'); // Subtle hem shadow
  ctx.fillStyle = barongGrad;
  ctx.strokeStyle = '#D1C7BD';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.roundRect(-r * 0.5, r * 0.15, r * 1.0, r * 0.72, [r * 0.22, r * 0.22, r * 0.1, r * 0.1]);
  ctx.fill();
  ctx.stroke();

  // White inner Camisa de Chino collar visible beneath Barong
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(0, r * 0.22, r * 0.22, 0, Math.PI);
  ctx.fill();

  // Standing Barong Mandarin Collar
  ctx.fillStyle = '#FAF7F0';
  ctx.strokeStyle = '#D1C7BD';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(-r * 0.24, r * 0.12, r * 0.48, r * 0.14, 4);
  ctx.fill();
  ctx.stroke();

  // Traditional Pechera (U-Shaped Chest Embroidery Motif)
  ctx.strokeStyle = '#9CA3AF';
  ctx.lineWidth = 1.2;
  // Embroidery outer U-frame
  ctx.beginPath();
  ctx.roundRect(-r * 0.26, r * 0.26, r * 0.52, r * 0.45, [0, 0, 8, 8]);
  ctx.stroke();

  // Vertical Center Button Placket
  ctx.beginPath();
  ctx.moveTo(0, r * 0.22);
  ctx.lineTo(0, r * 0.75);
  ctx.stroke();

  // Tiny Mother-of-Pearl Buttons
  ctx.fillStyle = '#FFFFFF';
  for (let by = r * 0.32; by <= r * 0.68; by += r * 0.12) {
    ctx.beginPath();
    ctx.arc(0, by, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Pechera Cross-stitch filigree details
  ctx.strokeStyle = 'rgba(156, 163, 175, 0.75)';
  for (let sy = r * 0.3; sy < r * 0.68; sy += 7) {
    ctx.beginPath();
    ctx.moveTo(-r * 0.18, sy);
    ctx.lineTo(-r * 0.06, sy + 3);
    ctx.moveTo(r * 0.18, sy);
    ctx.lineTo(r * 0.06, sy + 3);
    ctx.stroke();
  }

  // Politician Campaign Sash across chest
  ctx.save();
  ctx.rotate(-0.28);
  ctx.fillStyle = profile.primaryColor;
  ctx.strokeStyle = profile.accentColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(-r * 0.35, r * 0.38, r * 0.85, r * 0.16, 3);
  ctx.fill();
  ctx.stroke();

  // Golden stars on campaign sash
  ctx.fillStyle = '#F59E0B';
  ctx.beginPath();
  ctx.arc(-r * 0.12, r * 0.46, 2.5, 0, Math.PI * 2);
  ctx.arc(r * 0.08, r * 0.46, 2.5, 0, Math.PI * 2);
  ctx.arc(r * 0.28, r * 0.46, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 3. Politician Hands with Chunky Gold Bling
  const skinTone = '#F6C8A8'; // Warm sun-kissed Filipino skin tone

  // Left Hand: Chunky Gold Rolex Politician Watch
  ctx.fillStyle = skinTone;
  ctx.beginPath();
  ctx.arc(-r * 0.46, r * 0.52, r * 0.13, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#F59E0B'; // Gold watch casing
  ctx.strokeStyle = '#B45309';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(-r * 0.46, r * 0.52, r * 0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Right Hand: Chunky Gold Signet Ring
  ctx.fillStyle = skinTone;
  ctx.beginPath();
  ctx.arc(r * 0.46, r * 0.52, r * 0.13, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#F59E0B'; // Gold ring band
  ctx.beginPath();
  ctx.arc(r * 0.46, r * 0.5, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#DC2626'; // Ruby stone
  ctx.fillRect(r * 0.46 - 1.5, r * 0.5 - 1.5, 3, 3);

  ctx.restore();

  // 4. Politician Effigy Head: Exaggerated Papier-Mâché Caricature Features
  ctx.save();

  // Effigy Head (Chubby round face with prominent sculpted politician cheeks & double chin)
  ctx.fillStyle = skinTone;
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 1.5;

  // Double chin / jaw contour
  ctx.beginPath();
  ctx.ellipse(0, r * 0.12, r * 0.38, r * 0.18, 0, 0, Math.PI * 2);
  ctx.fill();

  // Main Head
  ctx.beginPath();
  ctx.ellipse(0, -r * 0.12, r * 0.65, r * 0.58, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Sculpted Effigy Cheeks (Rosy comical blush)
  ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
  ctx.beginPath();
  ctx.ellipse(-r * 0.38, r * 0.02, r * 0.16, r * 0.11, 0, 0, Math.PI * 2);
  ctx.ellipse(r * 0.38, r * 0.02, r * 0.16, r * 0.11, 0, 0, Math.PI * 2);
  ctx.fill();

  // 5. Hair: Iconic Politician Slicked Pompadour & Styles
  drawPoliticianHair(ctx, characterId, r);

  // 6. Expressive Politician Eyes & Eyebrows
  drawPoliticianEyes(ctx, characterId, r);

  // 7. Iconic Politician Nose (Sculpted Filipino nose)
  ctx.fillStyle = 'rgba(217, 119, 6, 0.4)';
  ctx.beginPath();
  ctx.ellipse(0, -r * 0.02, r * 0.12, r * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();
  // Nostril curves
  ctx.strokeStyle = '#92400E';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(-r * 0.06, -r * 0.01, 3, 0.8 * Math.PI, 1.8 * Math.PI);
  ctx.arc(r * 0.06, -r * 0.01, 3, 1.2 * Math.PI, 2.2 * Math.PI);
  ctx.stroke();

  // 8. Million-Dollar Campaign Smirk / Effigy Grin
  drawPoliticianSmile(ctx, r);

  ctx.restore();

  ctx.restore();
}

/**
 * Draws the slicked-back politician pompadour or styled bouffant with effigy flair.
 */
function drawPoliticianHair(ctx: CanvasRenderingContext2D, characterId: CharacterId, r: number) {
  ctx.save();

  if (characterId === 'sharah') {
    // Governor Dodger: Elegant politician bouffant hair with emerald hairclip
    ctx.fillStyle = '#3E1F13';
    ctx.beginPath();
    ctx.arc(0, -r * 0.28, r * 0.68, Math.PI * 0.8, Math.PI * 2.2);
    ctx.fill();

    // Volume top
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.55, r * 0.55, r * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();

    // Emerald politician hair clip
    ctx.fillStyle = '#059669';
    ctx.fillRect(-r * 0.55, -r * 0.45, r * 0.18, 6);
  } else if (characterId === 'juan') {
    // Congressman Dodger: Veteran statesman slicked hair with silver temples
    ctx.fillStyle = '#1F2937';
    ctx.beginPath();
    ctx.arc(0, -r * 0.25, r * 0.68, Math.PI * 0.82, Math.PI * 2.18);
    ctx.fill();

    // Silver grey statesman streaks
    ctx.strokeStyle = '#9CA3AF';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-r * 0.5, -r * 0.25);
    ctx.quadraticCurveTo(-r * 0.35, -r * 0.55, 0, -r * 0.6);
    ctx.moveTo(r * 0.5, -r * 0.25);
    ctx.quadraticCurveTo(r * 0.35, -r * 0.55, 0, -r * 0.6);
    ctx.stroke();
  } else {
    // Senator (Blue) & Mayor (Red): The Classic Greased Politician Pompadour
    ctx.fillStyle = '#111827'; // Jet black hair
    // Back hair
    ctx.beginPath();
    ctx.arc(0, -r * 0.22, r * 0.68, Math.PI * 0.8, Math.PI * 2.2);
    ctx.fill();

    // Massive puffy pompadour quiff (Effigy exaggeration!)
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.58, r * 0.58, r * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pomade glossy sheen highlight streak
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, -r * 0.58, r * 0.42, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();

    // Clean sideburns
    ctx.fillStyle = '#111827';
    ctx.fillRect(-r * 0.62, -r * 0.25, r * 0.12, r * 0.25);
    ctx.fillRect(r * 0.5, -r * 0.25, r * 0.12, r * 0.25);
  }

  ctx.restore();
}

/**
 * Draws expressive politician eyes: aviator shades for Mayor, gold glasses for Governor,
 * and charismatic smiling eyes with star glints for Senator & Congressman.
 */
function drawPoliticianEyes(ctx: CanvasRenderingContext2D, characterId: CharacterId, r: number) {
  ctx.save();

  const eyeY = -r * 0.14;
  const eyeSpacing = r * 0.28;

  // Thick Politician Eyebrows (Arched & charismatic)
  ctx.fillStyle = '#111827';
  ctx.beginPath();
  // Left eyebrow
  ctx.roundRect(-eyeSpacing - r * 0.15, eyeY - r * 0.16, r * 0.32, 5, 2);
  // Right eyebrow
  ctx.roundRect(eyeSpacing - r * 0.17, eyeY - r * 0.16, r * 0.32, 5, 2);
  ctx.fill();

  if (characterId === 'vong') {
    // Mayor Dodger: Classic Politician Aviator Sunglasses (The Action-Star Trapo look!)
    ctx.fillStyle = '#0F172A';
    ctx.strokeStyle = '#F59E0B'; // Gold aviator frames
    ctx.lineWidth = 2.5;

    // Left teardrop lens
    ctx.beginPath();
    ctx.roundRect(-eyeSpacing - r * 0.18, eyeY - r * 0.1, r * 0.36, r * 0.28, [4, 4, 14, 14]);
    ctx.fill();
    ctx.stroke();

    // Right teardrop lens
    ctx.beginPath();
    ctx.roundRect(eyeSpacing - r * 0.18, eyeY - r * 0.1, r * 0.36, r * 0.28, [4, 4, 14, 14]);
    ctx.fill();
    ctx.stroke();

    // Aviator bridge bar
    ctx.beginPath();
    ctx.moveTo(-eyeSpacing + r * 0.18, eyeY - r * 0.05);
    ctx.lineTo(eyeSpacing - r * 0.18, eyeY - r * 0.05);
    ctx.moveTo(-eyeSpacing + r * 0.18, eyeY - r * 0.1);
    ctx.lineTo(eyeSpacing - r * 0.18, eyeY - r * 0.1);
    ctx.stroke();

    // Sunglasses diagonal reflection shine
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    ctx.moveTo(-eyeSpacing - r * 0.1, eyeY + r * 0.15);
    ctx.lineTo(-eyeSpacing + r * 0.05, eyeY - r * 0.08);
    ctx.lineTo(-eyeSpacing + r * 0.12, eyeY - r * 0.08);
    ctx.lineTo(-eyeSpacing - r * 0.03, eyeY + r * 0.15);
    ctx.closePath();
    ctx.fill();
  } else {
    // Charismatic smiling eyes with white highlights
    const eyeR = r * 0.11;
    ctx.fillStyle = '#111827';
    ctx.beginPath();
    ctx.arc(-eyeSpacing, eyeY, eyeR, 0, Math.PI * 2);
    ctx.arc(eyeSpacing, eyeY, eyeR, 0, Math.PI * 2);
    ctx.fill();

    // Big gleaming campaign glint
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-eyeSpacing - 3, eyeY - 3, 3.5, 0, Math.PI * 2);
    ctx.arc(eyeSpacing - 3, eyeY - 3, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Governor Dodger: Gold-rimmed glasses
    if (characterId === 'sharah') {
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.roundRect(-eyeSpacing - r * 0.15, eyeY - r * 0.12, r * 0.32, r * 0.24, 6);
      ctx.roundRect(eyeSpacing - r * 0.17, eyeY - r * 0.12, r * 0.32, r * 0.24, 6);
      ctx.stroke();
      // Bridge
      ctx.beginPath();
      ctx.moveTo(-eyeSpacing + r * 0.17, eyeY);
      ctx.lineTo(eyeSpacing - r * 0.17, eyeY);
      ctx.stroke();
    }
  }

  ctx.restore();
}

/**
 * Draws a wide, toothy, gleaming politician effigy campaign smile.
 */
function drawPoliticianSmile(ctx: CanvasRenderingContext2D, r: number) {
  ctx.save();

  const mouthY = r * 0.15;
  const mouthW = r * 0.34;
  const mouthH = r * 0.18;

  // Mouth cavity (deep red)
  ctx.fillStyle = '#831843';
  ctx.strokeStyle = '#833824';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.ellipse(0, mouthY, mouthW, mouthH, 0, 0, Math.PI);
  ctx.fill();
  ctx.stroke();

  // Sparkling white politician teeth
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.rect(-mouthW * 0.85, mouthY, mouthW * 1.7, mouthH * 0.55);
  ctx.fill();

  // Tooth division line
  ctx.strokeStyle = '#E5E7EB';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(0, mouthY);
  ctx.lineTo(0, mouthY + mouthH * 0.55);
  ctx.moveTo(-mouthW * 0.42, mouthY);
  ctx.lineTo(-mouthW * 0.42, mouthY + mouthH * 0.55);
  ctx.moveTo(mouthW * 0.42, mouthY);
  ctx.lineTo(mouthW * 0.42, mouthY + mouthH * 0.55);
  ctx.stroke();

  // Sparkle glint on teeth!
  ctx.fillStyle = '#FEF08A';
  ctx.beginPath();
  ctx.arc(-mouthW * 0.4, mouthY + 2, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Generates a high-res data URL of a chibi avatar for UI components.
 */
export function getChibiAvatarDataUrl(characterId: CharacterId, size: number = 128): string {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  drawChibiCharacter(ctx, characterId, size / 2, size / 2, size * 0.72, 0);
  return canvas.toDataURL('image/png');
}
