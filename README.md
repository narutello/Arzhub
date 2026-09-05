# Arzhub

Live free-market currency rates in Tehran — priced in Iranian Toman.

**Live demo:** [arzhub.vercel.app](https://arzhub.vercel.app)

---

## Features

- Real-time rates for dozens of currencies (USD, EUR, GBP, AED, TRY, USDT, and more)
- Historical price charts with ranges from 1 day to 1 year
- Currency converter (to/from Toman)
- Personal watchlist
- Light & dark mode
- Fully responsive (mobile + desktop)
- Installable as a PWA

## Data Sources

| Priority | Source | Usage |
|----------|--------|--------|
| 1 | [TGJU](https://www.tgju.org/) | Live rates + historical chart data |
| 2 | [Bonbast](https://www.bonbast.com/) | Fallback when TGJU is unavailable |

Prices are converted from **Rial** to **Toman**.

## Tech Stack

- **Framework:** TanStack Start (React + Vite)
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Data fetching:** Server Functions + React Query
- **Deploy:** Vercel

## Getting Started

```bash
# Clone the repo
git clone https://github.com/narutello/Arzhub.git
cd Arzhub

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`.

### Useful scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run typecheck` | Run TypeScript checks |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |

## Project Structure

```
src/
├── components/     # UI components (chart, converter, currency list, ...)
├── lib/
│   ├── market.ts   # TGJU / Bonbast data fetching
│   ├── currencies.ts
│   └── types.ts
└── routes/         # Pages (home, currencies, converter, watchlist)
```

## License

Free for personal and educational use.
