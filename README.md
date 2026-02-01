# Animation Playbook

A personal animation playbook: list, preview, and edit animation examples (Avatar Group, Cursor, text/background/button effects). Built with React, Vite, Ant Design, and Motion.

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
```

Output is in the `dist` folder. Preview with:

```bash
npm run preview
```

## Deploy to GitHub Pages (open from any browser/device)

1. Push this repo to GitHub (create a new repo and push).
2. In the repo: **Settings → Pages** → under "Build and deployment", set **Source** to **GitHub Actions**.
3. Push to the `main` branch (or run the workflow from the Actions tab). The workflow builds and deploys the app.
4. After it finishes, your playbook is at:  
   **`https://<your-username>.github.io/<repo-name>/`**

You can open that URL from any browser and device. Re-push to update the site.

## Project structure

- **src/** — App, pages (list, detail, form), components (dock, LivePreview, animate-ui backgrounds/buttons), data (store, seeds), constants, lib, utils
- **src/components/ui/** — Dock (bottom nav)
- **src/components/animate-ui/** — Bubble, Gravity Stars, Theme Toggler; button variants for theme toggle
- **src/data/** — seedExample.js (Avatar, Cursor, text/background/button seeds), store.js (localStorage + ensureSeedExample)
- **src/pages/** — ListPage, ExampleDetailPage, ExampleForm

## Stack

- **React 18** — UI
- **Vite** — build
- **Ant Design 5** — Card, Typography, Button, Form, etc.
- **Motion** — animations (dock, bubble, gravity stars)
- **next-themes** — theme (Theme Toggler tile)
- **Lucide React** — icons
