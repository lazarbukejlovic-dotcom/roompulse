import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md"
      >
        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <Zap className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-7xl font-extrabold tracking-tighter gradient-text mb-4">404</h1>
        <p className="text-xl font-bold mb-2">Page not found</p>
        <p className="text-sm text-muted-foreground mb-8 max-w-xs mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
