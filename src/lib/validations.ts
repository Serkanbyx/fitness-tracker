import { z } from 'zod';

/**
 * Workout form validation schema
 * - name: required, 2-50 characters
 * - exerciseType: required, enum value
 * - duration: required, positive number
 * - calories: required, positive number
 * - sets: optional, positive integer
 * - reps: optional, positive integer
 * - weight: optional, positive number
 * - intensity: required, enum value
 * - notes: optional, max 500 characters
 * - date: required, valid date string
 */
export const workoutSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  exerciseType: z.enum(['cardio', 'strength', 'flexibility', 'balance', 'sports'], {
    errorMap: () => ({ message: 'Please select an exercise type' }),
  }),
  duration: z
    .number({ invalid_type_error: 'Duration is required' })
    .positive('Duration must be greater than 0')
    .max(600, 'Duration cannot exceed 600 minutes'),
  calories: z
    .number({ invalid_type_error: 'Calories is required' })
    .positive('Calories must be greater than 0')
    .max(10000, 'Calories cannot exceed 10000'),
  sets: z
    .number()
    .int('Sets must be a whole number')
    .positive('Sets must be greater than 0')
    .max(100, 'Sets cannot exceed 100')
    .optional()
    .nullable()
    .transform(val => val ?? undefined),
  reps: z
    .number()
    .int('Reps must be a whole number')
    .positive('Reps must be greater than 0')
    .max(1000, 'Reps cannot exceed 1000')
    .optional()
    .nullable()
    .transform(val => val ?? undefined),
  weight: z
    .number()
    .positive('Weight must be greater than 0')
    .max(1000, 'Weight cannot exceed 1000 kg')
    .optional()
    .nullable()
    .transform(val => val ?? undefined),
  intensity: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Please select an intensity level' }),
  }),
  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .optional(),
  date: z.string().min(1, 'Date is required'),
});

/**
 * Goal form validation schema
 * - title: required, 2-100 characters
 * - description: optional, max 500 characters
 * - targetType: required, enum value
 * - targetValue: required, positive number
 * - startDate: required, valid date string
 * - endDate: required, valid date string, must be after start date
 */
export const goalSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  targetType: z.enum(['workouts_count', 'total_duration', 'calories_burned', 'weight_lifted'], {
    errorMap: () => ({ message: 'Please select a target type' }),
  }),
  targetValue: z
    .number({ invalid_type_error: 'Target value is required' })
    .positive('Target value must be greater than 0'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
}).refine(
  (data) => new Date(data.endDate) > new Date(data.startDate),
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

/**
 * Type inference from schemas
 */
export type WorkoutFormData = z.infer<typeof workoutSchema>;
export type GoalFormData = z.infer<typeof goalSchema>;
