import type { ExerciseType, IntensityLevel, GoalTargetType, Workout } from '../types';

/**
 * MET (Metabolic Equivalent of Task) values for exercises
 * MET values from Compendium of Physical Activities
 * Reference: https://sites.google.com/site/compendiumofphysicalactivities/
 */
export const metValues: Record<ExerciseType, Record<IntensityLevel, number>> = {
  cardio: {
    low: 4.0,    // Light walking, slow cycling
    medium: 7.0, // Jogging, moderate cycling
    high: 10.0,  // Running, HIIT, fast cycling
  },
  strength: {
    low: 3.0,    // Light weight training
    medium: 5.0, // Moderate weight training
    high: 6.0,   // Vigorous weight training
  },
  flexibility: {
    low: 2.5,    // Stretching, light yoga
    medium: 3.0, // Moderate yoga, pilates
    high: 4.0,   // Power yoga, intense stretching
  },
  balance: {
    low: 2.0,    // Standing balance exercises
    medium: 3.0, // Tai chi, balance training
    high: 4.5,   // Dynamic balance exercises
  },
  sports: {
    low: 4.0,    // Recreational sports
    medium: 6.0, // Moderate sports (tennis, swimming)
    high: 9.0,   // Intense sports (basketball, soccer, HIIT)
  },
};

/**
 * Default body weight in kg for calorie calculation
 * User can potentially customize this in the future
 */
const DEFAULT_BODY_WEIGHT = 70; // kg

/**
 * Calculate calories burned during exercise
 * Formula: Calories = MET × Weight(kg) × Duration(hours)
 * 
 * @param exerciseType - Type of exercise
 * @param intensity - Intensity level
 * @param durationMinutes - Duration in minutes
 * @param bodyWeight - Body weight in kg (optional, defaults to 70kg)
 * @returns Estimated calories burned (rounded to nearest integer)
 */
export const calculateCalories = (
  exerciseType: ExerciseType,
  intensity: IntensityLevel,
  durationMinutes: number,
  bodyWeight: number = DEFAULT_BODY_WEIGHT
): number => {
  const met = metValues[exerciseType]?.[intensity] ?? 5.0;
  const durationHours = durationMinutes / 60;
  const calories = met * bodyWeight * durationHours;
  return Math.round(calories);
};

/**
 * Calculate calories for strength training with additional weight factor
 * Considers the weight lifted as an additional intensity factor
 * 
 * @param intensity - Base intensity level
 * @param durationMinutes - Duration in minutes
 * @param weightLifted - Weight lifted in kg (optional)
 * @param sets - Number of sets (optional)
 * @param reps - Number of reps (optional)
 * @param bodyWeight - Body weight in kg (optional)
 * @returns Estimated calories burned
 */
export const calculateStrengthCalories = (
  intensity: IntensityLevel,
  durationMinutes: number,
  weightLifted?: number,
  sets?: number,
  reps?: number,
  bodyWeight: number = DEFAULT_BODY_WEIGHT
): number => {
  // Base calculation
  let calories = calculateCalories('strength', intensity, durationMinutes, bodyWeight);
  
  // Add bonus for weight lifted (higher weight = more calories)
  if (weightLifted && weightLifted > 0) {
    // ~2% increase per 10kg lifted
    const weightFactor = 1 + (weightLifted / 500);
    calories = Math.round(calories * weightFactor);
  }
  
  // Add small bonus for volume (sets × reps)
  if (sets && reps) {
    const volume = sets * reps;
    // ~1% increase per 10 total reps
    const volumeFactor = 1 + (volume / 1000);
    calories = Math.round(calories * volumeFactor);
  }
  
  return calories;
};

/**
 * Exercise type display names and colors
 */
export const exerciseTypeConfig: Record<ExerciseType, { label: string; color: string }> = {
  cardio: { label: 'Cardio', color: '#ef4444' },
  strength: { label: 'Strength', color: '#3b82f6' },
  flexibility: { label: 'Flexibility', color: '#10b981' },
  balance: { label: 'Balance', color: '#f59e0b' },
  sports: { label: 'Sports', color: '#8b5cf6' },
};

/**
 * Intensity level display configuration
 */
export const intensityConfig: Record<IntensityLevel, { label: string; color: string }> = {
  low: { label: 'Low', color: '#10b981' },
  medium: { label: 'Medium', color: '#f59e0b' },
  high: { label: 'High', color: '#ef4444' },
};

/**
 * Goal target type display configuration
 */
export const goalTargetConfig: Record<GoalTargetType, { label: string; unit: string }> = {
  workouts_count: { label: 'Workouts', unit: 'workouts' },
  total_duration: { label: 'Duration', unit: 'minutes' },
  calories_burned: { label: 'Calories', unit: 'calories' },
  weight_lifted: { label: 'Weight', unit: 'kg' },
};

/**
 * Format a date string to a human-readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format a date string to a relative time format
 */
export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return formatDate(dateString);
};

/**
 * Format duration in minutes to hours and minutes
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

/**
 * Get the current week's date range
 */
export const getCurrentWeekRange = (): { start: string; end: string } => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const start = new Date(now);
  start.setDate(now.getDate() - dayOfWeek);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
};

/**
 * Get day names for the week
 */
export const getDayNames = (): string[] => {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
};

/**
 * Calculate current workout streak
 */
export const calculateStreak = (workouts: Workout[]): number => {
  if (workouts.length === 0) return 0;

  // Sort workouts by date in descending order
  const sortedWorkouts = [...workouts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Get unique dates
  const uniqueDates = [...new Set(sortedWorkouts.map(w => w.date))].sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < uniqueDates.length; i++) {
    const workoutDate = new Date(uniqueDates[i]);
    workoutDate.setHours(0, 0, 0, 0);
    
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);

    // Allow for a gap of one day to account for today not having a workout yet
    const diffDays = Math.floor((today.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (i === 0 && diffDays > 1) {
      return 0; // No recent workouts
    }

    if (i > 0) {
      const prevDate = new Date(uniqueDates[i - 1]);
      const daysDiff = Math.floor((prevDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff > 1) break; // Streak broken
    }

    streak++;
  }

  return streak;
};

/**
 * Get today's date string in YYYY-MM-DD format
 */
export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};
