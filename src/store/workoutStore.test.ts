import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useWorkoutStore } from './workoutStore';
import { useGoalStore } from './goalStore';

// Mock goalStore to avoid circular dependency issues in tests
vi.mock('./goalStore', () => ({
  useGoalStore: {
    getState: vi.fn(() => ({
      syncGoalsWithWorkouts: vi.fn(),
    })),
  },
}));

describe('workoutStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useWorkoutStore.setState({
      workouts: [],
      isLoading: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  describe('addWorkout', () => {
    it('should add a new workout to the store', () => {
      const { addWorkout } = useWorkoutStore.getState();

      addWorkout({
        name: 'Morning Run',
        exerciseType: 'cardio',
        duration: 30,
        calories: 300,
        intensity: 'medium',
        date: '2024-01-15',
      });

      const { workouts } = useWorkoutStore.getState();
      expect(workouts).toHaveLength(1);
      expect(workouts[0].name).toBe('Morning Run');
      expect(workouts[0].exerciseType).toBe('cardio');
      expect(workouts[0].duration).toBe(30);
      expect(workouts[0].calories).toBe(300);
    });

    it('should generate unique id for each workout', () => {
      const { addWorkout } = useWorkoutStore.getState();

      addWorkout({
        name: 'Workout 1',
        exerciseType: 'cardio',
        duration: 30,
        calories: 300,
        intensity: 'medium',
        date: '2024-01-15',
      });

      addWorkout({
        name: 'Workout 2',
        exerciseType: 'strength',
        duration: 45,
        calories: 250,
        intensity: 'high',
        date: '2024-01-16',
      });

      const { workouts } = useWorkoutStore.getState();
      expect(workouts[0].id).not.toBe(workouts[1].id);
    });

    it('should sync goals after adding workout', () => {
      const { addWorkout } = useWorkoutStore.getState();
      const mockSync = vi.fn();
      
      vi.mocked(useGoalStore.getState).mockReturnValue({
        syncGoalsWithWorkouts: mockSync,
      } as any);

      addWorkout({
        name: 'Test Workout',
        exerciseType: 'cardio',
        duration: 30,
        calories: 300,
        intensity: 'medium',
        date: '2024-01-15',
      });

      expect(mockSync).toHaveBeenCalled();
    });
  });

  describe('updateWorkout', () => {
    it('should update an existing workout', () => {
      const { addWorkout, updateWorkout } = useWorkoutStore.getState();

      addWorkout({
        name: 'Original Name',
        exerciseType: 'cardio',
        duration: 30,
        calories: 300,
        intensity: 'medium',
        date: '2024-01-15',
      });

      const { workouts } = useWorkoutStore.getState();
      const workoutId = workouts[0].id;

      updateWorkout(workoutId, { name: 'Updated Name', duration: 45 });

      const updatedWorkouts = useWorkoutStore.getState().workouts;
      expect(updatedWorkouts[0].name).toBe('Updated Name');
      expect(updatedWorkouts[0].duration).toBe(45);
      expect(updatedWorkouts[0].calories).toBe(300); // unchanged
    });
  });

  describe('deleteWorkout', () => {
    it('should delete a workout by id', () => {
      const { addWorkout, deleteWorkout } = useWorkoutStore.getState();

      addWorkout({
        name: 'Workout to delete',
        exerciseType: 'cardio',
        duration: 30,
        calories: 300,
        intensity: 'medium',
        date: '2024-01-15',
      });

      const { workouts } = useWorkoutStore.getState();
      expect(workouts).toHaveLength(1);

      deleteWorkout(workouts[0].id);

      const remainingWorkouts = useWorkoutStore.getState().workouts;
      expect(remainingWorkouts).toHaveLength(0);
    });
  });

  describe('getWorkoutById', () => {
    it('should return workout by id', () => {
      const { addWorkout, getWorkoutById } = useWorkoutStore.getState();

      addWorkout({
        name: 'Find me',
        exerciseType: 'strength',
        duration: 45,
        calories: 250,
        intensity: 'high',
        date: '2024-01-15',
      });

      const { workouts } = useWorkoutStore.getState();
      const found = getWorkoutById(workouts[0].id);

      expect(found).toBeDefined();
      expect(found?.name).toBe('Find me');
    });

    it('should return undefined for non-existent id', () => {
      const { getWorkoutById } = useWorkoutStore.getState();
      const found = getWorkoutById('non-existent-id');
      expect(found).toBeUndefined();
    });
  });

  describe('getTotalStats', () => {
    it('should calculate total stats from all workouts', () => {
      const { addWorkout, getTotalStats } = useWorkoutStore.getState();

      addWorkout({
        name: 'Workout 1',
        exerciseType: 'cardio',
        duration: 30,
        calories: 300,
        intensity: 'medium',
        date: '2024-01-15',
      });

      addWorkout({
        name: 'Workout 2',
        exerciseType: 'strength',
        duration: 45,
        calories: 250,
        intensity: 'high',
        date: '2024-01-16',
      });

      const stats = getTotalStats();
      expect(stats.count).toBe(2);
      expect(stats.duration).toBe(75);
      expect(stats.calories).toBe(550);
    });

    it('should return zeros when no workouts exist', () => {
      const { getTotalStats } = useWorkoutStore.getState();
      const stats = getTotalStats();

      expect(stats.count).toBe(0);
      expect(stats.duration).toBe(0);
      expect(stats.calories).toBe(0);
    });
  });
});
