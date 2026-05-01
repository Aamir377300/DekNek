import { useState } from 'react';

export default function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onAdd(title.trim(), description.trim());
      setTitle('');
      setDescription('');
      setExpanded(false);
    } catch {
      // error toast handled in hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4">
      <div className="space-y-3">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            onFocus={() => setExpanded(true)}
            placeholder="Add a new task..."
            className={`input-field ${error ? 'border-red-400 focus:ring-red-400' : ''}`}
            maxLength={200}
            aria-label="New task title"
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>

        {expanded && (
          <>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description (optional)"
              className="input-field resize-none"
              rows={2}
              maxLength={1000}
              aria-label="Task description"
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={loading || !title.trim()}
                className="btn-primary"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Adding...
                  </span>
                ) : (
                  'Add Task'
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setExpanded(false);
                  setTitle('');
                  setDescription('');
                  setError('');
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </form>
  );
}
