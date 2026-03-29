import { motion } from 'framer-motion';
import { LayoutDashboard, CheckCircle2, Clock, AlertTriangle, Columns3, Activity } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { STATUS_LABELS, PRIORITY_LABELS, type TaskStatus } from '@/types';
import { Link } from 'react-router-dom';

const fadeIn = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

export default function Dashboard() {
  const { boards, tasks, comments } = useAppStore();

  const statusCounts: Record<TaskStatus, number> = {
    'todo': tasks.filter(t => t.status === 'todo').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    'review': tasks.filter(t => t.status === 'review').length,
    'done': tasks.filter(t => t.status === 'done').length,
  };

  const upcoming = tasks
    .filter(t => t.dueDate && t.status !== 'done')
    .sort((a, b) => (a.dueDate! > b.dueDate! ? 1 : -1))
    .slice(0, 5);

  const stats = [
    { label: 'Total Boards', value: boards.length, icon: Columns3, color: 'text-primary' },
    { label: 'Total Tasks', value: tasks.length, icon: CheckCircle2, color: 'text-status-progress' },
    { label: 'In Progress', value: statusCounts['in-progress'], icon: Clock, color: 'text-accent' },
    { label: 'Urgent', value: tasks.filter(t => t.priority === 'urgent').length, icon: AlertTriangle, color: 'text-destructive' },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-6xl mx-auto">
      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of your workspace</p>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: i * 0.08 }}>
            <Card className="glass-card">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Tasks by Status */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.3 }}>
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><LayoutDashboard className="h-4 w-4 text-primary" /> Tasks by Status</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {(Object.entries(statusCounts) as [TaskStatus, number][]).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-2.5 w-2.5 rounded-full bg-status-${status === 'in-progress' ? 'progress' : status}`} />
                    <span className="text-sm font-medium">{STATUS_LABELS[status]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-status-${status === 'in-progress' ? 'progress' : status} transition-all`}
                        style={{ width: `${tasks.length ? (count / tasks.length) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-6 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.4 }}>
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4 text-accent" /> Upcoming Deadlines</CardTitle></CardHeader>
            <CardContent>
              {upcoming.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No upcoming deadlines 🎉</p>
              ) : (
                <div className="space-y-3">
                  {upcoming.map((t) => (
                    <div key={t.id} className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2.5">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{t.title}</p>
                        <p className="text-xs text-muted-foreground">{boards.find(b => b.id === t.boardId)?.title}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="outline" className="text-xs">{PRIORITY_LABELS[t.priority]}</Badge>
                        <span className="text-xs text-muted-foreground">{t.dueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.5 }}>
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Activity className="h-4 w-4 text-primary" /> Recent Activity</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {comments.slice(-5).reverse().map((c) => {
                const task = tasks.find(t => t.id === c.taskId);
                return (
                  <div key={c.id} className="flex items-start gap-3 rounded-lg bg-secondary/50 px-3 py-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary flex-shrink-0">
                      {c.authorName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm"><span className="font-medium">{c.authorName}</span> commented on <span className="font-medium">{task?.title}</span></p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">"{c.content}"</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Links */}
      <div className="flex gap-3">
        <Link to="/boards" className="text-sm text-primary hover:underline font-medium">View all boards →</Link>
      </div>
    </div>
  );
}
