import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { Plus, ArrowLeft, Search, Filter, Calendar, Tag, MessageSquare, Clock, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { STATUS_LABELS, PRIORITY_LABELS, PRIORITY_COLORS, type TaskStatus, type TaskPriority, type Task } from '@/types';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const STATUSES: TaskStatus[] = ['todo', 'in-progress', 'review', 'done'];
const STATUS_DOT: Record<TaskStatus, string> = { todo: 'bg-status-todo', 'in-progress': 'bg-status-progress', review: 'bg-status-review', done: 'bg-status-done' };

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

  if (!board) return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <p className="text-xl font-semibold">Board not found</p>
      <Link to="/boards" className="text-primary text-sm mt-2 hover:underline">← Back to boards</Link>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 lg:px-8 border-b border-border space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <Link to="/boards" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /></Link>
          <span className="text-xl">{board.icon}</span>
          <h1 className="text-xl font-bold tracking-tight">{board.title}</h1>
          <Badge variant="secondary" className="text-xs">{boardTasks.length} tasks</Badge>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..." className="pl-9 h-8 text-sm" />
          </div>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-32 h-8 text-sm"><Filter className="h-3 w-3 mr-1" /><SelectValue /></SelectTrigger>
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
                      <div className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT[status]}`} />
                      <span className="text-sm font-semibold">{STATUS_LABELS[status]}</span>
                      <span className="text-xs text-muted-foreground bg-secondary rounded-full px-2 py-0.5">{columnTasks.length}</span>
                    </div>
                    <button onClick={() => { setCreateStatus(status); setCreateOpen(true); }} className="text-muted-foreground hover:text-foreground">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <Droppable droppableId={status}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 space-y-2 rounded-lg p-2 transition-colors min-h-[200px] ${snapshot.isDraggingOver ? 'bg-primary/5' : 'bg-secondary/30'}`}
                      >
                        {columnTasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(prov, snap) => (
                              <div
                                ref={prov.innerRef}
                                {...prov.draggableProps}
                                {...prov.dragHandleProps}
                                onClick={() => setSelectedTask(task)}
                                className={`glass-card rounded-lg p-3 cursor-pointer transition-shadow hover:shadow-md ${snap.isDragging ? 'shadow-lg ring-1 ring-primary/20' : ''}`}
                              >
                                <p className="text-sm font-medium mb-1.5 line-clamp-2">{task.title}</p>
                                {task.description && <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{task.description}</p>}
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`text-[10px] font-semibold uppercase ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</span>
                                  {task.dueDate && (
                                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                      <Clock className="h-2.5 w-2.5" />{task.dueDate}
                                    </span>
                                  )}
                                  {comments.filter(c => c.taskId === task.id).length > 0 && (
                                    <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                                      <MessageSquare className="h-2.5 w-2.5" />{comments.filter(c => c.taskId === task.id).length}
                                    </span>
                                  )}
                                </div>
                                {task.tags.length > 0 && (
                                  <div className="flex gap-1 mt-2 flex-wrap">
                                    {task.tags.slice(0, 2).map(tag => (
                                      <span key={tag} className="flex items-center gap-0.5 rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                                        <Tag className="h-2 w-2" />{tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
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
        <DialogContent>
          <DialogHeader><DialogTitle>Create Task in {STATUS_LABELS[createStatus]}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Task title" /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional description" rows={2} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={form.priority} onValueChange={v => setForm(f => ({ ...f, priority: v as TaskPriority }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.entries(PRIORITY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Due Date</Label><Input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} /></div>
            </div>
            <div className="space-y-2"><Label>Tags (comma-separated)</Label><Input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="design, frontend" /></div>
            <Button onClick={handleCreate} className="w-full">Create Task</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Task Detail Dialog */}
      <Dialog open={!!selectedTask} onOpenChange={o => { if (!o) setSelectedTask(null); }}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          {selectedTask && (() => {
            const taskComments = comments.filter(c => c.taskId === selectedTask.id).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-start justify-between gap-2 pr-8">
                    <span>{selectedTask.title}</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {selectedTask.description && <p className="text-sm text-muted-foreground">{selectedTask.description}</p>}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{STATUS_LABELS[selectedTask.status]}</Badge>
                    <Badge variant="outline" className={PRIORITY_COLORS[selectedTask.priority]}>{PRIORITY_LABELS[selectedTask.priority]}</Badge>
                    {selectedTask.dueDate && <Badge variant="outline" className="gap-1"><Calendar className="h-3 w-3" />{selectedTask.dueDate}</Badge>}
                  </div>
                  {selectedTask.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">{selectedTask.tags.map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}</div>
                  )}

                  {/* Edit status/priority inline */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
                    <div className="space-y-1">
                      <Label className="text-xs">Status</Label>
                      <Select value={selectedTask.status} onValueChange={v => { updateTask(selectedTask.id, { status: v as TaskStatus }); setSelectedTask({ ...selectedTask, status: v as TaskStatus }); }}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Priority</Label>
                      <Select value={selectedTask.priority} onValueChange={v => { updateTask(selectedTask.id, { priority: v as TaskPriority }); setSelectedTask({ ...selectedTask, priority: v as TaskPriority }); }}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>{Object.entries(PRIORITY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Comments */}
                  <div className="pt-3 border-t border-border">
                    <p className="text-sm font-semibold mb-3 flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> Comments ({taskComments.length})</p>
                    {taskComments.length === 0 && <p className="text-xs text-muted-foreground py-2">No comments yet</p>}
                    <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
                      {taskComments.map(c => (
                        <div key={c.id} className="rounded-lg bg-secondary/50 p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">{c.authorName.split(' ').map(n => n[0]).join('')}</div>
                            <span className="text-xs font-medium">{c.authorName}</span>
                            <span className="text-[10px] text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-foreground/90">{c.content}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Write a comment..." className="text-sm h-8" onKeyDown={e => e.key === 'Enter' && handleAddComment()} />
                      <Button size="sm" variant="secondary" onClick={handleAddComment} className="h-8">Post</Button>
                    </div>
                  </div>

                  <Button variant="destructive" size="sm" className="w-full" onClick={() => { setDeleteId(selectedTask.id); setSelectedTask(null); }}>Delete Task</Button>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={o => { if (!o) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete task?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deleteId) { deleteTask(deleteId); setDeleteId(null); toast({ title: 'Task deleted' }); } }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
