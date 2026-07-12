# ShareBari Client

Next.js, React, TypeScript, and Tailwind CSS frontend for ShareBari.

ShareBari is a hyperlocal item sharing and rental marketplace where users can discover useful rental items nearby instead of buying products they only need temporarily.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Run the development server:

```bash
npm run dev
```

The app runs locally on `http://localhost:3000`.

## Environment Variables

Only placeholder values are committed in `.env.example`.

Required local values:

- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

Do not commit `.env.local` or any real credentials.
