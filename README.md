# Fitness Tracker

A modern, responsive web application for tracking workouts, setting fitness goals, and monitoring progress with beautiful charts and analytics.

## Features

- **Dashboard**: Overview of fitness metrics with interactive charts
  - Weekly activity visualization (calories, duration)
  - Exercise type distribution pie chart
  - Active goals progress tracking
  - Current workout streak

- **Workouts**: Log and manage workout sessions
  - Add/edit/delete workouts
  - Support for multiple exercise types (cardio, strength, flexibility, balance, sports)
  - Track duration, calories, sets, reps, and weight
  - Filter and search functionality

- **Goals**: Set and track fitness goals
  - Create goals with target types (workouts count, duration, calories, weight lifted)
  - Visual progress tracking
  - Complete, cancel, or reactivate goals
  - Deadline tracking

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **State Management**: Zustand with persistence
- **Forms**: React Hook Form + Zod validation
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router v6

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fitness-tracker.git
cd fitness-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── forms/         # Form components (WorkoutForm, GoalForm)
│   ├── ui/            # Reusable UI components
│   ├── Layout.tsx     # Main layout with sidebar
│   ├── Sidebar.tsx    # Desktop navigation
│   └── MobileNav.tsx  # Mobile bottom navigation
├── lib/
│   ├── utils.ts       # Utility functions
│   └── validations.ts # Zod validation schemas
├── pages/
│   ├── Dashboard.tsx  # Dashboard page with charts
│   ├── Workouts.tsx   # Workouts management page
│   └── Goals.tsx      # Goals management page
├── store/
│   ├── workoutStore.ts # Zustand store for workouts
│   └── goalStore.ts    # Zustand store for goals
├── types/
│   └── index.ts       # TypeScript type definitions
├── App.tsx            # Main app with routing
├── main.tsx           # Entry point
└── index.css          # Global styles with Tailwind
```

## State Management

The app uses Zustand for state management with the following features:
- Persistent storage (localStorage)
- DevTools support for debugging
- Type-safe actions and state

## Deployment

This project is configured for deployment on Netlify:

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Netlify will automatically detect Vite and deploy

Or deploy manually:
```bash
npm run build
# Upload the dist folder to your hosting provider
```

## License

MIT License
