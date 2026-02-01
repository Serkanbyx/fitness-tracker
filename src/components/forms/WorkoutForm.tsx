import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { workoutSchema, type WorkoutFormData } from '../../lib/validations';
import { exerciseTypeConfig, intensityConfig, getTodayString } from '../../lib/utils';
import { Button } from '../ui';
import type { Workout } from '../../types';

interface WorkoutFormProps {
  onSubmit: (data: WorkoutFormData) => void;
  onCancel: () => void;
  initialData?: Workout;
  isSubmitting?: boolean;
}

/**
 * Workout form component using React Hook Form and Zod validation
 */
const WorkoutForm = ({
  onSubmit,
  onCancel,
  initialData,
  isSubmitting = false,
}: WorkoutFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<WorkoutFormData>({
    resolver: zodResolver(workoutSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          exerciseType: initialData.exerciseType,
          duration: initialData.duration,
          calories: initialData.calories,
          sets: initialData.sets,
          reps: initialData.reps,
          weight: initialData.weight,
          intensity: initialData.intensity,
          notes: initialData.notes || '',
          date: initialData.date,
        }
      : {
          name: '',
          exerciseType: undefined,
          duration: undefined,
          calories: undefined,
          sets: undefined,
          reps: undefined,
          weight: undefined,
          intensity: undefined,
          notes: '',
          date: getTodayString(),
        },
  });

  const exerciseType = watch('exerciseType');
  const isStrengthExercise = exerciseType === 'strength';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Workout Name */}
      <div>
        <label htmlFor="name" className="label">
          Workout Name *
        </label>
        <input
          id="name"
          type="text"
          className={`input ${errors.name ? 'input-error' : ''}`}
          placeholder="e.g., Morning Run, Weight Training"
          {...register('name')}
        />
        {errors.name && <p className="error-message">{errors.name.message}</p>}
      </div>

      {/* Exercise Type & Intensity Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="exerciseType" className="label">
            Exercise Type *
          </label>
          <select
            id="exerciseType"
            className={`input ${errors.exerciseType ? 'input-error' : ''}`}
            {...register('exerciseType')}
          >
            <option value="">Select type</option>
            {Object.entries(exerciseTypeConfig).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.exerciseType && (
            <p className="error-message">{errors.exerciseType.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="intensity" className="label">
            Intensity *
          </label>
          <select
            id="intensity"
            className={`input ${errors.intensity ? 'input-error' : ''}`}
            {...register('intensity')}
          >
            <option value="">Select intensity</option>
            {Object.entries(intensityConfig).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.intensity && (
            <p className="error-message">{errors.intensity.message}</p>
          )}
        </div>
      </div>

      {/* Duration & Calories Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="duration" className="label">
            Duration (minutes) *
          </label>
          <input
            id="duration"
            type="number"
            min="1"
            className={`input ${errors.duration ? 'input-error' : ''}`}
            placeholder="30"
            {...register('duration', { valueAsNumber: true })}
          />
          {errors.duration && (
            <p className="error-message">{errors.duration.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="calories" className="label">
            Calories Burned *
          </label>
          <input
            id="calories"
            type="number"
            min="1"
            className={`input ${errors.calories ? 'input-error' : ''}`}
            placeholder="250"
            {...register('calories', { valueAsNumber: true })}
          />
          {errors.calories && (
            <p className="error-message">{errors.calories.message}</p>
          )}
        </div>
      </div>

      {/* Strength Training Fields (conditional) */}
      {isStrengthExercise && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label htmlFor="sets" className="label">
              Sets
            </label>
            <input
              id="sets"
              type="number"
              min="1"
              className={`input ${errors.sets ? 'input-error' : ''}`}
              placeholder="4"
              {...register('sets', { valueAsNumber: true })}
            />
            {errors.sets && <p className="error-message">{errors.sets.message}</p>}
          </div>

          <div>
            <label htmlFor="reps" className="label">
              Reps
            </label>
            <input
              id="reps"
              type="number"
              min="1"
              className={`input ${errors.reps ? 'input-error' : ''}`}
              placeholder="12"
              {...register('reps', { valueAsNumber: true })}
            />
            {errors.reps && <p className="error-message">{errors.reps.message}</p>}
          </div>

          <div>
            <label htmlFor="weight" className="label">
              Weight (kg)
            </label>
            <input
              id="weight"
              type="number"
              min="0"
              step="0.5"
              className={`input ${errors.weight ? 'input-error' : ''}`}
              placeholder="50"
              {...register('weight', { valueAsNumber: true })}
            />
            {errors.weight && (
              <p className="error-message">{errors.weight.message}</p>
            )}
          </div>
        </div>
      )}

      {/* Date */}
      <div>
        <label htmlFor="date" className="label">
          Date *
        </label>
        <input
          id="date"
          type="date"
          className={`input ${errors.date ? 'input-error' : ''}`}
          {...register('date')}
        />
        {errors.date && <p className="error-message">{errors.date.message}</p>}
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="label">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          rows={3}
          className={`input resize-none ${errors.notes ? 'input-error' : ''}`}
          placeholder="How did you feel? Any achievements?"
          {...register('notes')}
        />
        {errors.notes && <p className="error-message">{errors.notes.message}</p>}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? 'Update Workout' : 'Add Workout'}
        </Button>
      </div>
    </form>
  );
};

export default WorkoutForm;
