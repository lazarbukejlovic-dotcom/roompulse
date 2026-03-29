import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Columns3, CheckCircle2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/store/useAppStore';
import { useToast } from '@/hooks/use-toast';

export default function SignIn() {
  const [email, setEmail] = useState('alex@roompulse.dev');
  const [password, setPassword] = useState('password');
  const { signIn } = useAppStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast({ title: 'Please fill all fields', variant: 'destructive' }); return; }
    signIn(email, password);
    toast({ title: 'Welcome back!' });
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-primary/5 border-r border-border/40 p-12">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/20">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">RoomPulse</span>
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
          <h2 className="text-3xl font-extrabold tracking-tight mb-4">Where teams build<br /><span className="gradient-text">momentum.</span></h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mb-8">Track tasks, visualize progress, and hit every deadline — beautifully.</p>
          <div className="space-y-4">
            {[
              { icon: Columns3, text: 'Visual Kanban boards with drag-and-drop' },
              { icon: CheckCircle2, text: 'Smart task tracking with priorities' },
              { icon: Shield, text: 'Secure authentication & protected routes' },
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

      {/* Right panel - form */}
      <div className="flex flex-1 items-center justify-center px-4 sm:px-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm space-y-6">
          <div className="text-center lg:text-left">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 lg:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary"><Zap className="h-4 w-4 text-primary-foreground" /></div>
              <span className="text-lg font-bold">RoomPulse</span>
            </Link>
            <h1 className="text-2xl font-extrabold tracking-tight">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to your workspace</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="h-11" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <span className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors">Forgot password?</span>
              </div>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="h-11" />
            </div>
            <Button type="submit" className="w-full h-11 shadow-lg shadow-primary/20">Sign In</Button>
          </form>
          <div className="rounded-lg bg-muted/50 border border-border/40 p-3 text-center">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Demo:</span> Use pre-filled credentials to explore
            </p>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account? <Link to="/signup" className="font-semibold text-primary hover:underline">Sign Up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
