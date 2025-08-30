# NOVA — Integrated Build (Dark)
This package includes the integrated NOVA flow with:
- Intro screen + audio (press **Start** to comply with autoplay policies)
- Traits grid (renders any number from `traits.json`)
- Report view with chosen traits
- Email capture (Formspree)
- PayHip button to the Purpose Book
- PDF export (html2canvas + jsPDF)
- Print‑friendly light stylesheet

## Quick Start
1. Place your intro audio at `assets/intro.mp3` (MP3 recommended).
2. Update `traits.json` with your canonical 50 traits (array of strings).
3. If needed, change Formspree endpoint in `index.html` (`/f/mpwlvjog`).
4. Open `index.html` locally or deploy via GitHub → Vercel.

## Notes
- **Autoplay:** Browsers block autoplay; we start audio on the **Start** button press, then navigate into Traits.
- **Traits Not Showing?** Ensure `traits.json` is valid JSON and hosted (no caching). The grid renders dynamically from the file.
- **PDF:** Uses CDNs for `html2canvas` and `jspdf`.
