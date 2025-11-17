import type { KanbanBoardData, Task } from '../types/kanban';

export function generateSampleTasks(count: number): Task[] {
  const titles = [
    'Implement user authentication',
    'Design landing page',
    'Fix bug in payment flow',
    'Add dark mode support',
    'Optimize database queries',
    'Write API documentation',
    'Setup CI/CD pipeline',
    'Create mobile responsive layout',
    'Add unit tests',
    'Refactor legacy code',
  ];

  const priorities = ['low', 'medium', 'high', 'urgent'] as const;
  const statuses = ['Todo', 'in-progress', 'review', 'done'] as const;
  const assignees = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
  const tags = ['frontend', 'backend', 'design', 'bug', 'feature', 'urgent'];

  const tasks: Task[] = [];
  
  for (let i = 0; i < count; i++) {
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    tasks.push({
      id: `task-${i + 1}`,
      title: `${randomTitle} ${i + 1}`,
      description: `This is a detailed description for task ${i + 1}. It includes information about requirements, implementation details, and acceptance criteria.`,
      status: randomStatus,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      assignee: assignees[Math.floor(Math.random() * assignees.length)],
      tags: [tags[Math.floor(Math.random() * tags.length)], tags[Math.floor(Math.random() * tags.length)]],
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      dueDate: Math.random() > 0.5 ? new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000) : undefined,
    });
  }

  return tasks;
}

export function createInitialBoardData(taskCount: number = 15): KanbanBoardData {
  const tasks = generateSampleTasks(taskCount);
  
  const tasksById = tasks.reduce((acc, task) => {
    acc[task.id] = task;
    return acc;
  }, {} as Record<string, Task>);

  const columns = [
    {
      id: 'Todo' as const,
      title: 'Todo',
      taskIds: tasks.filter((t) => t.status === 'Todo').map((t) => t.id),
    },
    {
      id: 'in-progress' as const,
      title: 'In Progress',
      taskIds: tasks.filter((t) => t.status === 'in-progress').map((t) => t.id),
    },
    {
      id: 'review' as const,
      title: 'Review',
      taskIds: tasks.filter((t) => t.status === 'review').map((t) => t.id),
    },
    {
      id: 'done' as const,
      title: 'Done',
      taskIds: tasks.filter((t) => t.status === 'done').map((t) => t.id),
    },
  ];

  return { columns, tasks: tasksById };
}
