# History Guesser

You're shown the world's borders at some moment between 3000 BC and AD 2010. Guess the year.

```sh
npm install
npm run dev
```

## How it works
- `src/App.jsx`: game flow (menu → 5 rounds → summary), hints, and scoring display
- `src/MapView.jsx`: draws the borders with d3-geo, with pan/zoom and labels on reveal
- `src/Timeline.jsx`: non-linear year slider (more room for recent centuries)
- `src/game.js`: regions, scoring (`5000·e^(−yearsOff / tolerance)`, more forgiving for older maps), and timeline mapping
- `public/data/<year>.json`: simplified border snapshots, one per year

## Data
Borders come from [historical-basemaps](https://github.com/aourednik/historical-basemaps) by A. Ourednik (GPL-3.0). They were simplified with mapshaper, and then `scripts/rewind.mjs` fixed the polygon winding for d3. Land outlines come from Natural Earth via `world-atlas`.

To add or regenerate a year, download `world_<year>.geojson` and run:
```sh
npx mapshaper -i world_1914.geojson -clean -filter-fields NAME,SUBJECTO -simplify 8% keep-shapes \
  -o public/data/1914.json format=geojson precision=0.01
node scripts/rewind.mjs
```
Then add the year to `src/years.json`.
