import { motion } from "motion/react";
import { MapPin, Briefcase, Star } from "lucide-react";

interface OpportunityCardProps {
  title: string;
  company: string;
  location: string;
  type: string;
  matchScore: number;
  skills: string[];
  delay?: number;
  onClick?: () => void;
}

export function OpportunityCard({
  title,
  company,
  location,
  type,
  matchScore,
  skills,
  delay = 0,
  onClick,
}: OpportunityCardProps) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{
        y: -6,
        boxShadow: "0 8px 40px rgba(139, 92, 246, 0.4)",
      }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="w-full text-left bg-card p-6 border-2 border-border cursor-pointer transition-all clip-corner relative overflow-hidden"
    >
      <div
        className="absolute top-0 right-0 w-24 h-24 opacity-10"
        style={{
          background:
            "linear-gradient(135deg, #8b5cf6 0%, transparent 70%)",
          clipPath: "polygon(100% 0, 100% 100%, 0 0)",
        }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground mb-1 uppercase tracking-wide">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground font-medium">
              {company}
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/20 border-2 border-primary">
            <Star className="w-5 h-5 text-primary fill-primary" />
            <span className="text-lg font-bold text-primary font-mono">
              {matchScore}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            <span>{type}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-accent/10 text-accent border-2 border-accent/30"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
    </motion.button>
  );
}