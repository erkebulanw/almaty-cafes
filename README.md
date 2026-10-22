# Almaty Cafés — React SPA (Midterm Project)

A single page application for browsing cafés in Almaty. Built with React 18, Vite and React Router.

## Features
- Simulated async API (`src/api/cafeApi.js`): Promises, random delays, JSON, `localStorage`; 120 initial records
- List view and detail view (`/` and `/cafe/:id`)
- Controlled form to add a café (with validation)
- Debounced search, filters (district, type), sorting, pagination
- Loading, error (with retry), empty and success states
- `useEffect` with correct dependencies, cleanup and `AbortController`
- Stable keys, immutable state updates, no direct DOM manipulation

## Run locally
npm install
npm run dev

## Build
npm run build

## Deploy
Deployed on Vercel. Live demo: almaty-cafes-7xycomu1z-erkebulan.vercel.app