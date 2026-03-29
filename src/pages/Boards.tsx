import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { BOARD_COLORS, BOARD_ICONS } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const fadeIn = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

export default function Boards() {
  const { boards, tasks, addBoard, updateBoard, deleteBoard } = useAppStore();
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [editBoard, setEditBoard] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', description: '', color: BOARD_COLORS[0], icon: BOARD_ICONS[0] });

  const resetForm = () => setForm({ title: '', description: '', color: BOARD_COLORS[0], icon: BOARD_ICONS[0] });

  const handleCreate = () => {
    if (!form.title.trim()) { toast({ title: 'Title is required', variant: 'destructive' }); return; }
    addBoard(form);
    setCreateOpen(false);
    resetForm();
    toast({ title: 'Board created!' });
  };

  const handleEdit = () => {
    if (!editBoard || !form.title.trim()) return;
    updateBoard(editBoard, form);
    setEditBoard(null);
    resetForm();
    toast({ title: 'Board updated!' });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteBoard(deleteId);
    setDeleteId(null);
    toast({ title: 'Board deleted' });
  };

  const openEdit = (id: string) => {
    const b = boards.find(x => x.id === id);
    if (b) { setForm({ title: b.title, description: b.description, color: b.color, icon: b.icon }); setEditBoard(id); }
  };

  const BoardForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="space-y-4">
      <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="My Board" /></div>
      <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What's this board for?" rows={2} /></div>
      <div className="space-y-2">
        <Label>Icon</Label>
        <div className="flex flex-wrap gap-2">{BOARD_ICONS.map(icon => (
          <button key={icon} onClick={() => setForm(f => ({ ...f, icon }))} className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg transition-all ${form.icon === icon ? 'bg-primary/20 ring-2 ring-primary' : 'bg-secondary hover:bg-secondary/80'}`}>{icon}</button>
        ))}</div>
      </div>
      <div className="space-y-2">
        <Label>Color</Label>
        <div className="flex flex-wrap gap-2">{BOARD_COLORS.map(color => (
          <button key={color} onClick={() => setForm(f => ({ ...f, color }))} className={`h-7 w-7 rounded-full transition-all ${form.color === color ? 'ring-2 ring-offset-2 ring-primary ring-offset-background' : ''}`} style={{ backgroundColor: color }} />
        ))}</div>
      </div>
      <Button onClick={onSubmit} className="w-full">{submitLabel}</Button>
    </div>
  );

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-6">
      <motion.div initial="hidden" animate="visible" variants={fadeIn} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Boards</h1>
          <p className="text-sm text-muted-foreground mt-1">{boards.length} boards</p>
        </div>
        <Dialog open={createOpen} onOpenChange={o => { setCreateOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild><Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> New Board</Button></DialogTrigger>
          <DialogContent><DialogHeader><DialogTitle>Create Board</DialogTitle></DialogHeader><BoardForm onSubmit={handleCreate} submitLabel="Create Board" /></DialogContent>
        </Dialog>
      </motion.div>

      {boards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-semibold">No boards yet</p>
          <p className="text-sm text-muted-foreground mt-1">Create your first board to get started</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((b, i) => {
            const taskCount = tasks.filter(t => t.boardId === b.id).length;
            const doneCount = tasks.filter(t => t.boardId === b.id && t.status === 'done').length;
            return (
              <motion.div key={b.id} initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: i * 0.06 }}>
                <Card className="glass-card-hover group relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-1 w-full" style={{ backgroundColor: b.color }} />
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <Link to={`/boards/${b.id}`} className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{b.icon}</span>
                          <h3 className="font-semibold truncate">{b.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{b.description}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{taskCount} tasks</span>
                          {taskCount > 0 && <span>{Math.round((doneCount / taskCount) * 100)}% done</span>}
                        </div>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-secondary">
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(b.id)}><Pencil className="h-3.5 w-3.5 mr-2" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeleteId(b.id)} className="text-destructive"><Trash2 className="h-3.5 w-3.5 mr-2" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editBoard} onOpenChange={o => { if (!o) { setEditBoard(null); resetForm(); } }}>
        <DialogContent><DialogHeader><DialogTitle>Edit Board</DialogTitle></DialogHeader><BoardForm onSubmit={handleEdit} submitLabel="Save Changes" /></DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={o => { if (!o) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete board?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete the board and all its tasks.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
