# History Guesser

You're shown the world's borders at some moment between AD 1 and 2010. Guess the year.

```sh
npm install
npm run dev
```

## How it works
- `src/App.jsx`: game flow (menu → 5 rounds → summary) and scoring display
- `src/MapView.jsx`: draws the borders with d3-geo, with pan/zoom and a name label on every polity
- `src/Timeline.jsx`: non-linear year slider (more room for recent centuries)
- `src/game.js`: regions, scoring (`5000·e^(−yearsOff / tolerance)`, more forgiving for older maps), and timeline mapping
- `public/data/<year>.json`: border snapshots (TopoJSON), one per year

## Data
Borders come from [historical-basemaps](https://github.com/aourednik/historical-basemaps) by A. Ourednik (GPL-3.0). They're lightly simplified with mapshaper and stored as TopoJSON; polygon winding is fixed for d3 when a year loads. Coastlines come from Natural Earth 1:50m via `world-atlas`, and the polities are clipped to them so the shores look like a real map.

To add or regenerate a year, download `world_<year>.geojson` and run:
```sh
npx mapshaper -i world_1914.geojson -clean -filter-fields NAME,SUBJECTO -rename-layers borders \
  -simplify 60% keep-shapes -o public/data/1914.json format=topojson quantization=100000
```
Then add the year to `src/years.json`.

When you pick a region (Europe, Asia, …), only the polities inside it are coloured and the rest of the world stays blank. The region shapes in `public/regions/<key>.json` are built from Natural Earth's 1:50m countries with:
```sh
node scripts/build-regions.mjs
```

Some places are unnamed in the source data (Switzerland in 1994/2010, Crete in 1914, many islands). After regenerating a year, fill them in with:
```sh
node scripts/fill-names.mjs
```
From 1945 on it uses the modern country's name. Before that it only fills islands and detached pieces, giving them the name and ruler of the nearest polity on that map.

Then tag the peoples, tribes and archaeological cultures (e.g. "Amazon hunter-gatherers", "Comanche"), which the map draws without colour or borders so only real states stand out:
```sh
node scripts/mark-peoples.mjs
```
