import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { DragStartEvent, DragMoveEvent, DragEndEvent } from "@dnd-kit/core";

import type { Task, Column } from "../../types/kanban";
import { useKanbanState } from "../../hooks/use-kanban-state";
import KanbanColumn from "./kanban-column";
import { KanbanCard } from "./kanban-card";
import { TaskModal } from "./task-modal";
import { createInitialBoardData } from "../../utils/sample-data";

export function KanbanBoard({ taskCount = 15, virtualized = false }) {
  const initialData = createInitialBoardData(taskCount);
  const [boardData, setBoardData] = useState(initialData);
  const { moveTask, reorderTasks, addTask, addColumn } = useKanbanState(initialData);

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = boardData.tasks[event.active.id as string];
    setActiveTask(task ?? null);
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = boardData.tasks[activeId];
    if (!activeTask) return;

    const activeStatus = activeTask.status;
    const overColumn = boardData.columns.find(
      (col) => col.id === overId || col.taskIds.includes(overId)
    );

    if (overColumn && activeStatus !== overColumn.id) {
      const newIndex = overColumn.taskIds.indexOf(overId);
      moveTask(activeId, activeStatus, overColumn.id, newIndex === -1 ? undefined : newIndex);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = boardData.tasks[activeId];
    const overTask = boardData.tasks[overId];

    if (activeTask && overTask && activeTask.status === overTask.status) {
      const column = boardData.columns.find((col) => col.id === activeTask.status)!;
      const oldIndex = column.taskIds.indexOf(activeId);
      const newIndex = column.taskIds.indexOf(overId);

      if (oldIndex !== newIndex) reorderTasks(activeTask.status, activeId, newIndex);
    }
  };
  const handleDeleteTask = (taskId: string) => {
    const newTasks = { ...boardData.tasks };
    delete newTasks[taskId];
    const newColumns = boardData.columns.map((col) => ({
      ...col,
      taskIds: col.taskIds.filter((id) => id !== taskId),
    }));

    setBoardData({ tasks: newTasks, columns: newColumns });
  };

  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) return;

    const newColumn: Column = {
      id: crypto.randomUUID(),
      title: newColumnTitle.trim(),
      taskIds: [],
    };

    addColumn(newColumn);
    setAddingColumn(false);
    setNewColumnTitle("");
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      >
        <main className="h-full overflow-x-auto bg-gray-100 p-6">
          <div className="flex gap-4 h-[calc(100vh-3rem)] min-w-min">
            {boardData.columns.map((column) => {
              const columnTasks = column.taskIds
                .map((id) => boardData.tasks[id])
                .filter(Boolean);

              return (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  tasks={columnTasks}
                  onCardClick={setSelectedTask}
                  onAddTask={addTask}
                  onDeleteTask={handleDeleteTask} 
                  virtualized={virtualized}
                />
              );
            })}
            <div className="w-[300px] min-w-[300px]">
              {addingColumn ? (
                <div className="p-4 border rounded bg-gray-100">
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Column title"
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded-lg"
                      onClick={handleAddColumn}
                    >
                      Add
                    </button>
                    <button
                      className="bg-gray-300 px-3 py-1 rounded-lg"
                      onClick={() => setAddingColumn(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAddingColumn(true)}
                  className="flex w-full h-full items-center justify-center gap-2 border py-2 bg-white rounded-lg hover:bg-gray-50 transition-all"
                >
                  + Add Column
                </button>
              )}
            </div>
          </div>
        </main>
        <DragOverlay>
          {activeTask && (
            <div className="rotate-3">
              <KanbanCard
                task={activeTask}
                onClick={() => {}}
                onDelete={handleDeleteTask}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>
      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </>
  );
}
