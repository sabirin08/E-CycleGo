# ♻️ E-CycleGo

**AI-powered e-waste recycling for Georgia State University**

> Built for the Social Good Hackathon — Driving sustainable, positive impact for local communities.

---

## The Problem

The nearest e-waste disposal bin for GSU students is at **Center Parc Stadium** — a 34-minute walk, 15-20 minute bus ride, and a 10-minute car ride from the Student Center, library, and main campus buildings. No college student is busing themselves to properly dispose of a battery and other e-waste with those long travel times. So they throw it in the trash, where lithium batteries cause landfill fires and toxic chemicals like mercury leak into groundwater.

## Our Solution

**E-CycleGo GSU** is a mobile-first web app that:

1. **Scans & Identifies** — Students photograph any item they're unsure how to dispose of. Our AI (powered by Claude's vision API) identifies the item, explains *why* improper disposal is harmful, and directs them to the nearest correct bin.

2. **Maps Accessible Bins** — Shows current and proposed e-waste bin locations across campus. Students can **upvote** proposed locations, generating real data for GSU facilities management about where bins are most needed.

3. **Tracks Collective Impact** — Each bin has its own progress bar toward a monthly recycling goal. When the campus collectively hits the target, all app users earn a reward (bookstore credit, etc.). This turns recycling from an individual chore into a community challenge.

4. **Measures Personal Impact** — Students see their environmental footprint: mercury prevented from groundwater, decomposition time saved, CO₂ reduced, landfill fire risks avoided. A tier system (Green Starter → Planet Guardian) and streak tracking keep them engaged.

## Tech Stack

- **Frontend**: React 18 (mobile-first responsive design)
- **AI Vision**: Anthropic Claude API (image identification + disposal guidance)
- **Styling**: Custom CSS with GSU brand colors (Navy Blue #002856 + White)
- **Maps**: Google Maps Embed API

## Getting Started

### Prerequisites

- Node.js 16+
- An Anthropic API key ([get one here](https://console.anthropic.com))

### Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/ecotrack-gsu.git
cd ecotrack-gsu

# Install dependencies
npm install

# Create your environment file
cp .env.example .env
# Edit .env and add your Anthropic API key

# Start both the API server and React app
npm run dev
```

This runs two things simultaneously:
- **React frontend** on `http://localhost:3000`
- **API proxy server** on `http://localhost:3001` (keeps your API key secure)

### Demo on Your Phone

Once running, find your computer's local IP (e.g., `192.168.x.x`) and open `http://192.168.x.x:3000` on your phone. The camera capture will use your phone's back camera.

> **Note:** For phone testing, update the CORS origin in `server/index.js` to include your local IP, or set it to `"*"` during development.

## Features

| Feature | Description |
|---|---|
| AI Scan | Photograph any item → get instant disposal guidance |
| Campus Map | Find the nearest e-waste bin with walking distance |
| Bin Progress | See each bin's monthly goal and which bins need help |
| Upvote Bins | Vote for where new bins should be placed on campus |
| Streaks | Track your daily recycling streak |
| Tier System | Level up from Green Starter to Planet Guardian |
| Impact Stats | See your personal environmental impact in real numbers |
| Campus Goal | Collective monthly target with rewards for all users |

## Project Structure

```
ecotrack-gsu/
├── public/
│   └── index.html
├── server/
│   └── index.js           # Express proxy (keeps API key secure)
├── src/
│   ├── App.jsx             # Main app with all components
│   └── index.js            # Entry point
├── .env.example            # Environment variable template
├── .gitignore
├── package.json
└── README.md
```

## Team

🐾💙 Built by GSU Panthers, Sabirin Mohamed & Tran Le 

