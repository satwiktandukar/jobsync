# Job Application Tracker (Work in progress - Not Production Ready)

A Kanban-style full-stack job search tracker built to manage real job applications from wishlist to archive.

This project is designed as a portfolio-grade app to demonstrate practical React + TypeScript + UI architecture skills for full-stack roles.

## Why I built this

Applying for jobs across multiple platforms gets messy fast. I wanted a focused tool where I can:

- Track each role by stage (`Wish List`, `Applied`, `Interviewing`, `Offers`, `Rejected`, `Archived`)
- Move applications quickly with drag and drop
- Keep role-specific notes in one place
- Maintain visibility of my job pipeline and next actions

## Features

- Multi-column job board by application stage
- Drag-and-drop stage transitions
- Add new job entries with form modal
- Job details side panel/window
- Light/Dark mode toggle
- Responsive horizontal board layout with hidden scrollbars

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Material UI (MUI)
- dnd-kit (`@dnd-kit/react`)

### Tooling

- ESLint
- TypeScript build (`tsc -b`)

## Project Structure

```text
src/
  components/
    Navbar.tsx
    JobSection.tsx
    JobCard.tsx
    JobForm.tsx
    JobWindow.tsx
  services/
    application_service.ts
  types/
    Job.ts
  demoData.ts
  App.tsx
  main.tsx
```

## Getting Started

### 1) Clone

```bash
git clone <your-repo-url>
cd "job-application"
```

### 2) Install dependencies

```bash
npm install
```

### 3) Run locally

```bash
npm run dev
```

Open the local URL shown in your terminal (usually `http://localhost:5173`).

## Scripts

- `npm run dev` - Start local dev server
- `npm run build` - Type-check and build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Demo

Add these after deployment:

- Live app: `<paste-live-url>`
- Demo video (60-90 seconds): `<paste-video-url>`

## What I would improve next

- Persist data with a backend API + database
- Add authentication
- Add filtering/search and analytics (conversion by stage)
- Add test coverage (component + integration)
- Add CI pipeline for lint/build/test checks

## Portfolio/CV blurb

Built a job application tracker using React, TypeScript, MUI, and dnd-kit to manage end-to-end job pipelines across six stages. Implemented drag-and-drop workflows, reusable typed components, and dark-mode theming with clean state management and production build tooling.

## License

MIT (or your preferred license)
