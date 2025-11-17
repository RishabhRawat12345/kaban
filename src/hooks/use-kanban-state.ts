// hooks/use-kanban-state.ts
import { useState } from "react";
import type { KanbanBoardData, Task, Column } from "../types/kanban";

export const useKanbanState = (initialData: KanbanBoardData) => {
  const [data, setData] = useState(initialData);

  const addTask = (task: Task) => {
    setData((prev) => {
      const column = prev.columns.find((col) => col.id === task.status);
      if (!column) return prev;

      return {
        ...prev,
        tasks: { ...prev.tasks, [task.id]: task },
        columns: prev.columns.map((col) =>
          col.id === column.id
            ? { ...col, taskIds: [...col.taskIds, task.id] }
            : col
        ),
      };
    });
  };

  const addColumn = (newColumn: Column) => {
    setData((prev) => ({
      ...prev,
      columns: [...prev.columns, newColumn],
    }));
  };

  const moveTask = (
    taskId: string,
    fromColumnId: string,
    toColumnId: string,
    newIndex?: number
  ) => {
    setData((prev) => {
      if (!prev.tasks[taskId]) return prev;

      const updatedTasks = { ...prev.tasks };
      updatedTasks[taskId] = {
        ...updatedTasks[taskId],
        status: toColumnId,
      };

      const updatedColumns = prev.columns.map((col) => {
        if (col.id === fromColumnId) {
          return { ...col, taskIds: col.taskIds.filter((id) => id !== taskId) };
        }
        if (col.id === toColumnId) {
          const newTaskIds = [...col.taskIds];
          if (newIndex !== undefined) {
            newTaskIds.splice(newIndex, 0, taskId);
          } else {
            newTaskIds.push(taskId);
          }
          return { ...col, taskIds: newTaskIds };
        }
        return col;
      });

      return { ...prev, tasks: updatedTasks, columns: updatedColumns };
    });
  };

  const reorderTasks = (columnId: string, taskId: string, newIndex: number) => {
    setData((prev) => {
      const col = prev.columns.find((c) => c.id === columnId);
      if (!col) return prev;

      const newTaskIds = [...col.taskIds];
      const oldIndex = newTaskIds.indexOf(taskId);
      if (oldIndex === -1 || newIndex === -1) return prev;

      newTaskIds.splice(oldIndex, 1);
      newTaskIds.splice(newIndex, 0, taskId);

      return {
        ...prev,
        columns: prev.columns.map((c) =>
          c.id === columnId ? { ...c, taskIds: newTaskIds } : c
        ),
      };
    });
  };

  return {
    data,
    addTask,
    addColumn,
    moveTask,
    reorderTasks,
  };
};
