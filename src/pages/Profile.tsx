import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Save } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const fadeIn = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

export default function Profile() {
  const { user, updateProfile } = useAppStore();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = () => {
    if (!name.trim() || !email.trim()) { toast({ title: 'All fields required', variant: 'destructive' }); return; }
    updateProfile({ name, email });
    toast({ title: 'Profile updated!' });
  };

  if (!user) return null;

  return (
    <div className="p-4 lg:p-8 max-w-2xl mx-auto space-y-6">
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account settings</p>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.1 }}>
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <CardTitle>{user.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground mt-1">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><User className="h-3.5 w-3.5" /> Full Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <Button onClick={handleSave} className="gap-2"><Save className="h-4 w-4" /> Save Changes</Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
