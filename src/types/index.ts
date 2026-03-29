export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface Board {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  createdAt: string;
  userId: string;
}

export interface Task {
  id: string;
  boardId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  tags: string[];
  createdAt: string;
  order: number;
}

export interface Comment {
  id: string;
  taskId: string;
  content: string;
  authorName: string;
  createdAt: string;
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'review': 'Review',
  'done': 'Done',
};

export const STATUS_COLORS: Record<TaskStatus, string> = {
  'todo': 'bg-status-todo',
  'in-progress': 'bg-status-progress',
  'review': 'bg-status-review',
  'done': 'bg-status-done',
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: 'text-priority-low',
  medium: 'text-priority-medium',
  high: 'text-priority-high',
  urgent: 'text-priority-urgent',
};

export const BOARD_COLORS = [
  '#14b8a6', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#10b981', '#6366f1',
];

export const BOARD_ICONS = ['📋', '🚀', '🎨', '🐛', '💡', '📊', '🎯', '⚡'];
