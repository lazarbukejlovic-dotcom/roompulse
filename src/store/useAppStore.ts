import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Board, Task, Comment, TaskStatus } from '@/types';

const uid = () => crypto.randomUUID();
const now = () => new Date().toISOString();

const MOCK_USER: User = { id: 'u1', name: 'Alex Chen', email: 'alex@roompulse.dev', createdAt: '2024-01-15T00:00:00Z' };

const SAMPLE_BOARDS: Board[] = [
  { id: 'b1', title: 'Product Launch', description: 'Q2 product launch planning and execution', color: '#14b8a6', icon: '🚀', createdAt: '2024-02-01T00:00:00Z', userId: 'u1' },
  { id: 'b2', title: 'Bug Tracker', description: 'Track and resolve reported bugs', color: '#ef4444', icon: '🐛', createdAt: '2024-02-10T00:00:00Z', userId: 'u1' },
  { id: 'b3', title: 'Design System', description: 'Component library and design tokens', color: '#8b5cf6', icon: '🎨', createdAt: '2024-03-01T00:00:00Z', userId: 'u1' },
  { id: 'b4', title: 'Marketing', description: 'Campaign planning and content calendar', color: '#f59e0b', icon: '📊', createdAt: '2024-03-15T00:00:00Z', userId: 'u1' },
];

const SAMPLE_TASKS: Task[] = [
  { id: 't1', boardId: 'b1', title: 'Define launch timeline', description: 'Create a detailed timeline for the Q2 launch milestones', status: 'done', priority: 'high', dueDate: '2024-04-15', tags: ['planning'], createdAt: '2024-02-05T00:00:00Z', order: 0 },
  { id: 't2', boardId: 'b1', title: 'Prepare press kit', description: 'Design and compile press materials', status: 'in-progress', priority: 'medium', dueDate: '2024-04-20', tags: ['marketing', 'design'], createdAt: '2024-02-10T00:00:00Z', order: 0 },
  { id: 't3', boardId: 'b1', title: 'Beta user onboarding', description: 'Set up onboarding flow for beta testers', status: 'todo', priority: 'high', dueDate: '2024-04-25', tags: ['product'], createdAt: '2024-02-12T00:00:00Z', order: 0 },
  { id: 't4', boardId: 'b1', title: 'Review pricing page', description: 'Final review of pricing tiers and copy', status: 'review', priority: 'urgent', dueDate: '2024-04-10', tags: ['copy'], createdAt: '2024-02-15T00:00:00Z', order: 0 },
  { id: 't5', boardId: 'b2', title: 'Fix auth redirect loop', description: 'Users stuck in redirect loop after login on Safari', status: 'in-progress', priority: 'urgent', dueDate: '2024-04-08', tags: ['auth', 'critical'], createdAt: '2024-03-01T00:00:00Z', order: 0 },
  { id: 't6', boardId: 'b2', title: 'Mobile layout overflow', description: 'Cards overflow on small screens', status: 'todo', priority: 'medium', dueDate: '2024-04-12', tags: ['ui'], createdAt: '2024-03-05T00:00:00Z', order: 0 },
  { id: 't7', boardId: 'b3', title: 'Button component variants', description: 'Add ghost, outline, and link variants', status: 'done', priority: 'medium', dueDate: null, tags: ['components'], createdAt: '2024-03-10T00:00:00Z', order: 0 },
  { id: 't8', boardId: 'b3', title: 'Color token audit', description: 'Audit and standardize all color tokens', status: 'in-progress', priority: 'low', dueDate: '2024-04-30', tags: ['tokens'], createdAt: '2024-03-12T00:00:00Z', order: 0 },
  { id: 't9', boardId: 'b4', title: 'Social media calendar', description: 'Plan April social media content', status: 'todo', priority: 'medium', dueDate: '2024-04-05', tags: ['social'], createdAt: '2024-03-20T00:00:00Z', order: 0 },
  { id: 't10', boardId: 'b4', title: 'Email campaign draft', description: 'Write launch announcement email', status: 'review', priority: 'high', dueDate: '2024-04-18', tags: ['email', 'launch'], createdAt: '2024-03-22T00:00:00Z', order: 0 },
];

const SAMPLE_COMMENTS: Comment[] = [
  { id: 'c1', taskId: 't5', content: 'Reproduced on Safari 17.2. Looks like a cookie issue.', authorName: 'Alex Chen', createdAt: '2024-03-02T10:00:00Z' },
  { id: 'c2', taskId: 't5', content: 'Patched the SameSite attribute. Testing now.', authorName: 'Alex Chen', createdAt: '2024-03-03T14:30:00Z' },
  { id: 'c3', taskId: 't4', content: 'Pricing looks good — just need final copy review from marketing.', authorName: 'Alex Chen', createdAt: '2024-02-20T09:00:00Z' },
];

interface AppState {
  user: User | null;
  boards: Board[];
  tasks: Task[];
  comments: Comment[];
  darkMode: boolean;
  sidebarOpen: boolean;
  // Auth
  signIn: (email: string, _password: string) => boolean;
  signUp: (name: string, email: string, _password: string) => boolean;
  signOut: () => void;
  updateProfile: (data: Partial<User>) => void;
  // Dark mode
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  // Boards
  addBoard: (b: Omit<Board, 'id' | 'createdAt' | 'userId'>) => void;
  updateBoard: (id: string, b: Partial<Board>) => void;
  deleteBoard: (id: string) => void;
  // Tasks
  addTask: (t: Omit<Task, 'id' | 'createdAt' | 'order'>) => void;
  updateTask: (id: string, t: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: TaskStatus, newIndex: number) => void;
  // Comments
  addComment: (c: Omit<Comment, 'id' | 'createdAt'>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      boards: SAMPLE_BOARDS,
      tasks: SAMPLE_TASKS,
      comments: SAMPLE_COMMENTS,
      darkMode: false,
      sidebarOpen: true,

      signIn: (email) => {
        set({ user: { ...MOCK_USER, email } });
        return true;
      },
      signUp: (name, email) => {
        set({ user: { id: uid(), name, email, createdAt: now() } });
        return true;
      },
      signOut: () => set({ user: null }),
      updateProfile: (data) => {
        const user = get().user;
        if (user) set({ user: { ...user, ...data } });
      },

      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

      addBoard: (b) => set((s) => ({ boards: [...s.boards, { ...b, id: uid(), createdAt: now(), userId: s.user?.id || '' }] })),
      updateBoard: (id, b) => set((s) => ({ boards: s.boards.map((x) => (x.id === id ? { ...x, ...b } : x)) })),
      deleteBoard: (id) => set((s) => ({ boards: s.boards.filter((x) => x.id !== id), tasks: s.tasks.filter((t) => t.boardId !== id) })),

      addTask: (t) => set((s) => ({ tasks: [...s.tasks, { ...t, id: uid(), createdAt: now(), order: s.tasks.filter((x) => x.boardId === t.boardId && x.status === t.status).length }] })),
      updateTask: (id, t) => set((s) => ({ tasks: s.tasks.map((x) => (x.id === id ? { ...x, ...t } : x)) })),
      deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((x) => x.id !== id), comments: s.comments.filter((c) => c.taskId !== id) })),
      moveTask: (taskId, newStatus, newIndex) => set((s) => {
        const tasks = [...s.tasks];
        const idx = tasks.findIndex((t) => t.id === taskId);
        if (idx === -1) return s;
        tasks[idx] = { ...tasks[idx], status: newStatus, order: newIndex };
        return { tasks };
      }),

      addComment: (c) => set((s) => ({ comments: [...s.comments, { ...c, id: uid(), createdAt: now() }] })),
    }),
    { name: 'roompulse-storage' }
  )
);
