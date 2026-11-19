# History Guesser

You're shown the world's borders in some year between AD 1 and 2024. Guess the year, and from 1800 on the month too.

```sh
npm install
npm run dev
```

## How it works
- `src/App.jsx`: game flow (menu → 5 rounds → summary), scoring display and data credits
- `src/MapView.jsx`: draws the borders with d3-geo, with pan/zoom and a name label on every territory
- `src/Timeline.jsx`: non-linear year slider (more room for recent centuries)
- `src/game.js`: regions, round picking (any year, about 72% from 1800 on; from 1800 each round is a month), scoring (`5000·e^(−yearsOff / tolerance)`, more forgiving for older maps; rounds with a month keep 500 of that for a month guess within 3 months) and timeline mapping
- `src/dates.js`: months: border rows carry `FromMonth`/`ToMonth` beside their years, and a month's map is the borders at the end of that month
- `src/owners.js`: colours, so colonies and fiefs share their empire's colour and neighbours never look alike
- `src/chunks.js`: how the border data is split into files, and the years where sources and flags start
- `src/cities.js`: the cities on the map, with the name each had at the time (Byzantium → Constantinople → Istanbul), when each was a capital (drawn as a star) and how far you must zoom in to see them
- `src/MapViewer.jsx`: dev-only map viewer (`?viewer`): type a year (and from 1800 pick a month), see its map
- `public/flags/`: flag thumbnails and `index.json` (which territory flies which flag in which years)
- `public/data/<start>.json`: border data (TopoJSON), one file per century before 1700 and per 25 years after (2000.json is OpenHistoricalMap's)

While running `npm run dev`, add `?year=1815` (or `?year=1991-12`) to the URL to make the first round that date.

## Data
Borders up to 1999 come from [Cliopatria](https://github.com/Seshat-Global-History-Databank/cliopatria) (Seshat Global History Databank), licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/): free to use commercially, as long as the game credits it (the menu does) and says it was changed (simplified and recoloured). Each territory has the years it existed, so any year can be shown.

From 2000 on they come from [OpenHistoricalMap](https://www.openhistoricalmap.org) (CC0, no conditions), which dates modern changes to the day: Montenegro June 2006, Kosovo February 2008, South Sudan July 2011, Crimea March 2014, Eswatini 2018, North Macedonia 2019, Türkiye 2022. Each month shows the map as it stood at the end of that month. Where two countries claim the same land, the one with the newer borders is drawn on top (Russia over Crimea from 2014).

Coastlines come from Natural Earth 1:50m (public domain) via `world-atlas`, and the territories are clipped to them so the shores look like a real map.

To rebuild the border data (each downloads its source into `data-src/` on first run):
```sh
npm run data:history   # Cliopatria, AD 1–1999
npm run data:modern    # OpenHistoricalMap, 2000–2024 (public/data/2000.json)
npm run data:flags     # flags, from the two above (public/flags/)
```
The Cliopatria script corrects a few outdated names in its newest rows (see `RENAMES`) and applies the historical corrections in `scripts/history-fixes/`: one file per era for wrong or anachronistic names, states that last too long, wrong empires and pieces stuck in the wrong country, and `borders-*.mjs` / `restores.mjs` for borders the source gets wrong or lacks (US expansion, New France, the Mongol khanates, countries it merges into a neighbour), redrawn from other years' shapes or hand-drawn outlines (see `scripts/history-fixes.mjs` for the format). `node scripts/check-fixes.mjs` tries fixes out without rebuilding. The OHM script applies `scripts/history-fixes/modern.mjs` the same way: breakaway states and Russia's occupation of Ukraine; the OHM one skips a few bogus test entries, fills two date gaps and gives overseas territories their ruler's colour (see `SKIP`, `DATES`, `RULERS`). Where the switch happens is `OHM_FROM` in `src/chunks.js`.

## Months
From 1800 on, rounds are played to the month. OpenHistoricalMap (2000 on) has the dates already. Cliopatria only has years, so `scripts/month-dates.mjs` dates its border changes from 1800 to 1999 afterwards, from two sources:
1. `scripts/history-fixes/months.mjs`, a hand-written list of about 200 dated events (Congress of Vienna June 1815, German Empire January 1871, Austria-Hungary's breakup November 1918, USSR dissolved December 1991, …), each with a box on the map where the change happened;
2. OpenHistoricalMap's start and end dates for the same state, matched by Wikidata ID (`data-src/ohm-dates.json`, downloaded on first run).

Each event moves the rows covering its box, the rows on the other side of the change that share land with them, and every other row of those states at that change, so nothing is drawn twice or left blank in between. The build log lists each event and what it moved. Changes no event reaches still happen in January.

## Flags
From 1500 on, countries show their flag next to their name. Run `npm run data:flags` after rebuilding the border data. For each territory and year it takes the first of:
1. a hand-checked timeline in `scripts/flag-table.mjs` (`NAME_FLAGS`),
2. the timeline of the big power it is (`POWER_FLAGS`: England → Great Britain → United Kingdom, …),
3. its Wikidata flag for that year, if Wikidata dates it (undated flags only for states founded after 1945, since an undated flag is usually today's),
4. its ruling power's flag, for colonies.

Only images that Wikimedia Commons marks public domain or CC0 are used; the rest (often share-alike redrawings) are skipped and listed in `data-src/flags-report.txt`, together with every territory's flags, for checking. Nazi-era flags are never shown (`BLOCKED_FILES`). States with no real national flag (Ming China, the Mughals) get none. Wrong flags are fixed by adding a line to `NAME_FLAGS`.

## Cities
`src/cities.js` is hand-written: about 810 cities with their location, the years they existed, the name in use in each period and when each was a capital: a national capital (a 5th `true` in the span, drawn as a red star) or the seat of a colony or other dependent territory (`'colony'`, a hollow star: Calcutta until 1911, Spanish Town, Hanoi for French Indochina). Every national capital from 1800 on is there. Each name has a rank: 1 shows on the world map, 2 and 3 as you zoom in. City names never cover country names; they're placed around the dot wherever there's room.

When you pick a region (Europe, Asia, …), only the territories inside it are coloured and the rest of the world stays blank. The region shapes in `public/regions/<key>.json` are built from Natural Earth's 1:50m countries with:
```sh
node scripts/build-regions.mjs
```
