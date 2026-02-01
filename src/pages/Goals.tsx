import { useState, useMemo } from 'react';
import {
  Plus,
  Target,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { useGoalStore } from '../store';
import { Button, Modal, EmptyState, ProgressBar } from '../components/ui';
import { GoalForm } from '../components/forms';
import { goalTargetConfig, formatDate } from '../lib/utils';
import type { GoalFormData } from '../lib/validations';
import type { Goal, GoalStatus } from '../types';

/**
 * Status badge colors and labels
 */
const statusConfig: Record<GoalStatus, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: 'text-blue-700', bg: 'bg-blue-100' },
  completed: { label: 'Completed', color: 'text-green-700', bg: 'bg-green-100' },
  cancelled: { label: 'Cancelled', color: 'text-gray-700', bg: 'bg-gray-100' },
};

/**
 * Goals page component
 * Displays goal list with CRUD operations and progress tracking
 */
const Goals = () => {
  const {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    updateProgress,
    completeGoal,
    cancelGoal,
    reactivateGoal,
  } = useGoalStore();

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);
  const [progressModalGoal, setProgressModalGoal] = useState<Goal | null>(null);
  const [newProgressValue, setNewProgressValue] = useState('');

  // Filter state
  const [statusFilter, setStatusFilter] = useState<GoalStatus | 'all'>('all');

  // Filter and sort goals
  const filteredGoals = useMemo(() => {
    return goals
      .filter((goal) => statusFilter === 'all' || goal.status === statusFilter)
      .sort((a, b) => {
        // Active goals first, then by creation date
        if (a.status === 'active' && b.status !== 'active') return -1;
        if (b.status === 'active' && a.status !== 'active') return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [goals, statusFilter]);

  // Handle form submission
  const handleSubmit = (data: GoalFormData) => {
    if (editingGoal) {
      updateGoal(editingGoal.id, data);
    } else {
      addGoal(data);
    }
    handleCloseForm();
  };

  // Open form for new goal
  const handleAddNew = () => {
    setEditingGoal(null);
    setIsFormOpen(true);
  };

  // Open form for editing
  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setIsFormOpen(true);
  };

  // Close form modal
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingGoal(null);
  };

  // Delete confirmation
  const handleDeleteClick = (goal: Goal) => {
    setGoalToDelete(goal);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (goalToDelete) {
      deleteGoal(goalToDelete.id);
    }
    setIsDeleteModalOpen(false);
    setGoalToDelete(null);
  };

  // Progress update
  const handleOpenProgressModal = (goal: Goal) => {
    setProgressModalGoal(goal);
    setNewProgressValue(goal.currentValue.toString());
  };

  const handleUpdateProgress = () => {
    if (progressModalGoal && newProgressValue) {
      const value = parseFloat(newProgressValue);
      if (!isNaN(value) && value >= 0) {
        updateProgress(progressModalGoal.id, value);
      }
    }
    setProgressModalGoal(null);
    setNewProgressValue('');
  };

  // Goal stats
  const stats = useMemo(() => {
    const active = goals.filter((g) => g.status === 'active').length;
    const completed = goals.filter((g) => g.status === 'completed').length;
    const totalProgress = goals
      .filter((g) => g.status === 'active')
      .reduce((sum, g) => sum + (g.currentValue / g.targetValue) * 100, 0);
    const avgProgress = active > 0 ? totalProgress / active : 0;
    return { active, completed, avgProgress };
  }, [goals]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Goals</h1>
          <p className="text-gray-500 mt-1">
            Set fitness goals and track your progress
          </p>
        </div>
        <Button onClick={handleAddNew} leftIcon={<Plus className="w-4 h-4" />}>
          Create Goal
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Goals</p>
            <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-xl">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-primary-100 rounded-xl">
            <TrendingUp className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Avg. Progress</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.avgProgress.toFixed(0)}%
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {(['all', 'active', 'completed', 'cancelled'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              statusFilter === status
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'All Goals' : statusConfig[status].label}
            {status === 'all' && ` (${goals.length})`}
            {status !== 'all' &&
              ` (${goals.filter((g) => g.status === status).length})`}
          </button>
        ))}
      </div>

      {/* Goals List */}
      {filteredGoals.length > 0 ? (
        <div className="space-y-4">
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={() => handleEdit(goal)}
              onDelete={() => handleDeleteClick(goal)}
              onUpdateProgress={() => handleOpenProgressModal(goal)}
              onComplete={() => completeGoal(goal.id)}
              onCancel={() => cancelGoal(goal.id)}
              onReactivate={() => reactivateGoal(goal.id)}
            />
          ))}
        </div>
      ) : (
        <div className="card">
          <EmptyState
            icon={Target}
            title="No goals found"
            description={
              statusFilter !== 'all'
                ? `You don't have any ${statusFilter} goals.`
                : 'Create your first fitness goal to start tracking your progress.'
            }
            actionLabel={statusFilter === 'all' ? 'Create Goal' : undefined}
            onAction={statusFilter === 'all' ? handleAddNew : undefined}
          />
        </div>
      )}

      {/* Add/Edit Goal Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingGoal ? 'Edit Goal' : 'Create New Goal'}
        size="lg"
      >
        <GoalForm
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
          initialData={editingGoal || undefined}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Goal"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete{' '}
            <span className="font-medium text-gray-900">
              "{goalToDelete?.title}"
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

      {/* Update Progress Modal */}
      <Modal
        isOpen={!!progressModalGoal}
        onClose={() => setProgressModalGoal(null)}
        title="Update Progress"
        size="sm"
      >
        {progressModalGoal && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-2">
                {progressModalGoal.title}
              </p>
              <p className="text-sm text-gray-600">
                Target: {progressModalGoal.targetValue}{' '}
                {goalTargetConfig[progressModalGoal.targetType].unit}
              </p>
            </div>
            <div>
              <label htmlFor="progress" className="label">
                Current Progress (
                {goalTargetConfig[progressModalGoal.targetType].unit})
              </label>
              <input
                id="progress"
                type="number"
                min="0"
                step="1"
                value={newProgressValue}
                onChange={(e) => setNewProgressValue(e.target.value)}
                className="input"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setProgressModalGoal(null)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateProgress}>Update</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

/**
 * Individual goal card component
 */
interface GoalCardProps {
  goal: Goal;
  onEdit: () => void;
  onDelete: () => void;
  onUpdateProgress: () => void;
  onComplete: () => void;
  onCancel: () => void;
  onReactivate: () => void;
}

const GoalCard = ({
  goal,
  onEdit,
  onDelete,
  onUpdateProgress,
  onComplete,
  onCancel,
  onReactivate,
}: GoalCardProps) => {
  const progress = Math.min(100, (goal.currentValue / goal.targetValue) * 100);
  const targetConfig = goalTargetConfig[goal.targetType];
  const status = statusConfig[goal.status];
  const isActive = goal.status === 'active';

  // Calculate days remaining
  const daysRemaining = Math.ceil(
    (new Date(goal.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900">{goal.title}</h3>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color} ${status.bg}`}
            >
              {status.label}
            </span>
          </div>
          {goal.description && (
            <p className="text-sm text-gray-500 mt-1">{goal.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isActive && (
            <button
              onClick={onUpdateProgress}
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              aria-label="Update progress"
              title="Update Progress"
            >
              <TrendingUp className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            aria-label="Edit goal"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Delete goal"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            {goal.currentValue} / {goal.targetValue} {targetConfig.unit}
          </span>
          <span className="text-sm font-medium text-primary-600">
            {progress.toFixed(0)}%
          </span>
        </div>
        <ProgressBar value={goal.currentValue} max={goal.targetValue} size="lg" />
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDate(goal.startDate)} - {formatDate(goal.endDate)}
          </span>
          {isActive && (
            <span className={daysRemaining < 7 ? 'text-red-600 font-medium' : ''}>
              {daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {isActive && progress < 100 && (
            <>
              <Button
                size="sm"
                variant="success"
                onClick={onComplete}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Complete
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={onCancel}
                leftIcon={<XCircle className="w-4 h-4" />}
              >
                Cancel
              </Button>
            </>
          )}
          {(goal.status === 'completed' || goal.status === 'cancelled') && (
            <Button
              size="sm"
              variant="secondary"
              onClick={onReactivate}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Reactivate
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Goals;
