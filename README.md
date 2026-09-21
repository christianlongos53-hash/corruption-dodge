# Corruption Dodge 🇵🇭

A satirical Philippine-themed arcade dodging game built with React, TypeScript, and Vite.

## 🎮 Gameplay
- **Objective**: Dodge corrupt money obstacles raining down and avoid getting drowned by the rising flood of kickbacks.
- **Dodger Avatar**: Satirical Philippine Politician Effigy in traditional Barong Tagalog.
- **Earn Cash by Dodging**:
  - 💵 **Cash Stack**: ₱500
  - ✉️ **Bribe Envelope**: ₱1,000
  - 💼 **Gold Briefcase**: ₱1,500
  - 🛢️ **Pork Barrel**: ₱2,000
- **Country Upgrades (Nation Building)**:
  - Appear once you can afford them (₱500,000 each).
  - Touching an upgrade deducts the ₱500,000 cost, builds infrastructure, and drains the flood level by 25%!
  - Progression Stages:
    1. Muddy Rural Road (Initial)
    2. Provincial Paved Way (₱500,000)
    3. National Highway (₱1,000,000)
    4. Urban Metropolis (₱1,500,000)

## 🕹️ Controls
- **Arrow Keys / A & D**: Move left and right
- **Touch / Buttons**: On-screen touch buttons for mobile devices

## 🚀 Development & Deployment

### Local Development
```bash
npm install
npm run dev
```

### Public Local Tunnel
```bash
npm run tunnel
```

### Production Build
```bash
npm run build
npm run preview
```

### Deploy to Render
This repository includes `render.yaml` for 1-click deployment on [Render](https://render.com/) as a Static Site.

### GitHub Pages
Automatic deployment workflow is configured in `.github/workflows/deploy.yml`.
