# ♻️ E-CycleGo 

**AI-powered e-waste recycling for Georgia State University**

> Built for Hacklanta 2026 🎰 — Cox Enterprises House Pick: SOCIAL GOOD — Build an AI-powered solution that drives sustainable, positive impact for local communities and the world around us.

**Live Demo:** [e-cycle-go.vercel.app](https://e-cycle-go.vercel.app)

---

## The Problem

The nearest e-waste disposal bin for GSU students is at **Center Parc Stadium** — a 34-minute walk, 15-20 minute bus ride, and a 10-minute car ride from the Student Center, library, and main campus buildings. No college student is busing themselves to properly dispose of a battery and other e-waste with those long travel times. So they throw it in the trash, where lithium batteries cause landfill fires and toxic chemicals like mercury leak into groundwater.

## Our Solution

**E-CycleGo** is a mobile-first web app that:

1. **Scans & Identifies** — Students photograph any item they're unsure how to dispose of. Our AI (powered by Claude's vision API) identifies the item, explains *why* improper disposal is harmful, and directs them to the nearest correct bin.

2. **Maps Accessible Bins** — Shows current and proposed e-waste bin locations across campus with an interactive Google Maps view. Students can **upvote** proposed locations, generating real data for GSU facilities management about where bins are most needed.

3. **Tracks Collective Impact** — Each bin has its own progress bar toward a monthly recycling goal. When the campus collectively hits the target, all app users earn a reward (bookstore credit, etc.). This turns recycling from an individual chore into a community challenge.

4. **Measures Personal Impact** — Students see their environmental footprint: mercury prevented from groundwater, decomposition time saved, CO₂ reduced, landfill fire risks avoided. A tier system (Green Starter → Planet Guardian) and streak tracking keep them engaged.

5. **Trash Talk & Guilt Trip** — A fun bonus feature: the app roasts users for improper disposal and shows dramatic timelines of how long items take to decompose. Built for the Most Useless/Funny Feature prize.


## Tech Stack

- **Frontend:** React 18 (mobile-first responsive design)
- **AI Vision:** Anthropic Claude API (image identification + disposal guidance)
- **Backend:** Express.js proxy server / Vercel Serverless Functions
- **Styling:** Custom CSS with GSU brand colors (Navy Blue #002856 + White)
- **Maps:** Google Maps Static API with colored bin markers
- **Deployment:** Vercel

## Features

| Feature | Description |
|---|---|
| AI Scan | Photograph any item → get instant AI-powered disposal guidance |
| Campus Map | Interactive Google Maps with colored pins for each bin location |
| Bin Progress | See each bin's monthly goal and which bins need help |
| Upvote Bins | Vote for where new bins should be placed on campus |
| Streaks | Track your daily recycling streak |
| Tier System | Level up from Green Starter to Planet Guardian |
| Impact Stats | See your personal environmental impact in real numbers |
| Campus Goal | Collective monthly target with rewards for all users |
| Trash Talk | AI roasts you for your recycling habits |
| Guilt Trip | Dramatic countdown showing how long your item will outlive you |

## Getting Started

### Prerequisites

- Node.js 16+
- An Anthropic API key ([get one here](https://console.anthropic.com))
- A Google Maps API key ([get one here](https://console.cloud.google.com))

### Local Development

```bash
# Clone the repo
git clone https://github.com/sabirin08/E-CycleGo.git
cd E-CycleGo

# Install dependencies
npm install

# Create your environment file
nano .env
# Add your keys:
# ANTHROPIC_API_KEY=your-key-here
# REACT_APP_GOOGLE_MAPS_KEY=your-google-key-here

# Start both the API server and React app
npm run dev
```

This runs:
- **React frontend** on `http://localhost:3000`
- **Express API server** on `http://localhost:3001`

### Live Deployment

The app is deployed on Vercel at [e-cycle-go.vercel.app](https://e-cycle-go.vercel.app). The API runs as a Vercel serverless function.

## Project Structure

```
E-CycleGo/
├── api/
│   └── scan.js             # Vercel serverless function for AI scan
├── public/
│   └── index.html
├── server/
│   └── index.js            # Express proxy for local development
├── src/
│   ├── App.jsx             # Main app with all components
│   └── index.js            # Entry point
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
└── vercel.json             # Vercel deployment config
```

## Team

🐾💙 Built by GSU Panthers, Sabirin Mohamed & Tran Le 

