# ESG-NSS Platform

## Local Development

1. Copy `.env.example` to `.env` and set secure JWT secrets.
2. Start MongoDB locally or through Docker.
3. Install dependencies with `npm install`.
4. Seed platform defaults with `npm run seed`.
5. Run the full stack with `npm run dev`.

Frontend: `http://localhost:5173`
API: `http://localhost:5000/api`

## Production

Build the frontend with:

```bash
npm run build
```

Start the production Express server with:

```bash
npm start
```

The production server exposes REST APIs under `/api` and serves the built Vite app from `dist`.

## Docker

```bash
docker compose up --build
```

The compose stack runs MongoDB and the ESG-NSS application on `http://localhost:5000`.

## Verification

The current implementation was verified with:

```bash
npm run lint
npm run build
npm audit --omit=dev
```
