import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertTriangle, Columns3, Activity, ArrowUpRight, TrendingUp, Plus, ShieldAlert, UserCircle, Target } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { STATUS_LABELS, PRIORITY_LABELS, type TaskStatus } from '@/types';
import { Link, useNavigate } from 'react-router-dom';
import { formatRelativeDate, formatDueDate, getDueUrgency } from '@/lib/dates';

const fadeIn = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.05 } } };

const STATUS_CHART_COLORS: Record<TaskStatus, string> = {
  'todo': 'hsl(215, 15%, 46%)',
  'in-progress': 'hsl(210, 80%, 55%)',
  'review': 'hsl(270, 60%, 55%)',
  'done': 'hsl(145, 65%, 42%)',
};

const DUE_URGENCY_STYLES = {
  overdue: 'text-destructive bg-destructive/10',
  soon: 'text-accent-foreground bg-accent/15',
  normal: 'text-muted-foreground bg-secondary',
};

export default function Dashboard() {
  const { boards, tasks, comments, user } = useAppStore();
  const navigate = useNavigate();

  const { statusCounts, completionRate, blockedTasks, overdueTasks, atRiskCount, todayFocus, upcoming } = useMemo(() => {
    const sc: Record<TaskStatus, number> = {
      'todo': tasks.filter(t => t.status === 'todo').length,
      'in-progress': tasks.filter(t => t.status === 'in-progress').length,
      'review': tasks.filter(t => t.status === 'review').length,
      'done': tasks.filter(t => t.status === 'done').length,
    };
    const cr = tasks.length ? Math.round((sc['done'] / tasks.length) * 100) : 0;
    const blocked = tasks.filter(t => t.blocked && t.status !== 'done');
    const overdue = tasks.filter(t => getDueUrgency(t.dueDate) === 'overdue' && t.status !== 'done');
    const risk = blocked.length + overdue.length;

    // Today's focus: in-progress + due soon/today, not done
    const focus = tasks
      .filter(t => t.status !== 'done' && (t.status === 'in-progress' || getDueUrgency(t.dueDate) === 'soon' || getDueUrgency(t.dueDate) === 'overdue'))
      .sort((a, b) => {
        if (a.blocked && !b.blocked) return -1;
        if (!a.blocked && b.blocked) return 1;
        const au = getDueUrgency(a.dueDate);
        const bu = getDueUrgency(b.dueDate);
        if (au === 'overdue' && bu !== 'overdue') return -1;
        if (au !== 'overdue' && bu === 'overdue') return 1;
        return 0;
      })
      .slice(0, 4);

    const up = tasks
      .filter(t => t.dueDate && t.status !== 'done')
      .sort((a, b) => (a.dueDate! > b.dueDate! ? 1 : -1))
      .slice(0, 5);

    return { statusCounts: sc, completionRate: cr, blockedTasks: blocked, overdueTasks: overdue, atRiskCount: risk, todayFocus: focus, upcoming: up };
  }, [tasks]);

  const stats = [
    { label: 'Workflows', value: boards.length, icon: Columns3, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Total Tasks', value: tasks.length, icon: CheckCircle2, color: 'text-status-progress', bg: 'bg-status-progress/10' },
    { label: 'In Progress', value: statusCounts['in-progress'], icon: Clock, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'At Risk', value: atRiskCount, icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
  ];

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn} className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {greeting}, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground text-xs mt-0.5">Here's the state of work across your team.</p>
        </div>
        <Button size="sm" className="gap-1.5 shadow-lg shadow-primary/20 flex-shrink-0 text-xs" onClick={() => {
          if (boards.length > 0) navigate(`/boards/${boards[0].id}`);
          else navigate('/boards');
        }}>
          <Plus className="h-3.5 w-3.5" /> Add Task
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div initial="hidden" animate="visible" variants={stagger} className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <motion.div key={s.label} variants={fadeIn}>
            <Card className="glass-card border-transparent hover:border-border/50 transition-colors">
              <CardContent className="flex items-center gap-3 p-4">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.bg}`}>
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <div>
                  <p className="text-xl font-extrabold tracking-tight">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Today's Focus — signature section */}
      {todayFocus.length > 0 && (
        <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.1 }}>
          <Card className="glass-card border-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" /> Today's Focus
                <span className="text-[10px] font-normal text-muted-foreground ml-1">— what needs your attention right now</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2">
                {todayFocus.map((t) => {
                  const urgency = getDueUrgency(t.dueDate);
                  return (
                    <div key={t.id} className={`flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                      t.blocked ? 'bg-destructive/5 border border-destructive/10' : urgency === 'overdue' ? 'bg-destructive/[0.03] border border-destructive/10' : 'bg-secondary/40'
                    }`}>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold truncate">{t.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-muted-foreground">{boards.find(b => b.id === t.boardId)?.title}</span>
                          {t.assignee && <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><UserCircle className="h-2.5 w-2.5" />{t.assignee}</span>}
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex items-center gap-1.5">
                        {t.blocked && <Badge variant="outline" className="text-[9px] font-semibold border-destructive/20 text-destructive">Blocked</Badge>}
                        {urgency === 'overdue' && !t.blocked && <Badge variant="outline" className="text-[9px] font-semibold border-destructive/20 text-destructive">Overdue</Badge>}
                        {urgency === 'soon' && !t.blocked && <Badge variant="outline" className="text-[9px] font-semibold">Due soon</Badge>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid gap-5 lg:grid-cols-5">
        {/* Completion breakdown */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.15 }} className="lg:col-span-2">
          <Card className="glass-card h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" /> Execution Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-5">
                {/* Simple ring instead of recharts — much lighter on mobile */}
                <div className="relative w-24 h-24 flex-shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--primary))" strokeWidth="8"
                      strokeDasharray={`${completionRate * 2.51} ${251.2 - completionRate * 2.51}`}
                      strokeLinecap="round" className="transition-all duration-700"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-extrabold">{completionRate}%</span>
                    <span className="text-[9px] text-muted-foreground">Shipped</span>
                  </div>
                </div>
                <div className="space-y-2 flex-1 min-w-0">
                  {(Object.entries(statusCounts) as [TaskStatus, number][]).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_CHART_COLORS[status] }} />
                        <span className="text-[11px] truncate">{STATUS_LABELS[status]}</span>
                      </div>
                      <span className="text-[11px] font-bold tabular-nums">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Workflow Progress */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.2 }} className="lg:col-span-3">
          <Card className="glass-card h-full">
            <CardHeader className="flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Columns3 className="h-4 w-4 text-primary" /> Workflow Progress
              </CardTitle>
              <Link to="/boards" className="text-[11px] text-primary hover:underline flex items-center gap-0.5">
                View all <ArrowUpRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {boards.length === 0 ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <Columns3 className="h-8 w-8 text-muted-foreground/30 mb-2" />
                  <p className="text-xs font-medium">No workflows yet</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Create a workflow to start tracking your team's execution.</p>
                  <Link to="/boards">
                    <Button size="sm" variant="outline" className="mt-3 gap-1.5 text-xs"><Plus className="h-3 w-3" /> New Workflow</Button>
                  </Link>
                </div>
              ) : (
                boards.map((b) => {
                  const boardTasks = tasks.filter(t => t.boardId === b.id);
                  const done = boardTasks.filter(t => t.status === 'done').length;
                  const blocked = boardTasks.filter(t => t.blocked && t.status !== 'done').length;
                  const pct = boardTasks.length ? Math.round((done / boardTasks.length) * 100) : 0;
                  return (
                    <Link to={`/boards/${b.id}`} key={b.id} className="block group">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-sm">{b.icon}</span>
                          <span className="text-xs font-medium truncate group-hover:text-primary transition-colors">{b.title}</span>
                          {blocked > 0 && (
                            <span className="text-[9px] font-semibold text-destructive bg-destructive/10 rounded-full px-1.5 py-0.5">{blocked} blocked</span>
                          )}
                        </div>
                        <span className="text-[11px] text-muted-foreground tabular-nums">{done}/{boardTasks.length}</span>
                      </div>
                      <Progress value={pct} className="h-1" />
                    </Link>
                  );
                })
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Blocked & At Risk */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.25 }}>
          <Card className="glass-card">
            <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-destructive" /> Blocked & At Risk</CardTitle></CardHeader>
            <CardContent>
              {blockedTasks.length === 0 && overdueTasks.length === 0 ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <CheckCircle2 className="h-8 w-8 text-status-done/40 mb-2" />
                  <p className="text-xs font-medium">No blockers right now</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">All tasks are moving forward.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {blockedTasks.map((t) => (
                    <div key={t.id} className="flex items-start gap-2.5 rounded-lg bg-destructive/5 border border-destructive/10 px-3 py-2">
                      <ShieldAlert className="h-3.5 w-3.5 text-destructive mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium truncate">{t.title}</p>
                        {t.blockedReason && <p className="text-[11px] text-destructive/80 mt-0.5">{t.blockedReason}</p>}
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-muted-foreground">{boards.find(b => b.id === t.boardId)?.title}</span>
                          {t.assignee && <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><UserCircle className="h-2.5 w-2.5" />{t.assignee}</span>}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[9px] font-semibold border-destructive/20 text-destructive flex-shrink-0">Blocked</Badge>
                    </div>
                  ))}
                  {overdueTasks.filter(t => !t.blocked).map((t) => (
                    <div key={t.id} className="flex items-center justify-between rounded-lg bg-destructive/[0.03] border border-destructive/10 px-3 py-2">
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate">{t.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-muted-foreground">{boards.find(b => b.id === t.boardId)?.title}</span>
                          {t.assignee && <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><UserCircle className="h-2.5 w-2.5" />{t.assignee}</span>}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[9px] font-semibold border-destructive/20 text-destructive flex-shrink-0">Overdue</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Delivery Timeline */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.3 }}>
          <Card className="glass-card">
            <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Clock className="h-4 w-4 text-accent" /> Delivery Timeline</CardTitle></CardHeader>
            <CardContent>
              {upcoming.length === 0 ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <Clock className="h-8 w-8 text-muted-foreground/30 mb-2" />
                  <p className="text-xs font-medium">No upcoming deadlines</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Set due dates on tasks to track delivery.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {upcoming.map((t) => {
                    const urgency = getDueUrgency(t.dueDate);
                    return (
                      <div key={t.id} className={`flex items-center justify-between rounded-lg px-3 py-2 transition-colors ${
                        urgency === 'overdue' ? 'bg-destructive/5 border border-destructive/15' : 'bg-secondary/40'
                      }`}>
                        <div className="min-w-0">
                          <p className="text-xs font-medium truncate">{t.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-[10px] text-muted-foreground">{boards.find(b => b.id === t.boardId)?.title}</p>
                            {t.assignee && <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><UserCircle className="h-2.5 w-2.5" />{t.assignee}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <Badge variant="outline" className="text-[9px] font-semibold">{PRIORITY_LABELS[t.priority]}</Badge>
                          <span className={`text-[10px] font-medium rounded-md px-1.5 py-0.5 ${DUE_URGENCY_STYLES[urgency]}`}>
                            {urgency === 'overdue' ? 'Overdue' : formatDueDate(t.dueDate)}
                          </span>
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

      {/* Team Activity */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.35 }}>
        <Card className="glass-card">
          <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Activity className="h-4 w-4 text-primary" /> Team Activity</CardTitle></CardHeader>
          <CardContent>
            {comments.length === 0 ? (
              <div className="flex flex-col items-center py-6 text-center">
                <Activity className="h-8 w-8 text-muted-foreground/30 mb-2" />
                <p className="text-xs font-medium">No activity yet</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Comments and task updates will appear here as your team works.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {comments.slice(-5).reverse().map((c) => {
                  const task = tasks.find(t => t.id === c.taskId);
                  return (
                    <div key={c.id} className="flex items-start gap-2.5 rounded-lg bg-secondary/40 px-3 py-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary flex-shrink-0">
                        {c.authorName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs"><span className="font-semibold">{c.authorName}</span> on <span className="font-medium">{task?.title}</span></p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 truncate">"{c.content}"</p>
                        <p className="text-[10px] text-muted-foreground/70 mt-0.5">{formatRelativeDate(c.createdAt)}</p>
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
  );
}
