import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Columns3, Shield, Activity, ArrowRight, AlertTriangle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { icon: Columns3, title: 'Workflow Boards', desc: 'Visual task flow across statuses. See what\'s moving, what\'s stuck, and what needs attention.' },
  { icon: AlertTriangle, title: 'Blocker Visibility', desc: 'Blocked tasks surface immediately — nothing stalls without the team knowing.' },
  { icon: Activity, title: 'Execution Overview', desc: 'Completion rates, delivery risk, and ownership signals. Not vanity metrics.' },
  { icon: Users, title: 'Team Ownership', desc: 'Every task has an owner. Know who\'s carrying what and where handoffs happen.' },
  { icon: Shield, title: 'Secure by Default', desc: 'Authentication, protected routes, and scoped access from the start.' },
];

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.07 } } };

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/20">
              <Zap className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-base font-bold tracking-tight">RoomPulse</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/signin">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-xs">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="shadow-lg shadow-primary/20 text-xs">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-24 sm:pt-32 pb-6 text-center">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="mx-auto max-w-2xl">
          <motion.div variants={fadeUp} className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Workflow execution for small teams
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-[1.15]">
            Keep work moving.
            <span className="gradient-text block mt-1">Surface what's stuck.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-md text-sm sm:text-base text-muted-foreground leading-relaxed">
            Clear task flow, blocker visibility, and delivery awareness for teams that ship — so nothing stalls without anyone noticing.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/signup">
              <Button size="lg" className="gap-2 px-7 h-11 text-sm shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                Start Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/signin">
              <Button variant="outline" size="lg" className="px-7 h-11 text-sm">
                View Demo
              </Button>
            </Link>
          </motion.div>
        </motion.div>
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-primary/8 blur-[100px]" />
      </section>

      {/* Product Mockup — simplified, no heavy scroll transforms */}
      <section className="relative mx-auto max-w-5xl px-4 sm:px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="rounded-xl border border-border/60 bg-card shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border/60 bg-muted/50 px-4 py-2.5">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-accent/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-status-done/60" />
              </div>
              <div className="flex-1 mx-8">
                <div className="mx-auto max-w-sm rounded-md bg-background/80 border border-border/40 px-3 py-1 text-[11px] text-muted-foreground text-center">
                  app.roompulse.dev/workflows
                </div>
              </div>
            </div>
            <div className="flex h-[260px] sm:h-[360px] lg:h-[400px]">
              <div className="hidden sm:flex w-44 flex-col border-r border-border/40 bg-muted/30 p-3">
                <div className="flex items-center gap-2 mb-5">
                  <div className="h-6 w-6 rounded-lg bg-primary flex items-center justify-center">
                    <Zap className="h-3 w-3 text-primary-foreground" />
                  </div>
                  <span className="text-xs font-bold">RoomPulse</span>
                </div>
                <div className="space-y-0.5">
                  {['Overview', 'Workflows', 'Profile'].map((item, i) => (
                    <div key={item} className={`rounded-lg px-2.5 py-1.5 text-[11px] font-medium ${i === 1 ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 p-3 sm:p-5 overflow-hidden">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">🚀</span>
                  <span className="text-xs font-bold">Q2 Product Launch</span>
                  <span className="text-[9px] bg-secondary px-1.5 py-0.5 rounded-full text-muted-foreground">8 tasks</span>
                  <span className="text-[9px] bg-destructive/10 text-destructive px-1.5 py-0.5 rounded-full font-medium">1 blocked</span>
                </div>
                <div className="flex gap-2.5 h-full">
                  {[
                    { title: 'To Do', color: 'bg-status-todo', tasks: ['Set up staging env', 'Write migration scripts'] },
                    { title: 'In Progress', color: 'bg-status-progress', tasks: ['Build onboarding flow', 'Auth redirect fix'] },
                    { title: 'Review', color: 'bg-status-review', tasks: ['Pricing page copy'] },
                    { title: 'Done', color: 'bg-status-done', tasks: ['Lock release scope'] },
                  ].map((col) => (
                    <div key={col.title} className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-1.5">
                        <div className={`h-2 w-2 rounded-full ${col.color}`} />
                        <span className="text-[9px] font-semibold truncate">{col.title}</span>
                      </div>
                      <div className="space-y-1.5">
                        {col.tasks.map((task) => (
                          <div key={task} className="rounded-lg border border-border/40 bg-background p-2 shadow-sm">
                            <p className="text-[9px] sm:text-[11px] font-medium truncate">{task}</p>
                            <div className="flex gap-1 mt-1">
                              <span className="text-[7px] px-1 py-0.5 rounded bg-primary/10 text-primary font-medium">High</span>
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
        </motion.div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">Built for teams that ship.</h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto text-sm">Visibility into what's moving, what's stuck, and who owns what — without the overhead.</p>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <motion.div key={f.title} variants={fadeUp} className="group glass-card-hover rounded-xl p-5 sm:p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors">
                <f.icon className="h-4.5 w-4.5 text-primary" />
              </div>
              <h3 className="text-sm font-bold mb-1">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/50 bg-muted/20 py-16 sm:py-24 px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">Stop managing tasks.<br />Start shipping work.</h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-sm mx-auto">Give your team the visibility to move faster and catch problems early.</p>
          <div className="mt-7">
            <Link to="/signup">
              <Button size="lg" className="gap-2 px-7 h-11 text-sm shadow-xl shadow-primary/25">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-3 w-3 text-primary-foreground" />
              </div>
              <span className="text-sm font-bold">RoomPulse</span>
            </div>
            <div className="flex items-center gap-5 text-xs">
              <Link to="/signup" className="text-foreground/70 hover:text-foreground transition-colors">Get Started</Link>
              <Link to="/signin" className="text-foreground/70 hover:text-foreground transition-colors">Sign In</Link>
            </div>
          </div>
          <div className="mt-5 pt-5 border-t border-border/40 text-center">
            <p className="text-[11px] text-muted-foreground">© {new Date().getFullYear()} RoomPulse</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
