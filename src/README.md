# Flexyn

A personal fitness companion app for tracking workouts, nutrition, and body metrics.

## ⚠️ Architecture: the data-access seam

This app is being prepared for migration off Base44 to a long-term
mobile platform. **All data access must go through `src/lib/data/*`** —
never call `base44.entities.X`, `base44.auth.X`, or
`base44.functions.invoke` directly from components or pages.

The data layer is the migration seam: on platform migration, only files
in `src/lib/data/` need to be rewritten. Everything else (pages,
components, business logic) is platform-agnostic.

See [`BACKEND_CONTRACT.md`](./BACKEND_CONTRACT.md) for:
- The complete entity / field schema
- Required server functions and atomicity guarantees
- The migration log (legacy direct call sites being incrementally migrated)
- AI-agent instructions (read this if you're an AI writing code here)

An ESLint rule fails the build on direct `base44.*` access outside the
data layer — if you see that error, the fix is to use or extend the
appropriate `src/lib/data/<entity>.js` module.

## Getting started

Clone the repo and install dependencies:

```bash
npm install
npm run dev
``