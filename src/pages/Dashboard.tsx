import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import {
  Activity,
  Clock,
  Flame,
  Target,
  TrendingUp,
  Dumbbell,
} from 'lucide-react';
import { useWorkoutStore, useGoalStore } from '../store';
import { StatsCard, ProgressBar } from '../components/ui';
import {
  exerciseTypeConfig,
  formatDuration,
  getDayNames,
  calculateStreak,
} from '../lib/utils';
import type { WeeklySummary, ExerciseDistribution } from '../types';

/**
 * Dashboard page component
 * Displays workout statistics, charts, and goal progress
 */
const Dashboard = () => {
  const { workouts } = useWorkoutStore();
  const { goals, getActiveGoals } = useGoalStore();

  // Calculate total stats
  const stats = useMemo(() => {
    const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
    const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);
    const activeGoals = getActiveGoals();
    const completedGoals = goals.filter((g) => g.status === 'completed');
    const streak = calculateStreak(workouts);

    return {
      totalWorkouts: workouts.length,
      totalDuration,
      totalCalories,
      activeGoals: activeGoals.length,
      completedGoals: completedGoals.length,
      streak,
    };
  }, [workouts, goals, getActiveGoals]);

  // Prepare weekly summary data for charts
  const weeklySummary = useMemo((): WeeklySummary[] => {
    const dayNames = getDayNames();
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);

    return dayNames.map((day, index) => {
      const currentDate = new Date(weekStart);
      currentDate.setDate(weekStart.getDate() + index);
      const dateStr = currentDate.toISOString().split('T')[0];

      const dayWorkouts = workouts.filter((w) => w.date === dateStr);
      return {
        day,
        workouts: dayWorkouts.length,
        duration: dayWorkouts.reduce((sum, w) => sum + w.duration, 0),
        calories: dayWorkouts.reduce((sum, w) => sum + w.calories, 0),
      };
    });
  }, [workouts]);

  // Prepare exercise distribution data for pie chart
  const exerciseDistribution = useMemo((): ExerciseDistribution[] => {
    const distribution: Record<string, number> = {};

    workouts.forEach((workout) => {
      distribution[workout.exerciseType] =
        (distribution[workout.exerciseType] || 0) + 1;
    });

    return Object.entries(distribution).map(([type, count]) => ({
      name: exerciseTypeConfig[type as keyof typeof exerciseTypeConfig].label,
      value: count,
      color: exerciseTypeConfig[type as keyof typeof exerciseTypeConfig].color,
    }));
  }, [workouts]);

  // Get active goals for display
  const activeGoals = useMemo(() => {
    return goals.filter((g) => g.status === 'active').slice(0, 3);
  }, [goals]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Track your fitness journey and monitor your progress
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          title="Total Workouts"
          value={stats.totalWorkouts}
          subtitle="All time"
          icon={Dumbbell}
          variant="primary"
        />
        <StatsCard
          title="Total Duration"
          value={formatDuration(stats.totalDuration)}
          subtitle="All time"
          icon={Clock}
          variant="success"
        />
        <StatsCard
          title="Calories Burned"
          value={stats.totalCalories.toLocaleString()}
          subtitle="All time"
          icon={Flame}
          variant="warning"
        />
        <StatsCard
          title="Current Streak"
          value={`${stats.streak} days`}
          subtitle="Keep it going!"
          icon={TrendingUp}
          variant="primary"
        />
        <StatsCard
          title="Active Goals"
          value={stats.activeGoals}
          subtitle={`${stats.completedGoals} completed`}
          icon={Target}
          variant="success"
        />
        <StatsCard
          title="This Week"
          value={weeklySummary.reduce((sum, d) => sum + d.workouts, 0)}
          subtitle="Workouts completed"
          icon={Activity}
          variant="primary"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <div className="card">
          <h2 className="section-title mb-4">Weekly Activity</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklySummary}>
                <defs>
                  <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="day" className="fill-gray-500 dark:fill-gray-400" fontSize={12} />
                <YAxis className="fill-gray-500 dark:fill-gray-400" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--tooltip-bg, #fff)',
                    border: '1px solid var(--tooltip-border, #e5e7eb)',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="calories"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCalories)"
                  name="Calories"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Duration by Day Chart */}
        <div className="card">
          <h2 className="section-title mb-4">Duration by Day</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySummary}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="day" className="fill-gray-500 dark:fill-gray-400" fontSize={12} />
                <YAxis className="fill-gray-500 dark:fill-gray-400" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--tooltip-bg, #fff)',
                    border: '1px solid var(--tooltip-border, #e5e7eb)',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`${value} min`, 'Duration']}
                />
                <Bar
                  dataKey="duration"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  name="Duration"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Exercise Distribution & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exercise Type Distribution */}
        <div className="card">
          <h2 className="section-title mb-4">Exercise Distribution</h2>
          {exerciseDistribution.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={exerciseDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {exerciseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              No workout data available
            </div>
          )}
        </div>

        {/* Active Goals Progress */}
        <div className="card">
          <h2 className="section-title mb-4">Active Goals</h2>
          {activeGoals.length > 0 ? (
            <div className="space-y-4">
              {activeGoals.map((goal) => {
                const progress = Math.min(
                  100,
                  (goal.currentValue / goal.targetValue) * 100
                );
                return (
                  <div key={goal.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">{goal.title}</h3>
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                    <ProgressBar value={goal.currentValue} max={goal.targetValue} />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {goal.currentValue} / {goal.targetValue}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              No active goals
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
