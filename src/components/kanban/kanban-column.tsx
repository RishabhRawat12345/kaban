import { useState } from 'react';
import type { Column, Task, Priority } from '../../types/kanban';
import { KanbanCard } from './kanban-card';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onCardClick: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  virtualized?: boolean; 
}

export default function KanbanColumn({
  column,
  tasks,
  onAddTask,
  onCardClick,
  onDeleteTask,
}: KanbanColumnProps) {
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'low' as Priority,
    tags: '',
    assignee: '',
    dueDate: '',
  });

  const handleCreateTask = () => {
    if (!formData.title.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: formData.title.trim(),
      description: formData.description,
      priority: formData.priority,
      status: column.id,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      assignee: formData.assignee,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onAddTask(newTask);
    setCreating(false);
    setFormData({ title: '', description: '', priority: 'low', tags: '', assignee: '', dueDate: '' });
  };

  return (
    <div className="flex flex-col bg-gray-50 rounded-lg border border-gray-200 min-w-[320px] max-w-[360px] h-full shadow-sm">

      {/* Header */}
      <header className="sticky top-0 z-10 px-4 py-3 border-b bg-white rounded-t-lg flex justify-between items-center shadow-sm">
        <h3 className="font-semibold text-gray-700">{column.title}</h3>
        <span className="text-xs bg-gray-200 px-2 py-1 rounded-lg">{tasks.length}</span>
      </header>

      {/* Scrollable Task List */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto">
        {tasks.length === 0 ? (
          <p className="text-gray-400 text-center mt-8">No tasks yet</p>
        ) : (
          tasks.map(task => (
            <KanbanCard
              key={task.id}
              task={task}
              onClick={() => onCardClick(task)}
              onDelete={() => onDeleteTask(task.id)} // ✅ wrap so task ID is passed
            />
          ))
        )}
      </div>

      {/* Sticky Footer: Add Task */}
      <footer className="sticky bottom-0 bg-gray-50 border-t p-3">
        {creating ? (
          <div className="rounded-lg bg-white p-4 shadow-sm border space-y-3 max-h-[400px] overflow-y-auto">
            <input
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              type="text"
              placeholder="Task title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <textarea
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              placeholder="Description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              <input
                className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
            <input
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              type="text"
              placeholder="Tags (comma-separated)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
            <input
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              type="text"
              placeholder="Assignee"
              value={formData.assignee}
              onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                onClick={handleCreateTask}
              >
                Create
              </button>
              <button
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                onClick={() => setCreating(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            className="w-full py-2 text-sm text-gray-600 hover:bg-gray-200 flex justify-center items-center gap-2 border rounded-lg bg-white"
            onClick={() => setCreating(true)}
          >
            <Plus className="w-4 h-4" /> Add Task
          </button>
        )}
      </footer>
    </div>
  );
}
