# Contributing to tsonik

tsonik 2.x is **generated code**. Everything under `src/` (and `README.md`) is
emitted by [iconik-sdk-generator](https://github.com/NorthShoreAutomation/iconik-sdk-generator)
from iconik's published OpenAPI specs — do not edit it by hand; PRs that change
generated files will be overwritten by the next regeneration.

- **Bugs in generated code / missing endpoints** → open an issue here; the fix
  lands in the generator and flows back on regeneration.
- **CI, packaging, docs** (`.github/`, `package.json` metadata, this file) →
  PRs to this repo are welcome.
- **1.x** → the hand-written client lives on the `maintenance/1.x` branch;
  patch PRs go there.
