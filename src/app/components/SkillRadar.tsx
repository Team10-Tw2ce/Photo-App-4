import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface SkillRadarProps {
  skills: Array<{ skill: string; current: number; required: number }>;
}

export function SkillRadar({ skills }: SkillRadarProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={skills}>
        <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
        <PolarAngleAxis
          dataKey="skill"
          tick={{ fill: '#8a92a8', fontSize: 12 }}
          stroke="rgba(255, 255, 255, 0.2)"
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fill: '#8a92a8', fontSize: 10 }}
          stroke="rgba(255, 255, 255, 0.1)"
        />
        <Radar
          name="Current"
          dataKey="current"
          stroke="#00d4ff"
          fill="#00d4ff"
          fillOpacity={0.3}
          strokeWidth={2}
        />
        <Radar
          name="Required"
          dataKey="required"
          stroke="#ff6b4a"
          fill="#ff6b4a"
          fillOpacity={0.2}
          strokeWidth={2}
          strokeDasharray="5 5"
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
