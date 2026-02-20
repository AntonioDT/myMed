# myMed

myMed is a minimalist and user-friendly web application designed to help users track their medical analysis records. Built with Next.js (App Router), TypeScript, and SCSS, it offers a clean dashboard to view recent analyses, visualize trends, and manage health data.

## Features

- **Dashboard**: Overview of recent medical activities.
- **Notification System**: Custom "Toast" notification system for feedback (success/error) that persists across page transitions.
- **Recent Analysis**: List of latest uploaded reports with status indicators and laboratory info.
- **Analysis Details**: Dedicated page for each report showing detailed values, including multi-segment ranges.
- **Manual Entry**: Form to add new medical reports with dynamic sections (categories) and values.
- **Advanced Range Management**: Support for numeric, textual, and multi-segment reference ranges (e.g., Cholesterol).
- **Preset System**: Quick loading of standard medical ranges (Cholesterol, Glucose, Blood Pressure).
- **Automated Status Calculation**: Real-time status assessment (OK/Warning/Critical) based on entered values.
- **Local Persistence**: Uses `localStorage` to save new entries persistently in the browser.
- **Quick Actions**: Easy access to manual entry and PDF upload (mock).
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **State Management**: React Context API (for global UI states like Toasts)
- **Language**: TypeScript
- **Styling**: SCSS (Modules + Global Variables/Mixins)
- **Form Management**: React Hook Form
- **Icons**: Lucide React
- **Data**: Mock data integration with typed interfaces (Reports -> Sections -> Values)

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
│   ├── layout.tsx       # Root layout with Navbar and ToastProvider
│   ├── page.tsx         # Dashboard page
│   └── page.module.scss # Dashboard styles
├── components/
│   ├── Dashboard/       # Dashboard widgets (QuickActions, RecentAnalysis, etc.)
│   ├── Layout/          # Layout components (Navbar)
│   ├── Modal/           # Reusable Modal component
│   └── Toast/           # Custom Toast component with CSS animations
├── context/
│   └── ToastContext.tsx # Global state for notifications
├── styles/
│   ├── globals.scss     # Global styles and resets
│   ├── mixins.scss      # SCSS mixins and utilities
│   └── variables.scss   # Design tokens (colors, fonts)
├── types/               # TypeScript definitions (Analysis, Form)
├── utils/
│   ├── mock.ts          # Centralized mock data
│   ├── ranges.ts        # Range presets and status calculation logic
│   └── units.ts         # Predefined units of measurement
└── public/              # Static assets
```


