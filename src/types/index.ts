/**
 * Core type definitions for the Fitness Tracker application
 */

// Exercise types available for workouts
export type ExerciseType = 
  | 'cardio' 
  | 'strength' 
  | 'flexibility' 
  | 'balance' 
  | 'sports';

// Workout intensity levels
export type IntensityLevel = 'low' | 'medium' | 'high';

// Goal status types
export type GoalStatus = 'active' | 'completed' | 'cancelled';

// Goal target types
export type GoalTargetType = 
  | 'workouts_count' 
  | 'total_duration' 
  | 'calories_burned'
  | 'weight_lifted';

/**
 * Workout entry interface
 */
export interface Workout {
  id: string;
  name: string;
  exerciseType: ExerciseType;
  duration: number; // in minutes
  calories: number;
  sets?: number;
  reps?: number;
  weight?: number; // in kg
  intensity: IntensityLevel;
  notes?: string;
  date: string; // ISO date string
  createdAt: string; // ISO datetime string
}

/**
 * Fitness goal interface
 */
export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetType: GoalTargetType;
  targetValue: number;
  currentValue: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  status: GoalStatus;
  createdAt: string; // ISO datetime string
}

/**
 * Dashboard statistics interface
 */
export interface DashboardStats {
  totalWorkouts: number;
  totalDuration: number;
  totalCalories: number;
  activeGoals: number;
  completedGoals: number;
  currentStreak: number;
}

/**
 * Chart data point interface for Recharts
 */
export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

/**
 * Weekly summary data for charts
 */
export interface WeeklySummary {
  day: string;
  workouts: number;
  duration: number;
  calories: number;
}

/**
 * Exercise type distribution for pie charts
 */
export interface ExerciseDistribution {
  name: string;
  value: number;
  color: string;
}
