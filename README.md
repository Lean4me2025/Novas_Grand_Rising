# Novas Grand Rising — Nova (Full Dev + Production)

This is a **static** front-end build designed for deployment on Vercel (no build step).

## Features
- Welcome screen with **voice intro** (Web Speech synthesis; no external audio files required)
- Manual **Begin** button to ensure stable load
- **50-trait** selection grid with smooth interactions
- **Report** screen with personalized insights
- **Download PDF** (opens print dialog so users can save as PDF) and **Export .txt** as fallback
- **Email capture** (client-side only demonstration; saves to `localStorage`)
- **Payhip** link placeholder (set your product link in `script.js`)
- Fully static — just drag-drop to GitHub and deploy with Vercel

## Local Development
Open `index.html` in a browser. No server required.

## Deploy on Vercel
- Framework: **Other**
- Build Command: *(leave empty)*
- Output directory: *(root)*

## Customize
- Update trait list and descriptions in `script.js` (TRAITS array).
- Set `PAYHIP_URL` in `script.js`.
- Tweak colors/fonts in `styles.css`.
