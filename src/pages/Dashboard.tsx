import { motion } from 'framer-motion';
import { LayoutDashboard, CheckCircle2, Clock, AlertTriangle, Columns3, Activity, ArrowUpRight, TrendingUp } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { STATUS_LABELS, PRIORITY_LABELS, type TaskStatus } from '@/types';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const fadeIn = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

const STATUS_CHART_COLORS: Record<TaskStatus, string> = {
  'todo': 'hsl(215, 15%, 46%)',
  'in-progress': 'hsl(210, 80%, 55%)',
  'review': 'hsl(270, 60%, 55%)',
  'done': 'hsl(145, 65%, 42%)',
};

export default function Dashboard() {
  const { boards, tasks, comments, user } = useAppStore();

  const statusCounts: Record<TaskStatus, number> = {
    'todo': tasks.filter(t => t.status === 'todo').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    'review': tasks.filter(t => t.status === 'review').length,
    'done': tasks.filter(t => t.status === 'done').length,
  };

  const completionRate = tasks.length ? Math.round((statusCounts['done'] / tasks.length) * 100) : 0;

  const chartData = (Object.entries(statusCounts) as [TaskStatus, number][])
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({ name: STATUS_LABELS[status], value: count, color: STATUS_CHART_COLORS[status] }));

  const upcoming = tasks
    .filter(t => t.dueDate && t.status !== 'done')
    .sort((a, b) => (a.dueDate! > b.dueDate! ? 1 : -1))
    .slice(0, 5);

  const stats = [
    { label: 'Total Boards', value: boards.length, icon: Columns3, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Total Tasks', value: tasks.length, icon: CheckCircle2, color: 'text-status-progress', bg: 'bg-status-progress/10' },
    { label: 'In Progress', value: statusCounts['in-progress'], icon: Clock, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Urgent', value: tasks.filter(t => t.priority === 'urgent').length, icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
  ];

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Welcome */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {greeting}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Here's what's happening across your workspace today.</p>
      </motion.div>

      {/* Stats */}
      <motion.div initial="hidden" animate="visible" variants={stagger} className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <motion.div key={s.label} variants={fadeIn}>
            <Card className="glass-card border-transparent hover:border-border/50 transition-colors">
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.bg}`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-extrabold tracking-tight">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Completion Chart */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.2 }} className="lg:col-span-2">
          <Card className="glass-card h-full">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" /> Completion Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative w-32 h-32 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.length > 0 ? chartData : [{ name: 'Empty', value: 1, color: 'hsl(var(--muted))' }]}
                        innerRadius={36}
                        outerRadius={56}
                        dataKey="value"
                        stroke="none"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {(chartData.length > 0 ? chartData : [{ color: 'hsl(var(--muted))' }]).map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-extrabold">{completionRate}%</span>
                    <span className="text-[10px] text-muted-foreground">Done</span>
                  </div>
                </div>
                <div className="space-y-2.5 flex-1 min-w-0">
                  {(Object.entries(statusCounts) as [TaskStatus, number][]).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_CHART_COLORS[status] }} />
                        <span className="text-xs truncate">{STATUS_LABELS[status]}</span>
                      </div>
                      <span className="text-xs font-bold tabular-nums">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Board Progress */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.3 }} className="lg:col-span-3">
          <Card className="glass-card h-full">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Columns3 className="h-4 w-4 text-primary" /> Board Progress
              </CardTitle>
              <Link to="/boards" className="text-xs text-primary hover:underline flex items-center gap-0.5">
                View all <ArrowUpRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {boards.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">No boards yet. Create one to get started!</p>
              ) : (
                boards.map((b) => {
                  const boardTasks = tasks.filter(t => t.boardId === b.id);
                  const done = boardTasks.filter(t => t.status === 'done').length;
                  const pct = boardTasks.length ? Math.round((done / boardTasks.length) * 100) : 0;
                  return (
                    <Link to={`/boards/${b.id}`} key={b.id} className="block group">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-sm">{b.icon}</span>
                          <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">{b.title}</span>
                        </div>
                        <span className="text-xs text-muted-foreground tabular-nums">{done}/{boardTasks.length}</span>
                      </div>
                      <Progress value={pct} className="h-1.5" />
                    </Link>
                  );
                })
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Deadlines */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.4 }}>
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4 text-accent" /> Upcoming Deadlines</CardTitle></CardHeader>
            <CardContent>
              {upcoming.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <span className="text-3xl mb-2">🎉</span>
                  <p className="text-sm font-medium">All clear!</p>
                  <p className="text-xs text-muted-foreground mt-1">No upcoming deadlines.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {upcoming.map((t) => (
                    <div key={t.id} className="flex items-center justify-between rounded-lg bg-secondary/40 px-3 py-2.5 hover:bg-secondary/60 transition-colors">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{t.title}</p>
                        <p className="text-xs text-muted-foreground">{boards.find(b => b.id === t.boardId)?.title}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="outline" className="text-[10px] font-semibold">{PRIORITY_LABELS[t.priority]}</Badge>
                        <span className="text-xs text-muted-foreground tabular-nums">{t.dueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.5 }}>
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Activity className="h-4 w-4 text-primary" /> Recent Activity</CardTitle></CardHeader>
            <CardContent>
              {comments.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <span className="text-3xl mb-2">💬</span>
                  <p className="text-sm font-medium">No activity yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Comments on tasks will appear here.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {comments.slice(-5).reverse().map((c) => {
                    const task = tasks.find(t => t.id === c.taskId);
                    return (
                      <div key={c.id} className="flex items-start gap-3 rounded-lg bg-secondary/40 px-3 py-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary flex-shrink-0">
                          {c.authorName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm"><span className="font-semibold">{c.authorName}</span> on <span className="font-medium">{task?.title}</span></p>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">"{c.content}"</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
