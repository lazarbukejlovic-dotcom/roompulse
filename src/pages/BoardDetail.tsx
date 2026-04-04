import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowLeft, Search, Filter, Calendar, Tag, MessageSquare, Clock, GripVertical, Inbox, Trash2, Pencil, ShieldAlert, UserCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { STATUS_LABELS, PRIORITY_LABELS, type TaskStatus, type TaskPriority, type Task } from '@/types';
import { formatDueDate, formatRelativeDate, getDueUrgency } from '@/lib/dates';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const STATUSES: TaskStatus[] = ['todo', 'in-progress', 'review', 'done'];

const STATUS_DOT_COLORS: Record<TaskStatus, string> = {
  todo: 'bg-status-todo',
  'in-progress': 'bg-status-progress',
  review: 'bg-status-review',
  done: 'bg-status-done',
};

const PRIORITY_BG: Record<TaskPriority, string> = {
  low: 'bg-priority-low/10 text-priority-low',
  medium: 'bg-priority-medium/10 text-priority-medium',
  high: 'bg-priority-high/10 text-priority-high',
  urgent: 'bg-priority-urgent/10 text-priority-urgent border border-priority-urgent/20',
};

const DUE_URGENCY_STYLES = {
  overdue: 'text-destructive bg-destructive/10',
  soon: 'text-accent-foreground bg-accent/10',
  normal: 'text-muted-foreground bg-secondary',
};

export default function BoardDetail() {
  const { id } = useParams<{ id: string }>();
  const { boards, tasks, comments, addTask, updateTask, deleteTask, moveTask, addComment, user } = useAppStore();
  const { toast } = useToast();
  const board = boards.find(b => b.id === id);

  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [createStatus, setCreateStatus] = useState<TaskStatus>('todo');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium' as TaskPriority, dueDate: '', tags: '' });

  const boardTasks = useMemo(() => {
    let filtered = tasks.filter(t => t.boardId === id);
    if (search) filtered = filtered.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
    if (filterPriority !== 'all') filtered = filtered.filter(t => t.priority === filterPriority);
    return filtered;
  }, [tasks, id, search, filterPriority]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newStatus = result.destination.droppableId as TaskStatus;
    moveTask(result.draggableId, newStatus, result.destination.index);
  };

  const handleCreate = () => {
    if (!form.title.trim() || !id) return;
    addTask({
      boardId: id, title: form.title, description: form.description,
      status: createStatus, priority: form.priority,
      dueDate: form.dueDate || null, tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [],
    });
    setCreateOpen(false);
    setForm({ title: '', description: '', priority: 'medium', dueDate: '', tags: '' });
    toast({ title: 'Task created!' });
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedTask) return;
    addComment({ taskId: selectedTask.id, content: newComment, authorName: user?.name || 'Anonymous' });
    setNewComment('');
  };

  const handleSaveTitle = () => {
    if (!selectedTask || !editTitle.trim()) return;
    updateTask(selectedTask.id, { title: editTitle });
    setSelectedTask({ ...selectedTask, title: editTitle });
    setEditingTitle(false);
  };

  const handleSaveDesc = () => {
    if (!selectedTask) return;
    updateTask(selectedTask.id, { description: editDesc });
    setSelectedTask({ ...selectedTask, description: editDesc });
    setEditingDesc(false);
  };

  if (!board) return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <span className="text-4xl mb-3">🔍</span>
      <p className="text-xl font-bold">Board not found</p>
      <p className="text-sm text-muted-foreground mt-1 mb-4">It may have been deleted or moved.</p>
      <Link to="/boards"><Button variant="outline" size="sm" className="gap-2"><ArrowLeft className="h-3.5 w-3.5" /> Back to boards</Button></Link>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 lg:px-8 border-b border-border space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <Link to="/boards" className="text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft className="h-4 w-4" /></Link>
          <span className="text-xl">{board.icon}</span>
          <h1 className="text-xl font-extrabold tracking-tight">{board.title}</h1>
          <Badge variant="secondary" className="text-xs font-semibold">{boardTasks.length} tasks</Badge>
        </div>
        {board.description && <p className="text-sm text-muted-foreground">{board.description}</p>}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..." className="pl-9 h-9 text-sm" />
          </div>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-36 h-9 text-sm"><Filter className="h-3 w-3 mr-1.5" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              {Object.entries(PRIORITY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Kanban */}
      <div className="flex-1 overflow-x-auto p-4 lg:px-8">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 h-full min-w-max">
            {STATUSES.map(status => {
              const columnTasks = boardTasks.filter(t => t.status === status).sort((a, b) => a.order - b.order);
              return (
                <div key={status} className="flex flex-col w-72 flex-shrink-0">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <div className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT_COLORS[status]}`} />
                      <span className="text-sm font-bold">{STATUS_LABELS[status]}</span>
                      <span className="text-xs text-muted-foreground bg-secondary rounded-full px-2 py-0.5 font-medium">{columnTasks.length}</span>
                    </div>
                    <button
                      onClick={() => { setCreateStatus(status); setCreateOpen(true); }}
                      className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md p-1 transition-colors"
                      aria-label={`Add task to ${STATUS_LABELS[status]}`}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <Droppable droppableId={status}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 space-y-2 rounded-xl p-2 transition-all min-h-[200px] border border-transparent ${
                          snapshot.isDraggingOver ? 'bg-primary/5 border-primary/20' : 'bg-secondary/20'
                        }`}
                      >
                        {columnTasks.length === 0 && !snapshot.isDraggingOver && (
                          <div className="flex flex-col items-center justify-center py-10 text-center">
                            <Inbox className="h-8 w-8 text-muted-foreground/30 mb-2" />
                            <p className="text-xs text-muted-foreground/60">No tasks here</p>
                            <button
                              onClick={() => { setCreateStatus(status); setCreateOpen(true); }}
                              className="text-xs text-primary hover:underline mt-1"
                            >
                              Add a task
                            </button>
                          </div>
                        )}
                        {columnTasks.map((task, index) => {
                          const urgency = getDueUrgency(task.dueDate);
                          const isUrgentPriority = task.priority === 'urgent';
                          return (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(prov, snap) => (
                                <div
                                  ref={prov.innerRef}
                                  {...prov.draggableProps}
                                  onClick={() => setSelectedTask(task)}
                                  className={`glass-card rounded-xl p-3.5 cursor-pointer transition-all group ${
                                    snap.isDragging
                                      ? 'shadow-xl ring-2 ring-primary/20 rotate-[2deg] scale-[1.02]'
                                      : 'hover:shadow-md hover:border-border'
                                  } ${urgency === 'overdue' ? 'border-destructive/20 bg-destructive/[0.02]' : ''} ${isUrgentPriority ? 'ring-1 ring-priority-urgent/15' : ''} ${task.blocked ? 'border-destructive/25 bg-destructive/[0.03]' : ''}`}
                                >
                                  <div className="flex items-start gap-2">
                                    <div
                                      {...prov.dragHandleProps}
                                      className="mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                                    >
                                      <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-semibold mb-1 line-clamp-2 leading-snug">{task.title}</p>
                                      {task.blocked && (
                                        <div className="flex items-center gap-1 mb-1.5 text-[10px] font-semibold text-destructive">
                                          <ShieldAlert className="h-3 w-3" /> Blocked
                                        </div>
                                      )}
                                      {task.description && <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{task.description}</p>}
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className={`text-[10px] font-bold uppercase rounded-md px-1.5 py-0.5 ${PRIORITY_BG[task.priority]}`}>
                                          {isUrgentPriority ? '🔥 ' : ''}{PRIORITY_LABELS[task.priority]}
                                        </span>
                                        {task.dueDate && (
                                          <span className={`flex items-center gap-1 text-[10px] font-medium rounded-md px-1.5 py-0.5 ${DUE_URGENCY_STYLES[urgency]}`}>
                                            <Clock className="h-2.5 w-2.5" />{urgency === 'overdue' ? 'Overdue' : formatDueDate(task.dueDate)}
                                          </span>
                                        )}
                                        {comments.filter(c => c.taskId === task.id).length > 0 && (
                                          <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground bg-secondary rounded-md px-1.5 py-0.5">
                                            <MessageSquare className="h-2.5 w-2.5" />{comments.filter(c => c.taskId === task.id).length}
                                          </span>
                                        )}
                                      </div>
                                      {task.tags.length > 0 && (
                                        <div className="flex gap-1 mt-2 flex-wrap">
                                          {task.tags.slice(0, 3).map(tag => (
                                            <span key={tag} className="flex items-center gap-0.5 rounded-full bg-primary/5 border border-primary/10 px-2 py-0.5 text-[10px] text-primary font-medium">
                                              <Tag className="h-2 w-2" />{tag}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {/* Create Task Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>New task in {STATUS_LABELS[createStatus]}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="What needs to be done?" className="h-11" autoFocus /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Add more context..." rows={3} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={form.priority} onValueChange={v => setForm(f => ({ ...f, priority: v as TaskPriority }))}>
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.entries(PRIORITY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Due Date</Label><Input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} className="h-10" /></div>
            </div>
            <div className="space-y-2"><Label>Tags (comma-separated)</Label><Input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="design, frontend, urgent" /></div>
            <Button onClick={handleCreate} className="w-full h-11 shadow-lg shadow-primary/20">Create Task</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Task Detail Dialog */}
      <AnimatePresence>
        {selectedTask && (
          <Dialog open={!!selectedTask} onOpenChange={o => { if (!o) { setSelectedTask(null); setEditingTitle(false); setEditingDesc(false); } }}>
            <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto scrollbar-thin">
              {(() => {
                const taskComments = comments.filter(c => c.taskId === selectedTask.id).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
                const urgency = getDueUrgency(selectedTask.dueDate);
                return (
                  <>
                    <DialogHeader>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`text-[10px] font-bold ${PRIORITY_BG[selectedTask.priority]}`} variant="outline">
                          {selectedTask.priority === 'urgent' ? '🔥 ' : ''}{PRIORITY_LABELS[selectedTask.priority]}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">{STATUS_LABELS[selectedTask.status]}</Badge>
                        {urgency === 'overdue' && (
                          <Badge variant="destructive" className="text-[10px]">Overdue</Badge>
                        )}
                      </div>
                      {editingTitle ? (
                        <div className="flex gap-2">
                          <Input
                            value={editTitle}
                            onChange={e => setEditTitle(e.target.value)}
                            className="text-lg font-semibold"
                            autoFocus
                            onKeyDown={e => { if (e.key === 'Enter') handleSaveTitle(); if (e.key === 'Escape') setEditingTitle(false); }}
                          />
                          <Button size="sm" onClick={handleSaveTitle}>Save</Button>
                        </div>
                      ) : (
                        <DialogTitle
                          className="text-lg leading-snug cursor-pointer hover:text-primary transition-colors group flex items-center gap-2"
                          onClick={() => { setEditTitle(selectedTask.title); setEditingTitle(true); }}
                        >
                          {selectedTask.title}
                          <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                        </DialogTitle>
                      )}
                    </DialogHeader>
                    <div className="space-y-5">
                      {/* Description */}
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1.5 block">Description</Label>
                        {editingDesc ? (
                          <div className="space-y-2">
                            <Textarea
                              value={editDesc}
                              onChange={e => setEditDesc(e.target.value)}
                              rows={3}
                              autoFocus
                              onKeyDown={e => { if (e.key === 'Escape') setEditingDesc(false); }}
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={handleSaveDesc}>Save</Button>
                              <Button size="sm" variant="ghost" onClick={() => setEditingDesc(false)}>Cancel</Button>
                            </div>
                          </div>
                        ) : (
                          <p
                            className="text-sm text-muted-foreground leading-relaxed cursor-pointer hover:bg-secondary/40 rounded-lg p-2 -m-2 transition-colors"
                            onClick={() => { setEditDesc(selectedTask.description || ''); setEditingDesc(true); }}
                          >
                            {selectedTask.description || 'Click to add a description...'}
                          </p>
                        )}
                      </div>

                      {/* Metadata */}
                      <div className="flex flex-wrap gap-2">
                        {selectedTask.dueDate && (
                          <Badge variant="outline" className={`gap-1.5 text-xs ${urgency === 'overdue' ? 'border-destructive/30 text-destructive' : ''}`}>
                            <Calendar className="h-3 w-3" />{formatDueDate(selectedTask.dueDate)}
                          </Badge>
                        )}
                        {selectedTask.tags.map(t => (
                          <Badge key={t} variant="secondary" className="text-xs gap-1">
                            <Tag className="h-2.5 w-2.5" />{t}
                          </Badge>
                        ))}
                      </div>

                      {/* Task info */}
                      <div className="text-[11px] text-muted-foreground/70 flex items-center gap-3">
                        <span>Created {formatRelativeDate(selectedTask.createdAt)}</span>
                        <span>·</span>
                        <span>ID: {selectedTask.id.slice(0, 8)}</span>
                      </div>

                      {/* Edit controls */}
                      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">Status</Label>
                          <Select value={selectedTask.status} onValueChange={v => { updateTask(selectedTask.id, { status: v as TaskStatus }); setSelectedTask({ ...selectedTask, status: v as TaskStatus }); }}>
                            <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">Priority</Label>
                          <Select value={selectedTask.priority} onValueChange={v => { updateTask(selectedTask.id, { priority: v as TaskPriority }); setSelectedTask({ ...selectedTask, priority: v as TaskPriority }); }}>
                            <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>{Object.entries(PRIORITY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Comments */}
                      <div className="pt-4 border-t border-border">
                        <p className="text-sm font-bold mb-3 flex items-center gap-1.5">
                          <MessageSquare className="h-3.5 w-3.5 text-primary" />
                          Comments
                          <span className="text-xs font-normal text-muted-foreground">({taskComments.length})</span>
                        </p>
                        {taskComments.length === 0 && (
                          <div className="text-center py-4">
                            <p className="text-xs text-muted-foreground">No comments yet. Start the conversation.</p>
                          </div>
                        )}
                        <div className="space-y-2 mb-3 max-h-48 overflow-y-auto scrollbar-thin">
                          {taskComments.map(c => (
                            <div key={c.id} className="rounded-xl bg-secondary/40 p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">{c.authorName.split(' ').map(n => n[0]).join('')}</div>
                                <span className="text-xs font-semibold">{c.authorName}</span>
                                <span className="text-[10px] text-muted-foreground">{formatRelativeDate(c.createdAt)}</span>
                              </div>
                              <p className="text-sm text-foreground/90 pl-8">{c.content}</p>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="text-sm h-9"
                            onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                          />
                          <Button size="sm" onClick={handleAddComment} className="h-9 px-4">Post</Button>
                        </div>
                      </div>

                      {/* Delete - subdued */}
                      <div className="pt-3 border-t border-border">
                        <button
                          onClick={() => { setDeleteId(selectedTask.id); setSelectedTask(null); }}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-3 w-3" /> Delete task
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={o => { if (!o) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this task?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The task and its comments will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if (deleteId) { deleteTask(deleteId); setDeleteId(null); toast({ title: 'Task deleted' }); } }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
