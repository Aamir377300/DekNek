import { useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';
import toast from 'react-hot-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/tasks');
      setTasks(data.tasks);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load tasks';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = useCallback(async (title, description) => {
    const toastId = toast.loading('Creating task...');
    try {
      const { data } = await api.post('/tasks', { title, description });
      setTasks((prev) => [data.task, ...prev]);
      toast.success('Task created!', { id: toastId });
      return data.task;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create task';
      toast.error(msg, { id: toastId });
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (id, updates) => {
    try {
      const { data } = await api.put(`/tasks/${id}`, updates);
      setTasks((prev) => prev.map((t) => (t._id === id ? data.task : t)));
      return data.task;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update task';
      toast.error(msg);
      throw err;
    }
  }, []);

  const toggleTask = useCallback(
    async (task) => {
      const newStatus = task.status === 'pending' ? 'completed' : 'pending';
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t))
      );
      try {
        await api.put(`/tasks/${task._id}`, { status: newStatus });
      } catch (err) {
        // Revert on failure
        setTasks((prev) =>
          prev.map((t) => (t._id === task._id ? { ...t, status: task.status } : t))
        );
        toast.error('Failed to update task status');
      }
    },
    []
  );

  const deleteTask = useCallback(async (id) => {
    const toastId = toast.loading('Deleting task...');
    // Optimistic update
    setTasks((prev) => prev.filter((t) => t._id !== id));
    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Task deleted', { id: toastId });
    } catch (err) {
      // Revert on failure
      fetchTasks();
      const msg = err.response?.data?.message || 'Failed to delete task';
      toast.error(msg, { id: toastId });
    }
  }, [fetchTasks]);

  return { tasks, loading, error, fetchTasks, createTask, updateTask, toggleTask, deleteTask };
};
