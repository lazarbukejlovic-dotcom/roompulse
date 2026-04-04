import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Board, Task, Comment, TaskStatus } from '@/types';

const uid = () => crypto.randomUUID();
const now = () => new Date().toISOString();

const MOCK_USER: User = { id: 'u1', name: 'Alex Chen', email: 'alex@roompulse.dev', createdAt: '2024-01-15T00:00:00Z' };

const SAMPLE_BOARDS: Board[] = [
  { id: 'b1', title: 'Q2 Product Launch', description: 'Cross-functional delivery for the June release', color: '#14b8a6', icon: '🚀', createdAt: '2024-02-01T00:00:00Z', userId: 'u1' },
  { id: 'b2', title: 'Platform Stability', description: 'Critical bugs, regressions, and infra debt', color: '#ef4444', icon: '🛡️', createdAt: '2024-02-10T00:00:00Z', userId: 'u1' },
  { id: 'b3', title: 'Design System v2', description: 'Component audit, token migration, accessibility pass', color: '#8b5cf6', icon: '🎨', createdAt: '2024-03-01T00:00:00Z', userId: 'u1' },
  { id: 'b4', title: 'Go-to-Market Ops', description: 'Launch comms, enablement, and campaign coordination', color: '#f59e0b', icon: '📡', createdAt: '2024-03-15T00:00:00Z', userId: 'u1' },
];

// Generate realistic dates relative to now
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();
const daysFromNow = (d: number) => new Date(Date.now() + d * 86400000).toISOString().slice(0, 10);
const daysAgoDate = (d: number) => new Date(Date.now() - d * 86400000).toISOString().slice(0, 10);

const SAMPLE_TASKS: Task[] = [
  { id: 't1', boardId: 'b1', title: 'Finalize release scope with eng leads', description: 'Lock feature set for June — no new additions after sign-off', status: 'done', priority: 'high', dueDate: daysAgoDate(5), tags: ['scope'], createdAt: daysAgo(30), order: 0, assignee: 'Alex Chen' },
  { id: 't2', boardId: 'b1', title: 'Prepare launch assets and press kit', description: 'Design hero visuals, write press blurb, coordinate with marketing', status: 'in-progress', priority: 'medium', dueDate: daysFromNow(4), tags: ['marketing', 'design'], createdAt: daysAgo(20), order: 0, assignee: 'Priya Sharma' },
  { id: 't3', boardId: 'b1', title: 'Set up beta onboarding flow', description: 'Invite flow, welcome email, and first-run walkthrough', status: 'todo', priority: 'high', dueDate: daysFromNow(8), tags: ['product', 'onboarding'], createdAt: daysAgo(15), order: 0, assignee: 'Jordan Lee' },
  { id: 't4', boardId: 'b1', title: 'Pricing page — final copy review', description: 'Marketing and product need to sign off on tier language', status: 'review', priority: 'urgent', dueDate: daysAgoDate(2), tags: ['copy', 'launch'], createdAt: daysAgo(12), order: 0, assignee: 'Priya Sharma', blocked: true, blockedReason: 'Waiting on legal review of pricing terms' },
  { id: 't5', boardId: 'b2', title: 'Fix auth redirect loop on Safari', description: 'Users get stuck in a redirect cycle after login — SameSite cookie issue', status: 'in-progress', priority: 'urgent', dueDate: daysFromNow(1), tags: ['auth', 'critical'], createdAt: daysAgo(7), order: 0, assignee: 'Alex Chen' },
  { id: 't6', boardId: 'b2', title: 'Card layout overflow on mobile', description: 'Task cards clip on screens below 375px', status: 'todo', priority: 'medium', dueDate: daysFromNow(5), tags: ['ui', 'responsive'], createdAt: daysAgo(5), order: 0, assignee: 'Jordan Lee', blocked: true, blockedReason: 'Needs design spec from Priya' },
  { id: 't7', boardId: 'b3', title: 'Button component — add ghost and link variants', description: 'Extend CVA config, update Storybook', status: 'done', priority: 'medium', dueDate: null, tags: ['components'], createdAt: daysAgo(25), order: 0, assignee: 'Jordan Lee' },
  { id: 't8', boardId: 'b3', title: 'Audit color tokens against WCAG', description: 'Verify contrast ratios across all semantic tokens', status: 'in-progress', priority: 'low', dueDate: daysFromNow(14), tags: ['accessibility', 'tokens'], createdAt: daysAgo(10), order: 0, assignee: 'Priya Sharma' },
  { id: 't9', boardId: 'b4', title: 'Draft social media calendar for launch week', description: 'Plan 5-day content rollout across Twitter, LinkedIn, Product Hunt', status: 'todo', priority: 'medium', dueDate: daysAgoDate(1), tags: ['social', 'launch'], createdAt: daysAgo(8), order: 0, assignee: 'Alex Chen' },
  { id: 't10', boardId: 'b4', title: 'Write launch announcement email', description: 'Segment: active users + waitlist. Include changelog link.', status: 'review', priority: 'high', dueDate: daysFromNow(3), tags: ['email', 'launch'], createdAt: daysAgo(6), order: 0, assignee: 'Priya Sharma' },
];

const SAMPLE_COMMENTS: Comment[] = [
  { id: 'c1', taskId: 't5', content: 'Reproduced on Safari 17.2. Looks like the SameSite=Lax default is causing the loop.', authorName: 'Alex Chen', createdAt: daysAgo(3) },
  { id: 'c2', taskId: 't5', content: 'Patched the cookie attribute. Deployed to staging — need QA confirmation before merging.', authorName: 'Jordan Lee', createdAt: daysAgo(2) },
  { id: 'c3', taskId: 't4', content: 'Legal flagged the "unlimited" tier wording. Waiting on revised language from counsel.', authorName: 'Priya Sharma', createdAt: daysAgo(1) },
  { id: 'c4', taskId: 't6', content: 'Can\'t start this until we get the responsive breakpoint spec from design.', authorName: 'Jordan Lee', createdAt: daysAgo(4) },
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
    { name: 'roompulse-storage-v2' }
  )
);
