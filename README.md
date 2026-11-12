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
Deployed on Vercel. Live demo: [almaty-cafes-7xycomu1z-erkebulan.vercel.app](https://almaty-cafes-7xycomu1z-erkebulan.vercel.app/#/)
## Authentication (Firebase)

The app uses Firebase Authentication with two providers: **Email/Password** and **Google**.

- `/login` – email/password login and Google sign-in
- `/signup` – registration with email, password, confirm password and validation
- `/profile` – protected page showing the user's email and UID, with logout. Unauthenticated users are redirected to `/login`.
- The navbar shows Login/Signup for guests and Profile/Logout for signed-in users.
- Sessions persist after a page refresh (`browserLocalPersistence` + `onAuthStateChanged`).

Auth logic lives in `src/services/authService.js` and `src/context/AuthContext.jsx` (`AuthProvider` and `useAuth`).

## Caching strategy

Server data is cached with **TanStack Query** (`src/hooks/useCafes.js`).

- **Query keys:** the list of cafés is stored under `["cafes", "list", { search, district, type, sort, page }]`, and a single café under `["cafes", "detail", id]`. Every combination of filters and page has its own cache entry, so going back to a page you already visited shows data instantly.
- **Freshness / expiration:** data is considered fresh for **60 seconds** (`staleTime`). After that it is stale and is revalidated in the background when the component mounts again or the window regains focus. Unused cache entries are garbage-collected after **5 minutes** (`gcTime`).
- **Outdated requests:** each request receives an `AbortSignal`, so when filters or the page change, the previous request is cancelled. A response to an old request can never overwrite a newer result.
- **Invalidation:** after **adding** a café, all queries under `["cafes"]` are invalidated and refetched. After **deleting** a café, its detail entry is removed and all list queries are invalidated.
- **UI states:** loading, error (with a Retry button) and empty states are handled on the list and detail pages.

## Environment variables

Firebase config is stored in `.env.local` (not committed). To run locally:

1. Copy `.env.example` to `.env.local`
2. Fill in your Firebase project values (Firebase Console → Project settings → Your apps)

| Variable | Description |
| --- | --- |
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID |
| `VITE_FIREBASE_APP_ID` | App ID |

## Run locally

    npm install
    npm run dev
    ## Authentication (Firebase)

The app uses Firebase Authentication with two providers: **Email/Password** and **Google**.

- `/login`: email/password login and Google sign-in
- `/signup`: registration with email, password, confirm password and validation
- `/profile`: protected page showing the user's email and UID, with logout. Unauthenticated users are redirected to `/login`.
- The navbar shows Login/Signup for guests and Profile/Logout for signed-in users.
- Sessions persist after a page refresh (`browserLocalPersistence` + `onAuthStateChanged`).

Auth logic lives in `src/services/authService.js` and `src/context/AuthContext.jsx` (`AuthProvider` and `useAuth`).

## Caching strategy

Server data is cached with **TanStack Query** (`src/hooks/useCafes.js`).

- **Query keys:** the list of cafés is stored under `["cafes", "list", { search, district, type, sort, page }]`, and a single café under `["cafes", "detail", id]`. Every combination of filters and page has its own cache entry, so going back to a page you already visited shows data instantly.
- **Freshness / expiration:** data is considered fresh for **60 seconds** (`staleTime`). After that it is stale and is revalidated in the background when the component mounts again or the window regains focus. Unused cache entries are garbage-collected after **5 minutes** (`gcTime`).
- **Outdated requests:** each request receives an `AbortSignal`, so when filters or the page change, the previous request is cancelled. A response to an old request can never overwrite a newer result.
- **Invalidation:** after **adding** a café, all queries under `["cafes"]` are invalidated and refetched. After **deleting** a café, its detail entry is removed and all list queries are invalidated.
- **UI states:** loading, error (with a Retry button) and empty states are handled on the list and detail pages.

## Environment variables

Firebase config is stored in `.env.local` (not committed). To run locally:

1. Copy `.env.example` to `.env.local`
2. Fill in your Firebase project values (Firebase Console → Project settings → Your apps)

| Variable | Description |
| --- | --- |
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID |
| `VITE_FIREBASE_APP_ID` | App ID |

## Run locally

    npm install
    npm run dev