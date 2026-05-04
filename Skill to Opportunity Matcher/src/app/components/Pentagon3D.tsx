import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface Pentagon3DProps {
  skills: Array<{ name: string; value: number; required: number }>;
}

export function Pentagon3D({ skills }: Pentagon3DProps) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const centerX = 200;
  const centerY = 200;
  const radius = 120;
  const innerRadius = 80;

  const getPoint = (index: number, r: number, angleOffset: number = 0) => {
    const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2 + (angleOffset * Math.PI) / 180;
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
    };
  };

  const createPentagonPath = (r: number, angleOffset: number = 0) => {
    const points = Array.from({ length: 5 }, (_, i) => getPoint(i, r, angleOffset));
    return `M ${points[0].x} ${points[0].y} ${points
      .slice(1)
      .map((p) => `L ${p.x} ${p.y}`)
      .join(' ')} Z`;
  };

  const createSkillPath = (values: number[], angleOffset: number = 0) => {
    const points = values.map((value, i) => {
      const r = (value / 100) * radius;
      return getPoint(i, r, angleOffset);
    });
    return `M ${points[0].x} ${points[0].y} ${points
      .slice(1)
      .map((p) => `L ${p.x} ${p.y}`)
      .join(' ')} Z`;
  };

  const currentValues = skills.map((s) => s.value);
  const requiredValues = skills.map((s) => s.required);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg width="400" height="400" viewBox="0 0 400 400" className="max-w-full">
        <defs>
          <linearGradient id="pentagonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#d946ef" stopOpacity="0.1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#8b5cf6" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Background grid lines */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
          <path
            key={i}
            d={createPentagonPath(radius * scale, rotation * 0.1)}
            fill="none"
            stroke="rgba(139, 92, 246, 0.1)"
            strokeWidth="1"
          />
        ))}

        {/* Grid lines from center */}
        {Array.from({ length: 5 }).map((_, i) => {
          const point = getPoint(i, radius, rotation * 0.1);
          return (
            <line
              key={i}
              x1={centerX}
              y1={centerY}
              x2={point.x}
              y2={point.y}
              stroke="rgba(139, 92, 246, 0.1)"
              strokeWidth="1"
            />
          );
        })}

        {/* 3D effect - shadow layer */}
        <motion.path
          d={createSkillPath(currentValues, rotation * 0.1 + 5)}
          fill="url(#pentagonGradient)"
          stroke="#8b5cf6"
          strokeWidth="2"
          opacity="0.3"
          style={{
            transform: 'translate(4px, 4px)',
          }}
        />

        {/* Required pentagon (dashed) */}
        <motion.path
          d={createSkillPath(requiredValues, rotation * 0.1)}
          fill="rgba(217, 70, 239, 0.1)"
          stroke="#d946ef"
          strokeWidth="2"
          strokeDasharray="8 4"
          filter="url(#glow)"
        />

        {/* Current skills pentagon */}
        <motion.path
          d={createSkillPath(currentValues, rotation * 0.1)}
          fill="rgba(139, 92, 246, 0.2)"
          stroke="#8b5cf6"
          strokeWidth="3"
          filter="url(#glow)"
        />

        {/* Skill points */}
        {skills.map((skill, i) => {
          const r = (skill.value / 100) * radius;
          const point = getPoint(i, r, rotation * 0.1);
          return (
            <g key={i}>
              <circle
                cx={point.x}
                cy={point.y}
                r="6"
                fill="#8b5cf6"
                stroke="#c084fc"
                strokeWidth="2"
                filter="url(#glow)"
              />
            </g>
          );
        })}

        {/* Skill labels */}
        {skills.map((skill, i) => {
          const point = getPoint(i, radius + 30, rotation * 0.1);
          return (
            <text
              key={i}
              x={point.x}
              y={point.y}
              textAnchor="middle"
              fill="#c084fc"
              fontSize="14"
              fontWeight="600"
              fontFamily="var(--font-heading)"
            >
              {skill.name}
            </text>
          );
        })}

        {/* Center indicator */}
        <circle cx={centerX} cy={centerY} r="4" fill="#d946ef" filter="url(#glow)" />
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-primary" style={{ boxShadow: '0 0 8px var(--primary)' }} />
          <span className="text-xs text-muted-foreground font-medium">Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 border-2 border-accent" style={{ borderStyle: 'dashed' }} />
          <span className="text-xs text-muted-foreground font-medium">Required</span>
        </div>
      </div>
    </div>
  );
}
