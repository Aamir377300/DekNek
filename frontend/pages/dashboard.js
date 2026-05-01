import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import AddTaskForm from '../components/AddTaskForm';
import TaskCard from '../components/TaskCard';
import StatsBar from '../components/StatsBar';
import Spinner from '../components/Spinner';

const FILTERS = ['all', 'pending', 'completed'];

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { tasks, loading, error, createTask, updateTask, toggleTask, deleteTask } = useTasks();
  const [filter, setFilter] = useState('all');

  // Protect route
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  return (
    <Layout title="Dashboard — TaskFlow Pro">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Good {getGreeting()}, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">Here&apos;s what&apos;s on your plate today.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Add task */}
            <AddTaskForm onAdd={createTask} />

            {/* Filter tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    filter === f
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {f}
                  {f !== 'all' && (
                    <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                      f === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {tasks.filter((t) => t.status === f).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Task list */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Spinner size="lg" />
              </div>
            ) : error ? (
              <div className="card p-8 text-center">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <EmptyState filter={filter} />
            ) : (
              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                    onUpdate={updateTask}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right column — stats */}
          <div className="space-y-4">
            <StatsBar tasks={tasks} />

            {/* Tips card */}
            <div className="card p-4 bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-0">
              <h3 className="font-semibold text-sm mb-2">💡 Quick tip</h3>
              <p className="text-xs text-blue-100 leading-relaxed">
                Click the checkbox to mark a task complete. Use the pencil icon to edit, and the trash icon to delete.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function EmptyState({ filter }) {
  const messages = {
    all: { icon: '📋', title: 'No tasks yet', sub: 'Add your first task above to get started.' },
    pending: { icon: '⏳', title: 'No pending tasks', sub: "You're all caught up!" },
    completed: { icon: '🎉', title: 'No completed tasks', sub: 'Complete a task to see it here.' },
  };
  const { icon, title, sub } = messages[filter];

  return (
    <div className="card p-12 text-center">
      <p className="text-4xl mb-3">{icon}</p>
      <p className="text-gray-700 font-medium">{title}</p>
      <p className="text-gray-400 text-sm mt-1">{sub}</p>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}
