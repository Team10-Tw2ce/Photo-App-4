import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  delay?: number;
}

export function StatsCard({ title, value, icon: Icon, color, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative overflow-hidden bg-card p-6 border-2 border-border clip-corner"
      style={{
        boxShadow: `0 0 30px ${color}40`,
      }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 opacity-20"
           style={{
             background: `linear-gradient(135deg, ${color} 0%, transparent 70%)`,
             clipPath: 'polygon(100% 0, 100% 100%, 0 0)',
           }}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 border-2" style={{ borderColor: color, backgroundColor: `${color}10` }}>
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{title}</p>
          <p className="text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)', color }}>
            {value}
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1" style={{ backgroundColor: color, opacity: 0.5 }} />
    </motion.div>
  );
}
