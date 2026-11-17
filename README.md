# History Guesser

You're shown the world's borders in some year between AD 1 and 2024. Guess the year.

```sh
npm install
npm run dev
```

## How it works
- `src/App.jsx`: game flow (menu → 5 rounds → summary), scoring display and data credits
- `src/MapView.jsx`: draws the borders with d3-geo, with pan/zoom and a name label on every territory
- `src/Timeline.jsx`: non-linear year slider (more room for recent centuries)
- `src/game.js`: regions, year picking (any year; two rounds in three from 1700 on), scoring (`5000·e^(−yearsOff / tolerance)`, more forgiving for older maps) and timeline mapping
- `src/owners.js`: colours, so colonies and fiefs share their empire's colour and neighbours never look alike
- `src/chunks.js`: how the border data is split into files, and the years where sources and flags start
- `src/cities.js`: the cities on the map, with the name each had at the time (Byzantium → Constantinople → Istanbul) and how far you must zoom in to see them
- `src/MapViewer.jsx`: dev-only map viewer (`?viewer`): type a year, see its map
- `public/flags/`: flag thumbnails and `index.json` (which territory flies which flag in which years)
- `public/data/<start>.json`: border data (TopoJSON), one file per century before 1700 and per 25 years after (2000.json is OpenHistoricalMap's)

While running `npm run dev`, add `?year=1815` to the URL to make the first round that year.

## Data
Borders up to 1999 come from [Cliopatria](https://github.com/Seshat-Global-History-Databank/cliopatria) (Seshat Global History Databank), licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/): free to use commercially, as long as the game credits it (the menu does) and says it was changed (simplified and recoloured). Each territory has the years it existed, so any year can be shown.

From 2000 on they come from [OpenHistoricalMap](https://www.openhistoricalmap.org) (CC0, no conditions), which dates modern changes exactly: Montenegro 2006, Kosovo 2008, South Sudan 2011, Crimea 2014, Eswatini 2018, North Macedonia 2019, Türkiye 2022. Each year shows the map as it stood at the end of that year. Where two countries claim the same land, the one with the newer borders is drawn on top (Russia over Crimea from 2014).

Coastlines come from Natural Earth 1:50m (public domain) via `world-atlas`, and the territories are clipped to them so the shores look like a real map.

To rebuild the border data (each downloads its source into `data-src/` on first run):
```sh
npm run data:history   # Cliopatria, AD 1–1999
npm run data:modern    # OpenHistoricalMap, 2000–2024 (public/data/2000.json)
npm run data:flags     # flags, from the two above (public/flags/)
```
The Cliopatria script corrects a few outdated names in its newest rows (see `RENAMES`) and applies the historical corrections in `scripts/history-fixes/`: one file per era for wrong or anachronistic names, states that last too long, wrong empires and pieces stuck in the wrong country, and `borders-*.mjs` / `restores.mjs` for borders the source gets wrong or lacks (US expansion, New France, the Mongol khanates, countries it merges into a neighbour), redrawn from other years' shapes or hand-drawn outlines (see `scripts/history-fixes.mjs` for the format). `node scripts/check-fixes.mjs` tries fixes out without rebuilding. The OHM script applies `scripts/history-fixes/modern.mjs` the same way: breakaway states and Russia's occupation of Ukraine; the OHM one skips a few bogus test entries, fills two date gaps and gives overseas territories their ruler's colour (see `SKIP`, `DATES`, `RULERS`). Where the switch happens is `OHM_FROM` in `src/chunks.js`.

## Flags
From 1500 on, countries show their flag next to their name. Run `npm run data:flags` after rebuilding the border data. For each territory and year it takes the first of:
1. a hand-checked timeline in `scripts/flag-table.mjs` (`NAME_FLAGS`),
2. the timeline of the big power it is (`POWER_FLAGS`: England → Great Britain → United Kingdom, …),
3. its Wikidata flag for that year, if Wikidata dates it (undated flags only for states founded after 1945, since an undated flag is usually today's),
4. its ruling power's flag, for colonies.

Only images that Wikimedia Commons marks public domain or CC0 are used; the rest (often share-alike redrawings) are skipped and listed in `data-src/flags-report.txt`, together with every territory's flags, for checking. Nazi-era flags are never shown (`BLOCKED_FILES`). States with no real national flag (Ming China, the Mughals) get none. Wrong flags are fixed by adding a line to `NAME_FLAGS`.

## Cities
`src/cities.js` is hand-written: about 245 cities with their location, the years they existed and the name in use in each period. Each name has a rank: 1 shows on the world map, 2 and 3 as you zoom in. City names never cover country names; they're placed around the dot wherever there's room.

When you pick a region (Europe, Asia, …), only the territories inside it are coloured and the rest of the world stays blank. The region shapes in `public/regions/<key>.json` are built from Natural Earth's 1:50m countries with:
```sh
node scripts/build-regions.mjs
```
