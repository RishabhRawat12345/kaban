
export type Priority = 'low' | 'medium' | 'high' | 'urgent';


export type DefaultTaskStatus = 'Todo' | 'in-progress' | 'review' | 'done';


export interface Task {
  id: string;
  title: string;
  description: string;
  status: DefaultTaskStatus | string; 
  priority: Priority;
  assignee?: string; 
  tags?: string[];   
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;    
}


export interface Column {
  id: DefaultTaskStatus | string; 
  title: string;                  
  taskIds: string[];             
}


export interface KanbanBoardData {
  columns: Column[];
  tasks: Record<string, Task>;   
}
