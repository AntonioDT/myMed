# myMed

myMed is a minimalist and user-friendly web application designed to help users track their medical analysis records. Built with Next.js (App Router), TypeScript, and SCSS, it offers a clean dashboard to view recent analyses, visualize trends, and manage health data.

## Features

- **Dashboard**: Overview of recent medical activities.
- **Recent Analysis**: List of latest uploaded reports with status indicators.
- **Analysis Details**: Dedicated page for each report showing detailed values.
- **Manual Entry**: Form to add new medical reports with dynamic sections (categories) and values.
- **Local Persistence**: Uses `localStorage` to save new entries persistently in the browser.
- **Quick Actions**: Easy access to manual entry and PDF upload (mock).
- **Trends Chart**: Placeholder for health data visualization.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: SCSS (Modules + Global Variables/Mixins)
- **Form Management**: React Hook Form
- **Icons**: Lucide React
- **Data**: Mock data integration with typed interfaces and valid local persistence

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
myMed/
├── app/
│   ├── analysis/        # Dynamic detail pages
│   │   ├── [id]/        # Route: /analysis/:id
│   │   └── new/         # Route: /analysis/new (Manual Entry)
│   ├── layout.tsx       # Root layout with Navbar
│   ├── page.tsx         # Dashboard page
│   └── page.module.scss # Dashboard styles
├── components/
│   ├── Dashboard/       # Dashboard widgets (QuickActions, RecentAnalysis, etc.)
│   └── Layout/          # Layout components (Navbar)
├── styles/
│   ├── globals.scss     # Global styles and resets
│   ├── mixins.scss      # SCSS mixins and utilities
│   └── variables.scss   # Design tokens (colors, fonts)
├── types/               # TypeScript definitions (Analysis, Form)
├── utils/
│   └── mock.ts          # Centralized mock data
└── public/              # Static assets
```


