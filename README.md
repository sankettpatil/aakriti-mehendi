# Aakriti Mehndi - Admin & Booking Platform

A modern, full-stack booking and administration platform for Aakriti Mehndi. 
Built for speed, aesthetics, and zero-maintenance scaling on the Edge.

## 🚀 Tech Stack

- **Framework**: [Astro](https://astro.build/)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4 + Framer Motion
- **Database**: Cloudflare D1 (Serverless SQLite)
- **Deployment**: Cloudflare Pages / Workers

## 🤖 Agentic & AI Tooling Used

This project was built iteratively using the **Antigravity IDE** AI agent with the following specific configurations and skills:

### Applied Agent Skills
- **`cloudflare` & `wrangler`**: Provided comprehensive knowledge of the Cloudflare developer platform, enabling seamless integration with D1 databases, R2 storage, and local Miniflare environments.
- **`tailwind-4-docs`**: Guided the implementation of the brand new Tailwind CSS v4, utilizing the new `@theme` CSS configurations instead of the legacy `tailwind.config.js`.
- **`web-design-guidelines`**: Infused the UI with the Vercel engineering team's design standards. This guided the shift towards an ultra-minimalist, high-contrast "tech" aesthetic (geometric fonts like *Inter*, stark black/white contrasts, and crisp 1px dividers) especially visible in the Admin Panel.

## 👥 Team Setup & Local Development

To run this project locally with the exact same test data as the rest of the team:

### 1. Prerequisites
- Node.js (v22+)
- npm

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/sankettpatil/aakriti-mehendi.git
cd aakriti-mehendi
npm install
```

### 3. Database Setup (Crucial)
Run the automated database setup script. This will provision your local Cloudflare D1 database and inject the latest team seed data (including test bookings, active services, and artists):
```bash
npm run db:setup
```

### 4. Start Development Server
Start the Astro development server:
```bash
npm run dev
```
The app will be available at `http://localhost:4321`.

## 📁 Project Structure

- `src/pages/admin/` - The secure admin dashboard (View upcoming bookings, analytics, etc.)
- `src/pages/book/` - The public-facing booking flow for customers
- `src/components/admin/` - Admin React components (e.g., Slide-over detail panels, data grids)
- `src/lib/db.ts` - Cloudflare D1 database connection and helper queries
- `wrangler.jsonc` - Cloudflare infrastructure-as-code configuration
- `team_seed.sql` - The reproducible database dump used to sync data across the team

## 🎨 Design Philosophy
The admin panel follows a strict "Linear/Vercel" aesthetic:
- **Typography**: `Inter` font for maximum legibility.
- **Components**: Flat, un-shadowed surfaces with precise 1px `gray-200` borders.
- **Layouts**: Unified data grids using Tailwind's `divide-x` and `divide-y` for a clean, spreadsheet-like data density.

## ☁️ Cloudflare Deployment
When you push to the `main` branch, Cloudflare Pages will automatically pull the code, build the Astro site, and deploy it globally to the edge. The production site relies on the remote D1 database configured in `wrangler.jsonc`.
