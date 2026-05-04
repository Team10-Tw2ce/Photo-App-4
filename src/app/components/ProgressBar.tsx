import { motion } from 'motion/react';

interface ProgressBarProps {
  skill: string;
  current: number;
  required: number;
  delay?: number;
}

export function ProgressBar({ skill, current, required, delay = 0 }: ProgressBarProps) {
  const percentage = Math.min((current / required) * 100, 100);
  const isComplete = current >= required;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground uppercase tracking-wider">{skill}</span>
        <span className={`text-sm font-bold font-mono ${isComplete ? 'text-primary' : 'text-muted-foreground'}`}>
          {current}/{required}
        </span>
      </div>
      <div className="relative h-3 bg-muted border border-border overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: delay + 0.2, ease: 'easeOut' }}
          className={`absolute h-full ${
            isComplete ? 'bg-primary' : 'bg-gradient-to-r from-primary via-secondary to-accent'
          }`}
          style={{
            boxShadow: isComplete ? '0 0 15px var(--primary)' : '0 0 15px var(--accent)',
          }}
        />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px)',
        }} />
      </div>
    </motion.div>
  );
}
