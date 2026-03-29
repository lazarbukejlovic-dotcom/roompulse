import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, LayoutDashboard, CheckCircle2, Users, ArrowRight, Star, Columns3, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { icon: Columns3, title: 'Visual Boards', desc: 'Organize work into beautiful Kanban boards with drag-and-drop simplicity.' },
  { icon: CheckCircle2, title: 'Smart Tasks', desc: 'Track priorities, due dates, tags, and status across every project.' },
  { icon: Users, title: 'Team Comments', desc: 'Collaborate with threaded comments on any task.' },
  { icon: Shield, title: 'Secure & Fast', desc: 'Built with modern tech for speed, reliability, and data safety.' },
  { icon: LayoutDashboard, title: 'Live Dashboard', desc: 'See progress at a glance with real-time stats and activity feed.' },
  { icon: Star, title: 'Beautiful Design', desc: 'Dark mode, responsive layout, and premium UI out of the box.' },
];

const testimonials = [
  { name: 'Sarah Kim', role: 'Product Lead @ Vercel', text: 'RoomPulse Lite replaced three tools for our team. The UI is stunning and it just works.' },
  { name: 'Marcus Chen', role: 'Freelance Developer', text: 'Finally a project board that feels like a real product, not a weekend hack.' },
  { name: 'Priya Sharma', role: 'Design Director', text: 'The drag-and-drop is buttery smooth. My team adopted it in minutes.' },
];

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">RoomPulse</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/signin">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-32 pb-20 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <Zap className="h-3 w-3 text-primary" />
            Now in public beta
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Where teams build
            <span className="gradient-text block">momentum.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
            A minimal, powerful project board for small teams and solo creators. Track tasks, hit deadlines, and ship faster — beautifully.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/signup">
              <Button size="lg" className="gap-2 px-6">
                Start Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/signin">
              <Button variant="outline" size="lg" className="px-6">
                Sign In
              </Button>
            </Link>
          </div>
        </motion.div>
        {/* Abstract glow */}
        <div className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/5 blur-3xl" />
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-14">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need, nothing you don't.</h2>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">Streamlined project management with the polish of a premium product.</p>
        </motion.div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="glass-card-hover rounded-xl p-6"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-base font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-border bg-secondary/30 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center text-3xl font-bold tracking-tight mb-12">Loved by makers.</motion.h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-6"
              >
                <div className="flex gap-1 mb-3">{[...Array(5)].map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-accent text-accent" />)}</div>
                <p className="text-sm text-foreground/90 leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to build momentum?</h2>
          <p className="mt-3 text-muted-foreground">Start managing your projects in seconds. No credit card required.</p>
          <Link to="/signup">
            <Button size="lg" className="mt-8 gap-2 px-8">
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl flex flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
              <Zap className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold">RoomPulse Lite</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2024 RoomPulse. Built as a portfolio project.</p>
        </div>
      </footer>
    </div>
  );
}
