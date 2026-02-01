import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { goalSchema, type GoalFormData } from '../../lib/validations';
import { goalTargetConfig, getTodayString } from '../../lib/utils';
import { Button } from '../ui';
import type { Goal } from '../../types';

interface GoalFormProps {
  onSubmit: (data: GoalFormData) => void;
  onCancel: () => void;
  initialData?: Goal;
  isSubmitting?: boolean;
}

/**
 * Get default end date (30 days from now)
 */
const getDefaultEndDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().split('T')[0];
};

/**
 * Goal form component using React Hook Form and Zod validation
 */
const GoalForm = ({
  onSubmit,
  onCancel,
  initialData,
  isSubmitting = false,
}: GoalFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description || '',
          targetType: initialData.targetType,
          targetValue: initialData.targetValue,
          startDate: initialData.startDate,
          endDate: initialData.endDate,
        }
      : {
          title: '',
          description: '',
          targetType: undefined,
          targetValue: undefined,
          startDate: getTodayString(),
          endDate: getDefaultEndDate(),
        },
  });

  const targetType = watch('targetType');
  const selectedConfig = targetType ? goalTargetConfig[targetType] : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Goal Title */}
      <div>
        <label htmlFor="title" className="label">
          Goal Title *
        </label>
        <input
          id="title"
          type="text"
          className={`input ${errors.title ? 'input-error' : ''}`}
          placeholder="e.g., Complete 20 Workouts This Month"
          {...register('title')}
        />
        {errors.title && <p className="error-message">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="label">
          Description (optional)
        </label>
        <textarea
          id="description"
          rows={2}
          className={`input resize-none ${errors.description ? 'input-error' : ''}`}
          placeholder="What do you want to achieve?"
          {...register('description')}
        />
        {errors.description && (
          <p className="error-message">{errors.description.message}</p>
        )}
      </div>

      {/* Target Type & Value Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="targetType" className="label">
            Target Type *
          </label>
          <select
            id="targetType"
            className={`input ${errors.targetType ? 'input-error' : ''}`}
            {...register('targetType')}
          >
            <option value="">Select target type</option>
            {Object.entries(goalTargetConfig).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.targetType && (
            <p className="error-message">{errors.targetType.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="targetValue" className="label">
            Target Value {selectedConfig && `(${selectedConfig.unit})`} *
          </label>
          <input
            id="targetValue"
            type="number"
            min="1"
            className={`input ${errors.targetValue ? 'input-error' : ''}`}
            placeholder={selectedConfig ? `e.g., 20 ${selectedConfig.unit}` : 'Enter target'}
            {...register('targetValue', { valueAsNumber: true })}
          />
          {errors.targetValue && (
            <p className="error-message">{errors.targetValue.message}</p>
          )}
        </div>
      </div>

      {/* Date Range Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="label">
            Start Date *
          </label>
          <input
            id="startDate"
            type="date"
            className={`input ${errors.startDate ? 'input-error' : ''}`}
            {...register('startDate')}
          />
          {errors.startDate && (
            <p className="error-message">{errors.startDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="endDate" className="label">
            End Date *
          </label>
          <input
            id="endDate"
            type="date"
            className={`input ${errors.endDate ? 'input-error' : ''}`}
            {...register('endDate')}
          />
          {errors.endDate && (
            <p className="error-message">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? 'Update Goal' : 'Create Goal'}
        </Button>
      </div>
    </form>
  );
};

export default GoalForm;
