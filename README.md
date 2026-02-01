# 💪 Fitness Tracker

A modern, responsive web application for tracking workouts, setting fitness goals, and monitoring your progress with beautiful charts and analytics. Take control of your fitness journey!

[![Created by Serkanby](https://img.shields.io/badge/Created%20by-Serkanby-blue?style=flat-square)](https://serkanbayraktar.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Serkanbyx-181717?style=flat-square&logo=github)](https://github.com/Serkanbyx)

## Features

- **Interactive Dashboard**: Get a complete overview of your fitness metrics with beautiful, interactive charts showing weekly activity, calorie burn, and exercise distribution
- **Workout Management**: Log, edit, and delete workout sessions with support for multiple exercise types including cardio, strength, flexibility, balance, and sports
- **Goal Setting & Tracking**: Create fitness goals with various target types (workout count, duration, calories, weight lifted) and track your progress visually
- **Real-Time Statistics**: Monitor your workout streak, calories burned, total duration, and active goals at a glance
- **Data Persistence**: Your data is automatically saved to local storage, so you never lose your progress
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices with an intuitive navigation system
- **Dark/Light Theme Ready**: Clean, modern UI built with Tailwind CSS

## Live Demo

[🚀 View Live Demo](https://fitness-trackerrrrr.netlify.app/dashboard)

## Technologies

- **React 18**: Modern React with hooks for building interactive user interfaces
- **TypeScript**: Type-safe development for better code quality and maintainability
- **Vite 5**: Next-generation frontend build tool for lightning-fast development
- **Zustand**: Lightweight state management with built-in persistence
- **React Hook Form**: Performant form handling with easy validation
- **Zod**: TypeScript-first schema validation for robust data handling
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Recharts**: Composable charting library for React
- **Lucide React**: Beautiful, customizable icons
- **React Router v6**: Declarative routing for React applications

## Installation

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/Serkanbyx/s2.10_Fitness-Tracker.git
cd s2.10_Fitness-Tracker
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The optimized production files will be generated in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage

1. **Dashboard**: Start by viewing the dashboard to see your overall fitness statistics and charts
2. **Add Workouts**: Navigate to the Workouts page and click "Add Workout" to log a new exercise session
3. **Set Goals**: Go to the Goals page and create fitness goals with specific targets and deadlines
4. **Track Progress**: Monitor your progress through the dashboard charts and goal progress bars
5. **Manage Data**: Edit or delete workouts and goals as needed to keep your data accurate

## How It Works?

### State Management

The application uses Zustand for efficient state management with localStorage persistence:

```typescript
// Workout store with persistence
const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set, get) => ({
      workouts: [],
      addWorkout: (workout) => set((state) => ({ 
        workouts: [...state.workouts, workout] 
      })),
      // ... more actions
    }),
    { name: 'workout-storage' }
  )
);
```

### Form Validation

Forms are validated using Zod schemas for type-safe data handling:

```typescript
const workoutSchema = z.object({
  exerciseType: z.enum(['cardio', 'strength', 'flexibility', 'balance', 'sports']),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  calories: z.number().min(0, 'Calories cannot be negative'),
  // ... more validations
});
```

### Data Visualization

Recharts library powers the interactive charts on the dashboard:

```typescript
<AreaChart data={weeklyData}>
  <XAxis dataKey="day" />
  <YAxis />
  <Tooltip />
  <Area type="monotone" dataKey="calories" fill="#3b82f6" />
</AreaChart>
```

## Project Structure

```
src/
├── components/
│   ├── forms/           # Form components (WorkoutForm, GoalForm)
│   ├── ui/              # Reusable UI components (Button, Modal, etc.)
│   ├── Layout.tsx       # Main layout with sidebar navigation
│   ├── Sidebar.tsx      # Desktop navigation sidebar
│   └── MobileNav.tsx    # Mobile bottom navigation bar
├── lib/
│   ├── utils.ts         # Utility functions and helpers
│   └── validations.ts   # Zod validation schemas
├── pages/
│   ├── Dashboard.tsx    # Dashboard with charts and statistics
│   ├── Workouts.tsx     # Workout management page
│   └── Goals.tsx        # Goals management page
├── store/
│   ├── workoutStore.ts  # Zustand store for workouts
│   └── goalStore.ts     # Zustand store for goals
├── types/
│   └── index.ts         # TypeScript type definitions
├── App.tsx              # Main app component with routing
├── main.tsx             # Application entry point
└── index.css            # Global styles with Tailwind
```

## Features in Detail

### Completed Features

✅ Interactive dashboard with weekly activity charts  
✅ Workout logging with multiple exercise types  
✅ Goal creation with progress tracking  
✅ Data persistence with localStorage  
✅ Responsive mobile-first design  
✅ Form validation with error messages  
✅ Filter and search functionality  
✅ Workout streak tracking  

### Future Features

- [ ] User authentication and cloud sync
- [ ] Export data to CSV/PDF
- [ ] Social sharing and challenges
- [ ] Workout templates and presets
- [ ] Dark mode toggle
- [ ] Push notifications for goals
- [ ] Integration with fitness devices

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch:

```bash
git checkout -b feature/amazing-feature
```

3. Commit your changes with semantic messages:

```bash
git commit -m "feat: add amazing feature"
```

**Commit message prefixes:**

| Prefix | Description |
|--------|-------------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `style:` | Code style changes |
| `refactor:` | Code refactoring |
| `test:` | Adding tests |
| `chore:` | Maintenance tasks |

4. Push to the branch:

```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Developer

**Serkanby**

- 🌐 Website: [serkanbayraktar.com](https://serkanbayraktar.com/)
- 💻 GitHub: [@Serkanbyx](https://github.com/Serkanbyx)
- 📧 Email: [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)

## Acknowledgments

- [React](https://react.dev/) - The library for web and native user interfaces
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Zustand](https://zustand-demo.pmnd.rs/) - Bear necessities for state management
- [Recharts](https://recharts.org/) - Redefined chart library built with React
- [Lucide](https://lucide.dev/) - Beautiful & consistent icons
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling

## Contact

Have questions or suggestions? Feel free to reach out!

- 📝 [Open an Issue](https://github.com/Serkanbyx/s2.10_Fitness-Tracker/issues)
- 📧 Email: [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)
- 🌐 Website: [serkanbayraktar.com](https://serkanbayraktar.com/)

---

⭐ If you like this project, don't forget to give it a star!
