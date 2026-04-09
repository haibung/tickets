# TicketHub – Client

React + Next.js + TailwindCSS frontend for the TicketHub concert ticketing platform.

## Project Structure

```
client/
├── components/       # Reusable UI components
│   ├── Navbar.js     # Responsive navigation bar
│   ├── EventCard.js  # Event listing card
│   └── Footer.js     # Site footer
├── lib/
│   └── api.js        # Axios-based API client (connects to Go backend)
├── pages/
│   ├── _app.js           # Next.js app wrapper
│   ├── index.js          # Homepage (hero, featured events, CTA)
│   ├── checkout.js       # Checkout form
│   ├── confirmation.js   # Order confirmation
│   └── events/
│       └── index.js      # Events listing with search & category filters
├── styles/
│   └── globals.css   # TailwindCSS directives + global utility classes
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install dependencies

```bash
cd client
npm install
```

### Configure environment

Create a `.env.local` file in the `client/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Replace `http://localhost:8080` with the URL of your Go backend.

### Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm start
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero banner, featured events, newsletter CTA |
| `/events` | Browse all events with search and category filters |
| `/checkout` | Purchase form (personal info + payment details) |
| `/confirmation` | Order confirmation page |

## Backend Integration

The `lib/api.js` module provides a pre-configured Axios client that:

- Points to `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8080`)
- Automatically attaches a `Bearer` JWT token from `localStorage`
- Handles 401 responses by clearing the stored token

### Available API helpers

```js
import { getEvents, getEvent, createOrder, login, register } from "../lib/api";
```

When the backend is unreachable (e.g. during local UI development), the pages
fall back to built-in placeholder data so you can still work on the UI.
