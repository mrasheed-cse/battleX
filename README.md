# ⚡ BattleX Gaming Platform

A full-featured, industry-standard gaming platform frontend built with **React 18 + Vite + React Router**.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ ([download](https://nodejs.org/))
- **npm** v9+ (comes with Node)

### 1. Install dependencies
```bash
npm install
```

### 2. Start the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Build for Production

```bash
npm run build
```

Output goes to the `dist/` folder. Deploy that folder to any static host (Vercel, Netlify, Nginx, etc.).

### Preview the production build locally
```bash
npm run preview
```

---

## 🗂 Project Structure

```
battlex/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Navbar.module.css
│   │   ├── Footer.jsx
│   │   ├── Footer.module.css
│   │   ├── AuthModal.jsx
│   │   ├── AuthModal.module.css
│   │   ├── GameCard.jsx
│   │   └── GameCard.module.css
│   ├── pages/               # Route-level pages
│   │   ├── Home.jsx  + .module.css
│   │   ├── Games.jsx + .module.css
│   │   ├── Tournaments.jsx + .module.css
│   │   ├── Leaderboard.jsx + .module.css
│   │   ├── Pricing.jsx + .module.css
│   │   └── NotFound.jsx + .module.css
│   ├── context/
│   │   └── AuthContext.jsx  # Global auth state (login/signup/logout)
│   ├── hooks/
│   │   └── useModal.js      # Modal open/close + scroll lock
│   ├── data/
│   │   └── index.js         # Mock data (replace with API calls)
│   ├── styles/
│   │   └── global.css       # Design tokens, resets, utility classes
│   ├── App.jsx              # Root component + router
│   └── main.jsx             # React entry point
├── index.html
├── vite.config.js
└── package.json
```

---

## 🎨 Pages

| Route           | Page           | Description                                    |
|-----------------|----------------|------------------------------------------------|
| `/`             | Home           | Hero carousel, stats, featured games, news     |
| `/games`        | Games          | Full library with search, filter, sort         |
| `/tournaments`  | Tournaments    | Live/open/upcoming esports events              |
| `/leaderboard`  | Leaderboard    | Global rankings + top-3 podium                 |
| `/pricing`      | Pricing        | Plans, billing toggle, comparison table, FAQ   |
| `*`             | 404 Not Found  | Friendly error page                            |

---

## 🔌 Backend Integration

All mock data lives in `src/data/index.js`.  
All auth logic lives in `src/context/AuthContext.jsx`.

When your backend API is ready, replace the mock calls:

### Auth (AuthContext.jsx)
```js
// Replace the fake await with a real fetch:
const res = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
})
const data = await res.json()
setUser(data.user)
```

### Game data (data/index.js → your API)
```js
// In any page component:
const [games, setGames] = useState([])
useEffect(() => {
  fetch('/api/games').then(r => r.json()).then(setGames)
}, [])
```

---

## 🛠 Tech Stack

| Tool             | Purpose                    |
|------------------|----------------------------|
| React 18         | UI framework               |
| Vite 5           | Build tool & dev server    |
| React Router 6   | Client-side routing        |
| CSS Modules      | Scoped, maintainable styles|
| Google Fonts     | Barlow Condensed + Rajdhani|

---

## 🌐 Deployment

### Vercel (recommended)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
# drag & drop the dist/ folder into Netlify dashboard
```

### Docker / Nginx
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

---

## ✅ Checklist Before Going Live

- [ ] Replace mock data in `src/data/index.js` with real API calls
- [ ] Implement real auth in `src/context/AuthContext.jsx`
- [ ] Add a `.env` file for your API base URL (`VITE_API_URL=https://...`)
- [ ] Add payment integration on the Pricing page
- [ ] Configure `vite.config.js` proxy for local API dev
