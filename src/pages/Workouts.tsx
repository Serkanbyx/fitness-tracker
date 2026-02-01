import { useState, useMemo } from 'react';
import { Plus, Search, Trash2, Edit2, Dumbbell, Filter } from 'lucide-react';
import { useWorkoutStore } from '../store';
import { Button, Modal, EmptyState } from '../components/ui';
import { WorkoutForm } from '../components/forms';
import {
  exerciseTypeConfig,
  intensityConfig,
  formatDate,
  formatDuration,
  formatRelativeDate,
} from '../lib/utils';
import type { WorkoutFormData } from '../lib/validations';
import type { Workout, ExerciseType } from '../types';

/**
 * Workouts page component
 * Displays workout list with CRUD operations
 */
const Workouts = () => {
  const { workouts, addWorkout, updateWorkout, deleteWorkout } = useWorkoutStore();

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState<Workout | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ExerciseType | 'all'>('all');

  // Filter workouts based on search and type
  const filteredWorkouts = useMemo(() => {
    return workouts
      .filter((workout) => {
        const matchesSearch = workout.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesType =
          selectedType === 'all' || workout.exerciseType === selectedType;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [workouts, searchQuery, selectedType]);

  // Handle form submission (create or update)
  const handleSubmit = (data: WorkoutFormData) => {
    if (editingWorkout) {
      updateWorkout(editingWorkout.id, data);
    } else {
      addWorkout(data);
    }
    handleCloseForm();
  };

  // Open form for creating new workout
  const handleAddNew = () => {
    setEditingWorkout(null);
    setIsFormOpen(true);
  };

  // Open form for editing existing workout
  const handleEdit = (workout: Workout) => {
    setEditingWorkout(workout);
    setIsFormOpen(true);
  };

  // Close form modal
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingWorkout(null);
  };

  // Open delete confirmation modal
  const handleDeleteClick = (workout: Workout) => {
    setWorkoutToDelete(workout);
    setIsDeleteModalOpen(true);
  };

  // Confirm and delete workout
  const handleConfirmDelete = () => {
    if (workoutToDelete) {
      deleteWorkout(workoutToDelete.id);
    }
    setIsDeleteModalOpen(false);
    setWorkoutToDelete(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Workouts</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Log and manage your workout sessions
          </p>
        </div>
        <Button onClick={handleAddNew} leftIcon={<Plus className="w-4 h-4" />}>
          Add Workout
        </Button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search workouts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Type Filter */}
          <div className="relative sm:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ExerciseType | 'all')}
              className="input pl-10 appearance-none cursor-pointer"
            >
              <option value="all">All Types</option>
              {Object.entries(exerciseTypeConfig).map(([value, { label }]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Workouts List */}
      {filteredWorkouts.length > 0 ? (
        <div className="space-y-4">
          {filteredWorkouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onEdit={() => handleEdit(workout)}
              onDelete={() => handleDeleteClick(workout)}
            />
          ))}
        </div>
      ) : (
        <div className="card">
          <EmptyState
            icon={Dumbbell}
            title="No workouts found"
            description={
              searchQuery || selectedType !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'Start logging your workouts to track your fitness journey.'
            }
            actionLabel={searchQuery || selectedType !== 'all' ? undefined : 'Add Workout'}
            onAction={searchQuery || selectedType !== 'all' ? undefined : handleAddNew}
          />
        </div>
      )}

      {/* Add/Edit Workout Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingWorkout ? 'Edit Workout' : 'Add New Workout'}
        size="lg"
      >
        <WorkoutForm
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
          initialData={editingWorkout || undefined}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Workout"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete{' '}
            <span className="font-medium text-gray-900 dark:text-white">
              "{workoutToDelete?.name}"
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

/**
 * Individual workout card component
 */
interface WorkoutCardProps {
  workout: Workout;
  onEdit: () => void;
  onDelete: () => void;
}

const WorkoutCard = ({ workout, onEdit, onDelete }: WorkoutCardProps) => {
  const typeConfig = exerciseTypeConfig[workout.exerciseType];
  const intensityLevelConfig = intensityConfig[workout.intensity];

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Exercise Type Badge */}
        <div
          className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${typeConfig.color}20` }}
        >
          <Dumbbell className="w-6 h-6" style={{ color: typeConfig.color }} />
        </div>

        {/* Workout Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {workout.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatRelativeDate(workout.date)} • {formatDate(workout.date)}
              </p>
            </div>
            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={onEdit}
                className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/50 rounded-lg transition-colors"
                aria-label="Edit workout"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                aria-label="Delete workout"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${typeConfig.color}20`,
                color: typeConfig.color,
              }}
            >
              {typeConfig.label}
            </span>
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${intensityLevelConfig.color}20`,
                color: intensityLevelConfig.color,
              }}
            >
              {intensityLevelConfig.label} Intensity
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {formatDuration(workout.duration)}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {workout.calories} cal
            </span>
            {workout.sets && workout.reps && (
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {workout.sets}×{workout.reps}
                {workout.weight && ` @ ${workout.weight}kg`}
              </span>
            )}
          </div>

          {/* Notes */}
          {workout.notes && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
              {workout.notes}
            </p>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex sm:hidden items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <Button
            variant="secondary"
            size="sm"
            onClick={onEdit}
            leftIcon={<Edit2 className="w-4 h-4" />}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onDelete}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Workouts;
