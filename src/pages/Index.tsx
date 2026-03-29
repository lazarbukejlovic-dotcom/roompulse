import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, LayoutDashboard, CheckCircle2, Users, ArrowRight, Columns3, Shield, Sparkles, TrendingUp, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';

const features = [
  { icon: Columns3, title: 'Visual Kanban Boards', desc: 'Drag-and-drop task management with real-time status columns. Move work forward visually.' },
  { icon: CheckCircle2, title: 'Smart Task Tracking', desc: 'Priorities, due dates, tags, and threaded comments — everything in one place.' },
  { icon: Users, title: 'Team Collaboration', desc: 'Comment threads, activity feeds, and shared boards keep everyone aligned.' },
  { icon: Shield, title: 'Secure by Default', desc: 'JWT authentication, protected routes, and encrypted storage from day one.' },
  { icon: LayoutDashboard, title: 'Live Dashboard', desc: 'Real-time stats, completion charts, and activity summaries at a glance.' },
  { icon: Sparkles, title: 'Premium Dark Mode', desc: 'A carefully crafted dark theme that looks stunning — not just inverted colors.' },
];

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/20">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">RoomPulse</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/signin">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="shadow-lg shadow-primary/20">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative flex flex-col items-center justify-center px-4 pt-28 sm:pt-36 pb-8 text-center">
        <motion.div style={{ y: heroY, opacity: heroOpacity }}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="mx-auto max-w-3xl"
          >
            <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              Now available — free to use
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1]">
              Ship projects with
              <span className="gradient-text block mt-1">clarity & momentum.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              The project board built for makers who care about craft. Track tasks, visualize progress, and hit every deadline — beautifully.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link to="/signup">
                <Button size="lg" className="gap-2 px-8 h-12 text-base shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                  Start Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/signin">
                <Button variant="outline" size="lg" className="px-8 h-12 text-base">
                  View Demo
                </Button>
              </Link>
            </motion.div>
            <motion.p variants={fadeUp} className="mt-4 text-xs text-muted-foreground">
              No credit card required · Set up in 30 seconds
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Ambient glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-primary/8 blur-[120px]" />
        <div className="pointer-events-none absolute top-40 left-1/4 h-[300px] w-[400px] rounded-full bg-accent/5 blur-[100px]" />
      </section>

      {/* Product Mockup */}
      <section className="relative mx-auto max-w-6xl px-4 sm:px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="rounded-xl border border-border/60 bg-card shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden">
            {/* Fake browser chrome */}
            <div className="flex items-center gap-2 border-b border-border/60 bg-muted/50 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-accent/60" />
                <div className="h-3 w-3 rounded-full bg-status-done/60" />
              </div>
              <div className="flex-1 mx-8">
                <div className="mx-auto max-w-md rounded-md bg-background/80 border border-border/40 px-4 py-1.5 text-xs text-muted-foreground text-center">
                  app.roompulse.dev/boards
                </div>
              </div>
            </div>
            {/* Fake app content */}
            <div className="flex h-[320px] sm:h-[420px] lg:h-[480px]">
              {/* Sidebar mock */}
              <div className="hidden sm:flex w-52 flex-col border-r border-border/40 bg-muted/30 p-4">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                    <Zap className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-bold">RoomPulse</span>
                </div>
                <div className="space-y-1">
                  {['Dashboard', 'Boards', 'Profile'].map((item, i) => (
                    <div key={item} className={`rounded-lg px-3 py-2 text-xs font-medium ${i === 1 ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              {/* Main content mock - Kanban */}
              <div className="flex-1 p-4 sm:p-6 overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-lg">🚀</span>
                  <span className="text-sm font-bold">Product Launch</span>
                  <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">8 tasks</span>
                </div>
                <div className="flex gap-3 h-full">
                  {[
                    { title: 'To Do', color: 'bg-status-todo', tasks: ['Setup CI/CD pipeline', 'Write API docs'] },
                    { title: 'In Progress', color: 'bg-status-progress', tasks: ['Design landing page', 'Build auth flow'] },
                    { title: 'Review', color: 'bg-status-review', tasks: ['Pricing page copy'] },
                    { title: 'Done', color: 'bg-status-done', tasks: ['Define timeline'] },
                  ].map((col) => (
                    <div key={col.title} className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className={`h-2 w-2 rounded-full ${col.color}`} />
                        <span className="text-[10px] font-semibold truncate">{col.title}</span>
                      </div>
                      <div className="space-y-2">
                        {col.tasks.map((task) => (
                          <div key={task} className="rounded-lg border border-border/40 bg-background p-2.5 shadow-sm">
                            <p className="text-[10px] sm:text-xs font-medium truncate">{task}</p>
                            <div className="flex gap-1 mt-1.5">
                              <span className="text-[8px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">High</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Reflection gradient */}
          <div className="absolute -bottom-px left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </motion.div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-28">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Features</span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">Everything you need,<br className="hidden sm:block" /> nothing you don't.</h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto text-base">Streamlined project management with the polish of a premium product.</p>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              className="group glass-card-hover rounded-xl p-6 sm:p-7"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-base font-bold mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How it works */}
      <section className="border-t border-border/50 bg-muted/20 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">How it works</span>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">From idea to shipped in three steps.</h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid gap-8 sm:grid-cols-3">
            {[
              { step: '01', icon: Columns3, title: 'Create a board', desc: 'Set up boards for each project, team, or workflow. Customize with icons and colors.' },
              { step: '02', icon: TrendingUp, title: 'Track progress', desc: 'Drag tasks through columns, set priorities and deadlines, and watch progress unfold.' },
              { step: '03', icon: Globe, title: 'Ship with confidence', desc: 'Use the dashboard to spot blockers, review activity, and keep shipping.' },
            ].map((s) => (
              <motion.div key={s.step} variants={fadeUp} className="text-center sm:text-left">
                <span className="text-5xl font-extrabold text-primary/10 block mb-3">{s.step}</span>
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                  <s.icon className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-bold">{s.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/50 bg-muted/20 py-20 sm:py-28 px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mx-auto max-w-2xl text-center">
          <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Zap className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">Ready to build momentum?</h2>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg max-w-md mx-auto">Start managing your projects in seconds. Free forever for individuals.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signup">
              <Button size="lg" className="gap-2 px-8 h-12 text-base shadow-xl shadow-primary/25">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">No credit card · No setup · No friction</p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                  <Zap className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <span className="text-sm font-bold">RoomPulse</span>
              </div>
              <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                A premium project management tool built for small teams and creators who care about craft.
              </p>
            </div>
            <div className="flex gap-12 text-sm">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Product</p>
                <div className="space-y-2">
                  <Link to="/signup" className="block text-sm text-foreground/70 hover:text-foreground transition-colors">Get Started</Link>
                  <Link to="/signin" className="block text-sm text-foreground/70 hover:text-foreground transition-colors">Sign In</Link>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Built with</p>
                <div className="space-y-2">
                  <span className="block text-sm text-foreground/70">React + TypeScript</span>
                  <span className="block text-sm text-foreground/70">Tailwind CSS</span>
                  <span className="block text-sm text-foreground/70">Zustand</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} RoomPulse. All rights reserved.</p>
            <p className="text-xs text-muted-foreground">Designed & engineered with care.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
