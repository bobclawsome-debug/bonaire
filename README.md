# Our Bonaire Trip

Trip home base: https://bobclawsome-debug.github.io/bonaire/

Everything is data-driven. Edit the JSON and push:

- `data/trip.json`: header, hotel card, TBD items, before-you-go checklist
- `data/sites.json`: every map pin (dive sites, food + ratings, services, groceries, hotel)
- `data/diving.json`: orientation, conditions, operators/prices, bring/rules/avoid
- `data/deals.json`: deals, spas, activities, saving tips, unverified notes
- `data/info.json`: getting around, money, weather, flights, safety, emergency, events

`map.html` loads `data/sites.json` at runtime. After changing pin categories/styles, run `python3 tools/build_map.py` (also regenerates `bonaire-dives.kml`).
Bump `V` in `sw.js` when shipping shell changes so installed apps refresh.

Public site: no confirmation numbers, passport info, phone numbers or emails of travelers. `noindex` is set.
