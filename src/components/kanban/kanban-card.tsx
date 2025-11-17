import { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Calendar, User, Trash2 } from 'lucide-react';
import type { Task } from '../../types/kanban';
import { cn } from '../../lib/utils';

interface KanbanCardProps {
  task: Task;
  onClick: () => void;
  onDelete: (taskId: string) => void;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800 border-blue-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  urgent: 'bg-red-100 text-red-800 border-red-200',
};

export const KanbanCard = memo(function KanbanCard({ task, onClick, onDelete }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow relative cursor-pointer',
        isDragging && 'opacity-50 shadow-lg ring-2 ring-blue-400'
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 mb-1 truncate">{task.title}</h4>
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{task.description}</p>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={cn('text-xs px-2 py-0.5 rounded-full border font-medium', priorityColors[task.priority])}>
              {task.priority}
            </span>

            {task.tags?.map((tag, index) => (
              <span key={`${tag}-${index}`} className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500">
            {task.assignee && (
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{task.assignee}</span>
              </div>
            )}

            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
          aria-label="Delete Task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});
