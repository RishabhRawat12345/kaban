import React, { useRef } from 'react';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import type { Task } from '../types/kanban';

interface KanbanCardProps {
  task: Task;
  onMoveFocus: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onOpenDetails: (task: Task) => void;
  onCancel: () => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  task,
  onMoveFocus,
  onOpenDetails,
  onCancel,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Hook for keyboard navigation
  useKeyboardNavigation({
    onMove: (direction) => {
      console.log(`Moving ${direction}`);
      onMoveFocus(direction);
    },
    onSelect: () => {
      console.log(`Selecting task: ${task.title}`);
      onOpenDetails(task);
    },
    onCancel: () => {
      console.log('Cancel pressed');
      onCancel();
    },
  });

  return (
    <div
      ref={cardRef}
      tabIndex={0} // Enable keyboard focus
      className="p-3 bg-white border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <h4 className="font-semibold">{task.title || 'New Task'}</h4>
      {task.description && (
        <p className="text-sm text-gray-500">{task.description}</p>
      )}
    </div>
  );
};
