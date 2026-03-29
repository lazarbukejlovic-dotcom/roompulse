import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Save, Columns3, CheckCircle2, MessageSquare } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const fadeIn = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

export default function Profile() {
  const { user, boards, tasks, comments, updateProfile } = useAppStore();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = () => {
    if (!name.trim() || !email.trim()) { toast({ title: 'All fields required', variant: 'destructive' }); return; }
    updateProfile({ name, email });
    toast({ title: 'Profile updated!' });
  };

  if (!user) return null;

  const profileStats = [
    { label: 'Boards', value: boards.length, icon: Columns3, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Tasks', value: tasks.length, icon: CheckCircle2, color: 'text-status-progress', bg: 'bg-status-progress/10' },
    { label: 'Comments', value: comments.length, icon: MessageSquare, color: 'text-accent', bg: 'bg-accent/10' },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-2xl mx-auto space-y-6">
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <h1 className="text-2xl font-extrabold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and see your workspace stats.</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.1 }}>
        <Card className="glass-card overflow-hidden">
          <div className="h-20 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/10" />
          <CardContent className="relative pt-0 pb-6 px-6">
            <div className="flex items-end gap-4 -mt-10 mb-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-2xl font-extrabold border-4 border-card shadow-lg">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="pb-1">
                <h2 className="text-lg font-bold">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
            <div className="grid grid-cols-3 gap-3">
              {profileStats.map((s) => (
                <div key={s.label} className="rounded-xl bg-secondary/40 p-3 text-center">
                  <s.icon className={`h-4 w-4 mx-auto mb-1 ${s.color}`} />
                  <p className="text-lg font-extrabold">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Form */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.2 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm"><User className="h-3.5 w-3.5 text-muted-foreground" /> Full Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm"><Mail className="h-3.5 w-3.5 text-muted-foreground" /> Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="h-11" />
            </div>
            <Button onClick={handleSave} className="gap-2 shadow-lg shadow-primary/20">
              <Save className="h-4 w-4" /> Save Changes
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
