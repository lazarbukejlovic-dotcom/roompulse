import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Columns3, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/store/useAppStore';
import { useToast } from '@/hooks/use-toast';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signUp } = useAppStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { toast({ title: 'Please fill all fields', variant: 'destructive' }); return; }
    if (password.length < 6) { toast({ title: 'Password must be at least 6 characters', variant: 'destructive' }); return; }
    signUp(name, email, password);
    toast({ title: 'Account created!' });
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-primary/5 border-r border-border/40 p-12">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/20">
             <Activity className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">RoomPulse</span>
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
          <h2 className="text-3xl font-extrabold tracking-tight mb-4">See the state of<br /><span className="gradient-text">your team's work.</span></h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mb-8">Track what's moving, flag what's blocked, and ship with confidence.</p>
          <div className="space-y-4">
            {[
              { icon: Columns3, text: 'Workflow boards with drag-and-drop' },
              { icon: ShieldAlert, text: 'Blocker visibility across the team' },
              { icon: Activity, text: 'Execution progress at a glance' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-foreground/80">{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} RoomPulse. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center px-4 sm:px-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm space-y-6">
          <div className="text-center lg:text-left">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 lg:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary"><Activity className="h-4 w-4 text-primary-foreground" /></div>
              <span className="text-lg font-bold">RoomPulse</span>
            </Link>
            <h1 className="text-2xl font-extrabold tracking-tight">Create your account</h1>
            <p className="mt-1 text-sm text-muted-foreground">Get started in under a minute</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Chen" className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" className="h-11" />
            </div>
            <Button type="submit" className="w-full h-11 shadow-lg shadow-primary/20">Create Account</Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/signin" className="font-semibold text-primary hover:underline">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
