# SPARKS Crosswalk

Build artifacts for **SPARKS (Sports Property and Reference Knowledge System)** — an open registry of sports properties (sports, leagues, franchises, and venues) and the identifiers that external data providers use for them.

> [!IMPORTANT]
> **This repository is generated. Do not edit it by hand.**
>
> The source of truth is [sparks-crosswalk-data](https://github.com/statsvine/sparks-crosswalk-data). Corrections and additions belong there — everything in `dist/` here is overwritten on the next build.

## What's here

`dist/` holds the crosswalk data in a range of consumable formats, rebuilt automatically whenever the source data changes. Per dataset (`sports`, `leagues`, `franchises`, `venues`):

| Path | Contents |
| --- | --- |
| `dist/<name>/<name>.csv` | Flat CSV, same shape as the source |
| `dist/<name>/<name>.json` | Array of records, indented |
| `dist/<name>/<name>.min.json` | Array of records, minified |
| `dist/<name>/<name>.ndjson` | One JSON record per line |
| `dist/<name>/by_field/<name>.<field>.json` | Lookup map keyed on that field |
| `dist/<name>/by_field/<name>.<field>.min.json` | The same, minified |

The `by_field` maps are the useful part for reconciliation: to go from an ESPN venue id to a SPARKS record, read `dist/venues/by_field/venues.espn_id.json` and index straight into it. Fields declared `unique` in the schema map to a single record; the rest map to a list.

## How it's built

```
sparks-crosswalk-data     hand-edited CSV + schema
        │  push to main touching data/ or schema/
        │  → repository_dispatch "crosswalk-data-updated"
        ▼
sparks-crosswalk          this repo — validates, rebuilds dist/, commits it
        │
        ▼
   pages branch           Astro site serving dist/ as read-only JSON endpoints
```

`build_exports.yml` clones the data repo and [sparks-tools](https://github.com/statsvine/sparks-tools), revalidates every dataset against its schema, then runs `tools/crosswalk/build_crosswalk_dist.py`. The build is entirely schema-driven — it derives the output fields and the `by_field` maps from the schema files, so new fields in the source appear here with no change to this repo.

`build_pages.yml` then deploys the Astro site on the `pages` branch, which serves `dist/` as static JSON endpoints.

## Design goals

- **Single source of truth** — this repo consumes only `sparks-crosswalk-data`.
- **Separation of concerns** — keeping generated artifacts out of the source repo keeps history and blame on the data readable.
- **Reproducible** — every file here can be regenerated from the source repo at any commit.

## Reporting problems

- **Wrong or missing data** → open an issue on [sparks-crosswalk-data](https://github.com/statsvine/sparks-crosswalk-data).
- **Build or output-format bugs** → the build scripts live in [sparks-tools](https://github.com/statsvine/sparks-tools); issues and improvements to code should generally be raised there.

## Attribution

See [ATTRIBUTION.md](ATTRIBUTION.md).

## License

- Data and schemas are licensed under the [Open Data Commons Attribution License (ODC-By 1.0)](https://opendatacommons.org/licenses/by/1-0/).
- Any code is licensed under MIT.
