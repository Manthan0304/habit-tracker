# Habit Tracker Backend (Node.js)

This file documents the Node.js (Express) backend that mirrors the original Python API. The endpoints and port (5000) are unchanged so your frontend should keep working without modification.

## Quick Start (Node.js)

From the `backend` directory:

```powershell
npm install
npm start
```

Server runs on `http://localhost:5000`.

## API Routes (unchanged)

- `GET /api/habits`
- `POST /api/habits`
- `GET /api/habits/:id`
- `PUT /api/habits/:id`
- `DELETE /api/habits/:id`
- `POST /api/habits/:id/check-in`
- `POST /api/habits/:id/undo-check-in`

## Files

- `server.js` - Node.js Express server
- `package.json` - Node manifest
- `data.json` - JSON data file (existing)

