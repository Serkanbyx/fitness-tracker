import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Goal, GoalStatus, GoalTargetType } from '../types';

/**
 * Goal form data without id, currentValue, status, and timestamps
 */
interface GoalFormData {
  title: string;
  description?: string;
  targetType: GoalTargetType;
  targetValue: number;
  startDate: string;
  endDate: string;
}

/**
 * Goal store state interface
 */
interface GoalState {
  goals: Goal[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Goal store actions interface
 */
interface GoalActions {
  addGoal: (data: GoalFormData) => void;
  updateGoal: (id: string, data: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  updateProgress: (id: string, value: number) => void;
  completeGoal: (id: string) => void;
  cancelGoal: (id: string) => void;
  reactivateGoal: (id: string) => void;
  getGoalById: (id: string) => Goal | undefined;
  getActiveGoals: () => Goal[];
  getCompletedGoals: () => Goal[];
  getGoalProgress: (id: string) => number;
  clearError: () => void;
}

/**
 * Helper to get date strings
 */
const getDateString = (daysOffset: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

/**
 * Sample goals data for initial state
 */
const sampleGoals: Goal[] = [
  {
    id: uuidv4(),
    title: 'Complete 20 Workouts',
    description: 'Complete at least 20 workout sessions this month',
    targetType: 'workouts_count',
    targetValue: 20,
    currentValue: 5,
    startDate: getDateString(-15),
    endDate: getDateString(15),
    status: 'active',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Burn 5000 Calories',
    description: 'Burn a total of 5000 calories through exercise',
    targetType: 'calories_burned',
    targetValue: 5000,
    currentValue: 1730,
    startDate: getDateString(-10),
    endDate: getDateString(20),
    status: 'active',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Exercise 500 Minutes',
    description: 'Accumulate 500 minutes of total exercise time',
    targetType: 'total_duration',
    targetValue: 500,
    currentValue: 250,
    startDate: getDateString(-20),
    endDate: getDateString(10),
    status: 'active',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
];

/**
 * Zustand store for managing fitness goals
 * Includes persistence to localStorage and devtools for debugging
 */
export const useGoalStore = create<GoalState & GoalActions>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        goals: sampleGoals,
        isLoading: false,
        error: null,

        /**
         * Add a new goal to the store
         */
        addGoal: (data: GoalFormData) => {
          const newGoal: Goal = {
            ...data,
            id: uuidv4(),
            currentValue: 0,
            status: 'active',
            createdAt: new Date().toISOString(),
          };
          
          set(
            (state) => ({
              goals: [newGoal, ...state.goals],
            }),
            false,
            'addGoal'
          );
        },

        /**
         * Update an existing goal by id
         */
        updateGoal: (id: string, data: Partial<Goal>) => {
          set(
            (state) => ({
              goals: state.goals.map((goal) =>
                goal.id === id ? { ...goal, ...data } : goal
              ),
            }),
            false,
            'updateGoal'
          );
        },

        /**
         * Delete a goal by id
         */
        deleteGoal: (id: string) => {
          set(
            (state) => ({
              goals: state.goals.filter((goal) => goal.id !== id),
            }),
            false,
            'deleteGoal'
          );
        },

        /**
         * Update the progress/current value of a goal
         */
        updateProgress: (id: string, value: number) => {
          set(
            (state) => ({
              goals: state.goals.map((goal) => {
                if (goal.id !== id) return goal;
                
                const newValue = Math.max(0, value);
                const isComplete = newValue >= goal.targetValue;
                
                return {
                  ...goal,
                  currentValue: newValue,
                  status: isComplete ? 'completed' : goal.status,
                };
              }),
            }),
            false,
            'updateProgress'
          );
        },

        /**
         * Mark a goal as completed
         */
        completeGoal: (id: string) => {
          set(
            (state) => ({
              goals: state.goals.map((goal) =>
                goal.id === id
                  ? { ...goal, status: 'completed' as GoalStatus, currentValue: goal.targetValue }
                  : goal
              ),
            }),
            false,
            'completeGoal'
          );
        },

        /**
         * Mark a goal as cancelled
         */
        cancelGoal: (id: string) => {
          set(
            (state) => ({
              goals: state.goals.map((goal) =>
                goal.id === id
                  ? { ...goal, status: 'cancelled' as GoalStatus }
                  : goal
              ),
            }),
            false,
            'cancelGoal'
          );
        },

        /**
         * Reactivate a cancelled or completed goal
         */
        reactivateGoal: (id: string) => {
          set(
            (state) => ({
              goals: state.goals.map((goal) =>
                goal.id === id
                  ? { ...goal, status: 'active' as GoalStatus }
                  : goal
              ),
            }),
            false,
            'reactivateGoal'
          );
        },

        /**
         * Get a single goal by id
         */
        getGoalById: (id: string) => {
          return get().goals.find((goal) => goal.id === id);
        },

        /**
         * Get all active goals
         */
        getActiveGoals: () => {
          return get().goals.filter((goal) => goal.status === 'active');
        },

        /**
         * Get all completed goals
         */
        getCompletedGoals: () => {
          return get().goals.filter((goal) => goal.status === 'completed');
        },

        /**
         * Calculate the progress percentage for a goal
         */
        getGoalProgress: (id: string) => {
          const goal = get().getGoalById(id);
          if (!goal) return 0;
          return Math.min(100, (goal.currentValue / goal.targetValue) * 100);
        },

        /**
         * Clear any error state
         */
        clearError: () => {
          set({ error: null }, false, 'clearError');
        },
      }),
      {
        name: 'fitness-tracker-goals',
        version: 1,
      }
    ),
    { name: 'GoalStore' }
  )
);
