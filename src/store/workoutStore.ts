import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Workout, ExerciseType, IntensityLevel } from '../types';

/**
 * Workout form data without id and timestamps
 */
interface WorkoutFormData {
  name: string;
  exerciseType: ExerciseType;
  duration: number;
  calories: number;
  sets?: number;
  reps?: number;
  weight?: number;
  intensity: IntensityLevel;
  notes?: string;
  date: string;
}

/**
 * Workout store state interface
 */
interface WorkoutState {
  workouts: Workout[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Workout store actions interface
 */
interface WorkoutActions {
  addWorkout: (data: WorkoutFormData) => void;
  updateWorkout: (id: string, data: Partial<WorkoutFormData>) => void;
  deleteWorkout: (id: string) => void;
  getWorkoutById: (id: string) => Workout | undefined;
  getWorkoutsByDateRange: (startDate: string, endDate: string) => Workout[];
  getWorkoutsByType: (type: ExerciseType) => Workout[];
  getTotalStats: () => { duration: number; calories: number; count: number };
  clearError: () => void;
}

/**
 * Sample workout data for initial state
 */
const sampleWorkouts: Workout[] = [
  {
    id: uuidv4(),
    name: 'Morning Run',
    exerciseType: 'cardio',
    duration: 30,
    calories: 300,
    intensity: 'medium',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Weight Training',
    exerciseType: 'strength',
    duration: 45,
    calories: 250,
    sets: 4,
    reps: 12,
    weight: 50,
    intensity: 'high',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Yoga Session',
    exerciseType: 'flexibility',
    duration: 60,
    calories: 180,
    intensity: 'low',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: uuidv4(),
    name: 'HIIT Workout',
    exerciseType: 'cardio',
    duration: 25,
    calories: 400,
    intensity: 'high',
    date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Basketball',
    exerciseType: 'sports',
    duration: 90,
    calories: 600,
    intensity: 'high',
    date: new Date(Date.now() - 345600000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 345600000).toISOString(),
  },
];

/**
 * Zustand store for managing workouts
 * Includes persistence to localStorage and devtools for debugging
 */
export const useWorkoutStore = create<WorkoutState & WorkoutActions>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        workouts: sampleWorkouts,
        isLoading: false,
        error: null,

        /**
         * Add a new workout to the store
         */
        addWorkout: (data: WorkoutFormData) => {
          const newWorkout: Workout = {
            ...data,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
          };
          
          set(
            (state) => ({
              workouts: [newWorkout, ...state.workouts],
            }),
            false,
            'addWorkout'
          );
        },

        /**
         * Update an existing workout by id
         */
        updateWorkout: (id: string, data: Partial<WorkoutFormData>) => {
          set(
            (state) => ({
              workouts: state.workouts.map((workout) =>
                workout.id === id ? { ...workout, ...data } : workout
              ),
            }),
            false,
            'updateWorkout'
          );
        },

        /**
         * Delete a workout by id
         */
        deleteWorkout: (id: string) => {
          set(
            (state) => ({
              workouts: state.workouts.filter((workout) => workout.id !== id),
            }),
            false,
            'deleteWorkout'
          );
        },

        /**
         * Get a single workout by id
         */
        getWorkoutById: (id: string) => {
          return get().workouts.find((workout) => workout.id === id);
        },

        /**
         * Get workouts within a date range
         */
        getWorkoutsByDateRange: (startDate: string, endDate: string) => {
          return get().workouts.filter((workout) => {
            const workoutDate = new Date(workout.date);
            return (
              workoutDate >= new Date(startDate) &&
              workoutDate <= new Date(endDate)
            );
          });
        },

        /**
         * Get workouts by exercise type
         */
        getWorkoutsByType: (type: ExerciseType) => {
          return get().workouts.filter((workout) => workout.exerciseType === type);
        },

        /**
         * Calculate total stats from all workouts
         */
        getTotalStats: () => {
          const workouts = get().workouts;
          return workouts.reduce(
            (acc, workout) => ({
              duration: acc.duration + workout.duration,
              calories: acc.calories + workout.calories,
              count: acc.count + 1,
            }),
            { duration: 0, calories: 0, count: 0 }
          );
        },

        /**
         * Clear any error state
         */
        clearError: () => {
          set({ error: null }, false, 'clearError');
        },
      }),
      {
        name: 'fitness-tracker-workouts',
        version: 1,
      }
    ),
    { name: 'WorkoutStore' }
  )
);
