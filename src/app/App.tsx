import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui/tabs";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import {
  Target,
  TrendingUp,
  Award,
  Zap,
  Search,
  Plus,
  StickyNote,
  LayoutDashboard,
  Sparkles,
  Shield,
  Check,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { StatsCard } from "./components/StatsCard";
import { ProgressBar } from "./components/ProgressBar";
import { Pentagon3D } from "./components/Pentagon3D";
import { OpportunityCard } from "./components/OpportunityCard";

interface Opportunity {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  matchScore: number;
  skills: string[];
}

interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
}

type Competency = "Frontend" | "Backend" | "Design" | "Leadership" | "Teamwork";

interface Subtask {
  id: number;
  title: string;
  completed: boolean;
}

interface Recommendation {
  id: number;
  title: string;
  description: string;
  xpGain: number;
  impact: "Critical" | "High" | "Medium";
  competencies: Competency[];
  subtasks: Subtask[];
  progress: number;
}

interface Skill {
  id: number;
  name: string;
  xpValue: number;
  completed: boolean;
  dateAdded: string;
  dateCompleted?: string;
  competencies: Competency[];
  subtasks: Subtask[];
  progress: number;
}

interface UserProfile {
  name: string;
  level: number;
  xp: number;
}

interface CompetencyStats {
  Frontend: number;
  Backend: number;
  Design: number;
  Leadership: number;
  Teamwork: number;
}

const STORAGE_KEYS = {
  notes: "skill-matcher-notes",
  opportunities: "skill-matcher-opportunities",
  startedRecommendations:
    "skill-matcher-started-recommendations",
  skills: "skill-matcher-skills",
  userProfile: "skill-matcher-user-profile",
  completedRecommendations: "skill-matcher-completed-recommendations",
  competencyStats: "skill-matcher-competency-stats",
  recommendations: "skill-matcher-recommendations",
};

const defaultNotes: Note[] = [
  {
    id: 1,
    title: "React Best Practices",
    content: "Focus on hooks and functional components",
    date: "2026-04-10",
  },
  {
    id: 2,
    title: "Networking Event",
    content:
      "Tech career fair on April 20th - prepare portfolio",
    date: "2026-04-12",
  },
];

const defaultOpportunities: Opportunity[] = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "TechCorp",
    location: "San Francisco, CA",
    type: "Internship",
    matchScore: 92,
    skills: ["React", "TypeScript", "CSS"],
  },
  {
    id: 2,
    title: "Full Stack Developer",
    company: "StartupXYZ",
    location: "Remote",
    type: "Full-time",
    matchScore: 85,
    skills: ["React", "Node.js", "MongoDB"],
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "DesignStudio",
    location: "New York, NY",
    type: "Part-time",
    matchScore: 68,
    skills: ["Figma", "UI Design", "Prototyping"],
  },
  {
    id: 4,
    title: "Junior Software Engineer",
    company: "CloudServices Inc",
    location: "Austin, TX",
    type: "Full-time",
    matchScore: 78,
    skills: ["JavaScript", "Python", "AWS"],
  },
];

const defaultRecommendations: Recommendation[] = [
  {
    id: 1,
    title: "Complete TypeScript Course",
    description:
      "Master TypeScript fundamentals and advanced patterns for type-safe JavaScript development",
    xpGain: 150,
    impact: "High",
    competencies: ["Frontend"],
    subtasks: [
      { id: 1, title: "Learn basic types and interfaces", completed: false },
      { id: 2, title: "Master generics and utility types", completed: false },
      { id: 3, title: "Build a typed React application", completed: false },
    ],
    progress: 0,
  },
  {
    id: 2,
    title: "Build REST API with Node.js",
    description:
      "Create a production-ready RESTful API using Node.js, Express, and database integration",
    xpGain: 200,
    impact: "Critical",
    competencies: ["Backend"],
    subtasks: [
      { id: 1, title: "Set up Express server and routing", completed: false },
      { id: 2, title: "Implement database models and CRUD operations", completed: false },
      { id: 3, title: "Add authentication and authorization", completed: false },
      { id: 4, title: "Deploy to production", completed: false },
    ],
    progress: 0,
  },
  {
    id: 3,
    title: "Design System Workshop",
    description:
      "Learn to create cohesive UI design systems with Figma and component libraries",
    xpGain: 120,
    impact: "High",
    competencies: ["Design", "Frontend"],
    subtasks: [
      { id: 1, title: "Study design system principles", completed: false },
      { id: 2, title: "Create component library in Figma", completed: false },
      { id: 3, title: "Implement design tokens", completed: false },
    ],
    progress: 0,
  },
  {
    id: 4,
    title: "Lead Code Review Sessions",
    description:
      "Practice technical leadership by conducting thorough code reviews for your team",
    xpGain: 100,
    impact: "Medium",
    competencies: ["Leadership", "Teamwork"],
    subtasks: [
      { id: 1, title: "Learn code review best practices", completed: false },
      { id: 2, title: "Conduct 5 code reviews with constructive feedback", completed: false },
      { id: 3, title: "Mentor junior developers through reviews", completed: false },
    ],
    progress: 0,
  },
  {
    id: 5,
    title: "Agile Team Collaboration Project",
    description:
      "Work on a group project using Scrum methodology and collaborative development practices",
    xpGain: 90,
    impact: "Medium",
    competencies: ["Teamwork"],
    subtasks: [
      { id: 1, title: "Participate in sprint planning and daily standups", completed: false },
      { id: 2, title: "Complete assigned user stories collaboratively", completed: false },
      { id: 3, title: "Present work in sprint retrospective", completed: false },
    ],
    progress: 0,
  },
];

const defaultSkills: Skill[] = [
  {
    id: 1,
    name: "React",
    xpValue: 100,
    completed: true,
    dateAdded: "2026-03-15",
    dateCompleted: "2026-04-01",
    competencies: ["Frontend"],
    subtasks: [
      { id: 1, title: "Learn JSX and component basics", completed: true },
      { id: 2, title: "Master hooks (useState, useEffect)", completed: true },
      { id: 3, title: "Build a complete React app", completed: true },
    ],
    progress: 100,
  },
  {
    id: 2,
    name: "TypeScript",
    xpValue: 120,
    completed: true,
    dateAdded: "2026-03-16",
    dateCompleted: "2026-04-05",
    competencies: ["Frontend"],
    subtasks: [
      { id: 1, title: "Understand type annotations", completed: true },
      { id: 2, title: "Work with interfaces and types", completed: true },
    ],
    progress: 100,
  },
  {
    id: 3,
    name: "CSS",
    xpValue: 80,
    completed: true,
    dateAdded: "2026-03-20",
    dateCompleted: "2026-04-08",
    competencies: ["Frontend", "Design"],
    subtasks: [
      { id: 1, title: "Master flexbox and grid", completed: true },
      { id: 2, title: "Learn responsive design", completed: true },
      { id: 3, title: "Practice CSS animations", completed: true },
    ],
    progress: 100,
  },
  {
    id: 4,
    name: "Node.js",
    xpValue: 150,
    completed: false,
    dateAdded: "2026-04-10",
    competencies: ["Backend"],
    subtasks: [
      { id: 1, title: "Learn Node.js fundamentals", completed: false },
      { id: 2, title: "Work with npm and modules", completed: false },
      { id: 3, title: "Build a CLI tool", completed: false },
      { id: 4, title: "Create an HTTP server", completed: false },
    ],
    progress: 0,
  },
  {
    id: 5,
    name: "MongoDB",
    xpValue: 100,
    completed: false,
    dateAdded: "2026-04-12",
    competencies: ["Backend"],
    subtasks: [
      { id: 1, title: "Understand NoSQL concepts", completed: false },
      { id: 2, title: "Practice CRUD operations", completed: false },
      { id: 3, title: "Design database schemas", completed: false },
    ],
    progress: 0,
  },
];

const defaultCompetencyStats: CompetencyStats = {
  Frontend: 60,
  Backend: 40,
  Design: 30,
  Leadership: 35,
  Teamwork: 45,
};

const defaultUserProfile: UserProfile = {
  name: "Alex Chen",
  level: 7,
  xp: 3420,
};

const calculateLevel = (xp: number): number => {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

const calculateXpForNextLevel = (level: number): number => {
  return Math.pow(level, 2) * 100;
};

const suggestXpForSkill = (skillName: string): number => {
  const lowerSkill = skillName.toLowerCase();

  if (lowerSkill.includes("advanced") || lowerSkill.includes("expert") || lowerSkill.includes("senior")) {
    return 200;
  }
  if (lowerSkill.includes("intermediate") || lowerSkill.includes("full")) {
    return 150;
  }
  if (lowerSkill.includes("basic") || lowerSkill.includes("intro") || lowerSkill.includes("beginner")) {
    return 50;
  }

  const complexKeywords = ["architecture", "system design", "machine learning", "ai", "blockchain", "kubernetes", "aws", "cloud"];
  if (complexKeywords.some(keyword => lowerSkill.includes(keyword))) {
    return 180;
  }

  const standardKeywords = ["react", "vue", "angular", "node", "python", "java", "database", "sql"];
  if (standardKeywords.some(keyword => lowerSkill.includes(keyword))) {
    return 100;
  }

  return 80;
};

const suggestCompetenciesForSkill = (skillName: string): Competency[] => {
  const lowerSkill = skillName.toLowerCase();
  const competencies: Competency[] = [];

  const frontendKeywords = ["react", "vue", "angular", "javascript", "typescript", "html", "css", "ui", "frontend", "web", "dom"];
  if (frontendKeywords.some(keyword => lowerSkill.includes(keyword))) {
    competencies.push("Frontend");
  }

  const backendKeywords = ["node", "backend", "api", "server", "database", "sql", "mongodb", "postgres", "express", "django", "flask"];
  if (backendKeywords.some(keyword => lowerSkill.includes(keyword))) {
    competencies.push("Backend");
  }

  const designKeywords = ["design", "figma", "sketch", "ux", "ui/ux", "prototyp", "wireframe", "graphic", "color", "typography"];
  if (designKeywords.some(keyword => lowerSkill.includes(keyword))) {
    competencies.push("Design");
  }

  const leadershipKeywords = ["lead", "manage", "mentor", "architect", "director", "senior", "principal"];
  if (leadershipKeywords.some(keyword => lowerSkill.includes(keyword))) {
    competencies.push("Leadership");
  }

  const teamworkKeywords = ["agile", "scrum", "collaboration", "team", "communication", "pair programming"];
  if (teamworkKeywords.some(keyword => lowerSkill.includes(keyword))) {
    competencies.push("Teamwork");
  }

  return competencies.length > 0 ? competencies : ["Frontend"];
};

const generateSubtasksForSkill = (skillName: string): Subtask[] => {
  return [
    { id: 1, title: `Learn ${skillName} fundamentals`, completed: false },
    { id: 2, title: `Practice ${skillName} with projects`, completed: false },
    { id: 3, title: `Master advanced ${skillName} concepts`, completed: false },
  ];
};

const calculateCompetencyIncrease = (xpValue: number): number => {
  return Math.round(xpValue / 10);
};

function readStoredValue<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  const stored = window.localStorage.getItem(key);
  if (!stored) {
    return fallback;
  }

  try {
    return JSON.parse(stored) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [notes, setNotes] = useState<Note[]>(() =>
    readStoredValue(STORAGE_KEYS.notes, defaultNotes),
  );
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
  });
  const [noteError, setNoteError] = useState("");
  const [opportunities, setOpportunities] = useState<
    Opportunity[]
  >(() =>
    readStoredValue(
      STORAGE_KEYS.opportunities,
      defaultOpportunities,
    ),
  );
  const [isAddOpportunityOpen, setIsAddOpportunityOpen] =
    useState(false);
  const [opportunityError, setOpportunityError] = useState("");
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(
    null,
  );
  const [selectedRecommendation, setSelectedRecommendation] =
    useState<Recommendation | null>(null);
  const [startedRecommendations, setStartedRecommendations] =
    useState<number[]>(() =>
      readStoredValue(STORAGE_KEYS.startedRecommendations, []),
    );
  const [newOpportunity, setNewOpportunity] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    skills: "",
    matchScore: "75",
  });
  const [skills, setSkills] = useState<Skill[]>(() =>
    readStoredValue(STORAGE_KEYS.skills, defaultSkills),
  );
  const [userProfile, setUserProfile] = useState<UserProfile>(() =>
    readStoredValue(STORAGE_KEYS.userProfile, defaultUserProfile),
  );
  const [completedRecommendations, setCompletedRecommendations] = useState<number[]>(() =>
    readStoredValue(STORAGE_KEYS.completedRecommendations, []),
  );
  const [isSkillsDialogOpen, setIsSkillsDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillError, setNewSkillError] = useState("");
  const [levelUpNotification, setLevelUpNotification] = useState<number | null>(null);
  const [animatedXp, setAnimatedXp] = useState(userProfile.xp);
  const [competencyStats, setCompetencyStats] = useState<CompetencyStats>(() =>
    readStoredValue(STORAGE_KEYS.competencyStats, defaultCompetencyStats),
  );
  const [selectedCompetencies, setSelectedCompetencies] = useState<Competency[]>(["Frontend"]);
  const [selectedSkillForSubtasks, setSelectedSkillForSubtasks] = useState<Skill | null>(null);
  const [selectedRecommendationForSubtasks, setSelectedRecommendationForSubtasks] = useState<Recommendation | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(() =>
    readStoredValue(STORAGE_KEYS.recommendations, defaultRecommendations),
  );

  const studentData = {
    name: userProfile.name,
    level: userProfile.level,
    xp: userProfile.xp,
    nextLevelXp: calculateXpForNextLevel(userProfile.level),
    skillsCompleted: skills.filter(s => s.completed).length,
    totalSkills: skills.length,
    matchScore: 78,
  };

  const pentagonData = [
    { name: "Frontend", value: competencyStats.Frontend, required: 80 },
    { name: "Backend", value: competencyStats.Backend, required: 75 },
    { name: "Design", value: competencyStats.Design, required: 70 },
    { name: "Leadership", value: competencyStats.Leadership, required: 65 },
    { name: "Teamwork", value: competencyStats.Teamwork, required: 75 },
  ];

  const coreCompetencyProgress = [
    { skill: "Frontend", current: competencyStats.Frontend, required: 80 },
    { skill: "Backend", current: competencyStats.Backend, required: 75 },
    { skill: "Design", current: competencyStats.Design, required: 70 },
    { skill: "Leadership", current: competencyStats.Leadership, required: 65 },
    { skill: "Teamwork", current: competencyStats.Teamwork, required: 75 },
  ];

  useEffect(() => {
    if (newSkillName.trim()) {
      const suggested = suggestCompetenciesForSkill(newSkillName);
      setSelectedCompetencies(suggested);
    }
  }, [newSkillName]);

  useEffect(() => {
    if (selectedRecommendationForSubtasks) {
      const updated = recommendations.find(r => r.id === selectedRecommendationForSubtasks.id);
      if (updated) {
        setSelectedRecommendationForSubtasks(updated);
      }
    }
  }, [recommendations]);

  useEffect(() => {
    if (selectedSkillForSubtasks) {
      const updated = skills.find(s => s.id === selectedSkillForSubtasks.id);
      if (updated) {
        setSelectedSkillForSubtasks(updated);
      }
    }
  }, [skills]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.notes,
      JSON.stringify(notes),
    );
  }, [notes]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.opportunities,
      JSON.stringify(opportunities),
    );
  }, [opportunities]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.startedRecommendations,
      JSON.stringify(startedRecommendations),
    );
  }, [startedRecommendations]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.skills,
      JSON.stringify(skills),
    );
  }, [skills]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.userProfile,
      JSON.stringify(userProfile),
    );
  }, [userProfile]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.completedRecommendations,
      JSON.stringify(completedRecommendations),
    );
  }, [completedRecommendations]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.competencyStats,
      JSON.stringify(competencyStats),
    );
  }, [competencyStats]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.recommendations,
      JSON.stringify(recommendations),
    );
  }, [recommendations]);

  useEffect(() => {
    const startXp = animatedXp;
    const targetXp = userProfile.xp;
    const diff = targetXp - startXp;

    if (diff === 0) return;

    const duration = 1500;
    const steps = 60;
    const stepDuration = duration / steps;
    const stepValue = diff / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setAnimatedXp(targetXp);
        clearInterval(interval);
      } else {
        setAnimatedXp(prev => prev + stepValue);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [userProfile.xp]);

  const addNote = () => {
    const title = newNote.title.trim();
    const content = newNote.content.trim();

    if (!title || !content) {
      setNoteError("Enter both a title and note content.");
      return;
    }

    setNotes([
      {
        id: Date.now(),
        title,
        content,
        date: new Date().toISOString().split("T")[0],
      },
      ...notes,
    ]);
    setNewNote({ title: "", content: "" });
    setNoteError("");
  };

  const addOpportunity = () => {
    const title = newOpportunity.title.trim();
    const company = newOpportunity.company.trim();
    const location = newOpportunity.location.trim();
    const type = newOpportunity.type.trim();
    const skills = newOpportunity.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
    const parsedScore = Number(newOpportunity.matchScore);

    if (
      !title ||
      !company ||
      !location ||
      !type ||
      skills.length === 0
    ) {
      setOpportunityError(
        "Complete every field and add at least one skill.",
      );
      return;
    }

    if (
      Number.isNaN(parsedScore) ||
      parsedScore < 0 ||
      parsedScore > 100
    ) {
      setOpportunityError(
        "Match score must be between 0 and 100.",
      );
      return;
    }

    setOpportunities([
      {
        id: Date.now(),
        title,
        company,
        location,
        type,
        skills,
        matchScore: Math.round(parsedScore),
      },
      ...opportunities,
    ]);
    setNewOpportunity({
      title: "",
      company: "",
      location: "",
      type: "",
      skills: "",
      matchScore: "75",
    });
    setOpportunityError("");
    setIsAddOpportunityOpen(false);
  };

  const startRecommendation = (
    recommendation: Recommendation,
  ) => {
    if (startedRecommendations.includes(recommendation.id)) {
      setSelectedRecommendation(recommendation);
      return;
    }

    setStartedRecommendations([
      recommendation.id,
      ...startedRecommendations,
    ]);
    setSelectedRecommendation(recommendation);
  };

  const isRecommendationStarted = (recommendationId: number) =>
    startedRecommendations.includes(recommendationId);

  const isRecommendationCompleted = (recommendationId: number) =>
    completedRecommendations.includes(recommendationId);

  const addSkill = () => {
    const name = newSkillName.trim();
    if (!name) {
      setNewSkillError("Please enter a skill name.");
      return;
    }

    if (skills.some(s => s.name.toLowerCase() === name.toLowerCase())) {
      setNewSkillError("This skill already exists.");
      return;
    }

    if (selectedCompetencies.length === 0) {
      setNewSkillError("Please select at least one competency.");
      return;
    }

    const xpValue = suggestXpForSkill(name);
    const subtasks = generateSubtasksForSkill(name);
    const newSkill: Skill = {
      id: Date.now(),
      name,
      xpValue,
      completed: false,
      dateAdded: new Date().toISOString().split("T")[0],
      competencies: [...selectedCompetencies],
      subtasks,
      progress: 0,
    };

    setSkills([newSkill, ...skills]);
    setNewSkillName("");
    setSelectedCompetencies(suggestCompetenciesForSkill(name));
    setNewSkillError("");
  };

  const toggleSubtaskForSkill = (skillId: number, subtaskId: number) => {
    const skill = skills.find(s => s.id === skillId);
    if (!skill) return;

    const updatedSubtasks = skill.subtasks.map(st =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    const completedCount = updatedSubtasks.filter(st => st.completed).length;
    const progress = Math.round((completedCount / updatedSubtasks.length) * 100);
    const allCompleted = progress === 100;

    const updatedSkill = {
      ...skill,
      subtasks: updatedSubtasks,
      progress,
      completed: allCompleted,
      dateCompleted: allCompleted ? new Date().toISOString().split("T")[0] : undefined,
    };

    const wasCompleted = skill.completed;
    const isNowCompleted = allCompleted;

    if (!wasCompleted && isNowCompleted) {
      const oldLevel = userProfile.level;
      const newXp = userProfile.xp + skill.xpValue;
      const newLevel = calculateLevel(newXp);
      const competencyIncrease = calculateCompetencyIncrease(skill.xpValue);

      setUserProfile({
        ...userProfile,
        xp: newXp,
        level: newLevel,
      });

      const newCompetencyStats = { ...competencyStats };
      skill.competencies.forEach(comp => {
        newCompetencyStats[comp] = Math.min(100, newCompetencyStats[comp] + competencyIncrease / skill.competencies.length);
      });
      setCompetencyStats(newCompetencyStats);

      if (newLevel > oldLevel) {
        setLevelUpNotification(newLevel);
        setTimeout(() => setLevelUpNotification(null), 5000);
      }
    } else if (wasCompleted && !isNowCompleted) {
      const newXp = Math.max(0, userProfile.xp - skill.xpValue);
      const newLevel = calculateLevel(newXp);
      const competencyDecrease = calculateCompetencyIncrease(skill.xpValue);

      setUserProfile({
        ...userProfile,
        xp: newXp,
        level: newLevel,
      });

      const newCompetencyStats = { ...competencyStats };
      skill.competencies.forEach(comp => {
        newCompetencyStats[comp] = Math.max(0, newCompetencyStats[comp] - competencyDecrease / skill.competencies.length);
      });
      setCompetencyStats(newCompetencyStats);
    }

    setSkills(skills.map(s => s.id === skillId ? updatedSkill : s));
  };

  const toggleSubtaskForRecommendation = (recommendationId: number, subtaskId: number) => {
    const recommendation = recommendations.find(r => r.id === recommendationId);
    if (!recommendation) return;

    const wasCompleted = completedRecommendations.includes(recommendationId);

    const updatedSubtasks = recommendation.subtasks.map(st =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    const completedCount = updatedSubtasks.filter(st => st.completed).length;
    const progress = Math.round((completedCount / updatedSubtasks.length) * 100);
    const allCompleted = progress === 100;

    const updatedRecommendation = {
      ...recommendation,
      subtasks: updatedSubtasks,
      progress,
    };

    setRecommendations(recommendations.map(r =>
      r.id === recommendationId ? updatedRecommendation : r
    ));

    if (!wasCompleted && allCompleted) {
      const oldLevel = userProfile.level;
      const newXp = userProfile.xp + recommendation.xpGain;
      const newLevel = calculateLevel(newXp);
      const competencyIncrease = calculateCompetencyIncrease(recommendation.xpGain);

      setCompletedRecommendations([recommendationId, ...completedRecommendations]);
      setStartedRecommendations(startedRecommendations.filter(id => id !== recommendationId));

      setUserProfile({
        ...userProfile,
        xp: newXp,
        level: newLevel,
      });

      const newCompetencyStats = { ...competencyStats };
      recommendation.competencies.forEach(comp => {
        newCompetencyStats[comp] = Math.min(100, newCompetencyStats[comp] + competencyIncrease / recommendation.competencies.length);
      });
      setCompetencyStats(newCompetencyStats);

      if (newLevel > oldLevel) {
        setLevelUpNotification(newLevel);
        setTimeout(() => setLevelUpNotification(null), 5000);
      }
    } else if (wasCompleted && !allCompleted) {
      const newXp = Math.max(0, userProfile.xp - recommendation.xpGain);
      const newLevel = calculateLevel(newXp);
      const competencyDecrease = calculateCompetencyIncrease(recommendation.xpGain);

      setCompletedRecommendations(completedRecommendations.filter(id => id !== recommendationId));

      setUserProfile({
        ...userProfile,
        xp: newXp,
        level: newLevel,
      });

      const newCompetencyStats = { ...competencyStats };
      recommendation.competencies.forEach(comp => {
        newCompetencyStats[comp] = Math.max(0, newCompetencyStats[comp] - competencyDecrease / recommendation.competencies.length);
      });
      setCompetencyStats(newCompetencyStats);
    }
  };

  const undoRecommendation = (recommendationId: number) => {
    const recommendation = recommendations.find(r => r.id === recommendationId);
    if (!recommendation) return;

    const wasCompleted = completedRecommendations.includes(recommendationId);
    const wasStarted = startedRecommendations.includes(recommendationId);

    if (wasCompleted) {
      const newXp = Math.max(0, userProfile.xp - recommendation.xpGain);
      const newLevel = calculateLevel(newXp);
      const competencyDecrease = calculateCompetencyIncrease(recommendation.xpGain);

      setCompletedRecommendations(completedRecommendations.filter(id => id !== recommendationId));

      setUserProfile({
        ...userProfile,
        xp: newXp,
        level: newLevel,
      });

      const newCompetencyStats = { ...competencyStats };
      recommendation.competencies.forEach(comp => {
        newCompetencyStats[comp] = Math.max(0, newCompetencyStats[comp] - competencyDecrease / recommendation.competencies.length);
      });
      setCompetencyStats(newCompetencyStats);

      setRecommendations(recommendations.map(r =>
        r.id === recommendationId
          ? {
              ...r,
              subtasks: r.subtasks.map(st => ({ ...st, completed: false })),
              progress: 0,
            }
          : r
      ));
    } else if (wasStarted) {
      setStartedRecommendations(startedRecommendations.filter(id => id !== recommendationId));
    }

    setSelectedRecommendation(null);
  };

  const undoSkill = (skillId: number) => {
    const skill = skills.find(s => s.id === skillId);
    if (!skill || !skill.completed) return;

    const newXp = Math.max(0, userProfile.xp - skill.xpValue);
    const newLevel = calculateLevel(newXp);
    const competencyDecrease = calculateCompetencyIncrease(skill.xpValue);

    setUserProfile({
      ...userProfile,
      xp: newXp,
      level: newLevel,
    });

    const newCompetencyStats = { ...competencyStats };
    skill.competencies.forEach(comp => {
      newCompetencyStats[comp] = Math.max(0, newCompetencyStats[comp] - competencyDecrease / skill.competencies.length);
    });
    setCompetencyStats(newCompetencyStats);

    setSkills(skills.map(s =>
      s.id === skillId
        ? {
            ...s,
            completed: false,
            dateCompleted: undefined,
            subtasks: s.subtasks.map(st => ({ ...st, completed: false })),
            progress: 0,
          }
        : s
    ));
  };

  const filteredOpportunities = opportunities.filter(
    (opp) =>
      opp.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      opp.company
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      opp.skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-20 left-20 w-[600px] h-[600px] opacity-30"
          style={{
            background:
              "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-20 right-20 w-[600px] h-[600px] opacity-30"
          style={{
            background:
              "radial-gradient(circle, #d946ef 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <Shield
                  className="w-12 h-12 text-primary"
                  strokeWidth={2}
                />
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent uppercase tracking-tight">
                    SKILL MATCHER
                  </h1>
                  <p className="text-muted-foreground mt-1 text-sm uppercase tracking-wider">
                    CCI Career Progression System
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="text-right cursor-pointer group"
                onClick={() => setIsProfileDialogOpen(true)}
              >
                <p className="text-xs text-muted-foreground uppercase tracking-wider group-hover:text-primary transition-colors">
                  Operator
                </p>
                <p className="text-xl font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                  {studentData.name}
                  <User className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
              </div>
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent flex items-center justify-center border-4 border-primary clip-corner-both">
                  <span className="text-3xl font-bold text-background">
                    {studentData.level}
                  </span>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-secondary text-background text-xs font-bold px-3 py-1 border-2 border-secondary">
                  LVL
                </div>
              </div>
            </div>
          </div>

          {/* XP Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Experience Points
              </span>
              <span className="text-sm font-bold text-primary font-mono">
                {Math.round(animatedXp)} / {studentData.nextLevelXp} XP
              </span>
            </div>
            <div className="relative h-4 bg-muted border-2 border-border overflow-hidden">
              <motion.div
                animate={{
                  width: `${(animatedXp / studentData.nextLevelXp) * 100}%`,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute h-full bg-gradient-to-r from-primary via-accent to-secondary"
                style={{ boxShadow: "0 0 20px var(--primary)" }}
              />
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 21px)",
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-card/80 backdrop-blur-sm border-2 border-border p-2 gap-2">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-primary data-[state=active]:text-background data-[state=active]:border-2 data-[state=active]:border-primary uppercase tracking-wider font-bold text-xs"
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="opportunities"
              className="data-[state=active]:bg-primary data-[state=active]:text-background data-[state=active]:border-2 data-[state=active]:border-primary uppercase tracking-wider font-bold text-xs"
            >
              <Search className="w-4 h-4 mr-2" />
              Opportunities
            </TabsTrigger>
            <TabsTrigger
              value="recommendations"
              className="data-[state=active]:bg-primary data-[state=active]:text-background data-[state=active]:border-2 data-[state=active]:border-primary uppercase tracking-wider font-bold text-xs"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Recommendations
            </TabsTrigger>
            <TabsTrigger
              value="notes"
              className="data-[state=active]:bg-primary data-[state=active]:text-background data-[state=active]:border-2 data-[state=active]:border-primary uppercase tracking-wider font-bold text-xs"
            >
              <StickyNote className="w-4 h-4 mr-2" />
              Notes
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Skills Mastered"
                value={studentData.skillsCompleted}
                icon={Award}
                color="#8b5cf6"
                delay={0}
              />
              <div onClick={() => setIsSkillsDialogOpen(true)} className="cursor-pointer">
                <StatsCard
                  title="Total Skills"
                  value={studentData.totalSkills}
                  icon={Target}
                  color="#c084fc"
                  delay={0.1}
                />
              </div>
              <StatsCard
                title="Match Score"
                value={`${studentData.matchScore}%`}
                icon={TrendingUp}
                color="#d946ef"
                delay={0.2}
              />
              <StatsCard
                title="Career Level"
                value={studentData.level}
                icon={Zap}
                color="#a78bca"
                delay={0.3}
              />
            </div>

            {/* Core Competencies & Pentagon */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Core Competency Progress */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-card p-6 border-2 border-border clip-corner"
              >
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3 uppercase tracking-wide">
                  <Target
                    className="w-6 h-6 text-primary"
                    strokeWidth={2.5}
                  />
                  Core Competencies
                </h2>
                <div className="space-y-5">
                  {coreCompetencyProgress.map((comp, index) => (
                    <ProgressBar
                      key={comp.skill}
                      skill={comp.skill}
                      current={comp.current}
                      required={comp.required}
                      delay={index * 0.1}
                    />
                  ))}
                </div>
              </motion.div>

              {/* 3D Pentagon */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-card p-6 border-2 border-border clip-corner"
              >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-3 uppercase tracking-wide">
                  <Shield
                    className="w-6 h-6 text-accent"
                    strokeWidth={2.5}
                  />
                  Core Competencies
                </h2>
                <div className="h-[400px]">
                  <Pentagon3D skills={pentagonData} />
                </div>
              </motion.div>
            </div>
          </TabsContent>

          {/* Opportunities Tab */}
          <TabsContent
            value="opportunities"
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="SEARCH OPPORTUNITIES..."
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(e.target.value)
                    }
                    className="pl-12 h-14 bg-card border-2 border-border uppercase tracking-wider font-semibold text-sm"
                  />
                </div>
                <Dialog
                  open={isAddOpportunityOpen}
                  onOpenChange={setIsAddOpportunityOpen}
                >
                  <Button
                    type="button"
                    onClick={() => {
                      setOpportunityError("");
                      setIsAddOpportunityOpen(true);
                    }}
                    className="h-14 px-8 bg-primary text-background hover:bg-primary/90 border-2 border-primary font-bold uppercase tracking-wider"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Custom
                  </Button>
                  <DialogContent className="border-2 border-border bg-card p-0 rounded-none clip-corner overflow-hidden">
                    <DialogHeader className="border-b-2 border-border px-6 py-5">
                      <DialogTitle className="text-2xl uppercase tracking-wide">
                        Add Custom Opportunity
                      </DialogTitle>
                      <DialogDescription className="text-muted-foreground uppercase tracking-wider text-xs">
                        Create a new role card and add it to the
                        opportunity feed.
                      </DialogDescription>
                    </DialogHeader>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        addOpportunity();
                      }}
                      className="space-y-4 px-6 py-5"
                    >
                      <Input
                        type="text"
                        placeholder="JOB TITLE"
                        value={newOpportunity.title}
                        onChange={(e) =>
                          setNewOpportunity({
                            ...newOpportunity,
                            title: e.target.value,
                          })
                        }
                        className="h-12 bg-background border-2 border-border uppercase tracking-wider font-semibold text-sm"
                      />
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Input
                          type="text"
                          placeholder="COMPANY"
                          value={newOpportunity.company}
                          onChange={(e) =>
                            setNewOpportunity({
                              ...newOpportunity,
                              company: e.target.value,
                            })
                          }
                          className="h-12 bg-background border-2 border-border uppercase tracking-wider font-semibold text-sm"
                        />
                        <Input
                          type="text"
                          placeholder="LOCATION"
                          value={newOpportunity.location}
                          onChange={(e) =>
                            setNewOpportunity({
                              ...newOpportunity,
                              location: e.target.value,
                            })
                          }
                          className="h-12 bg-background border-2 border-border uppercase tracking-wider font-semibold text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_140px]">
                        <Input
                          type="text"
                          placeholder="EMPLOYMENT TYPE"
                          value={newOpportunity.type}
                          onChange={(e) =>
                            setNewOpportunity({
                              ...newOpportunity,
                              type: e.target.value,
                            })
                          }
                          className="h-12 bg-background border-2 border-border uppercase tracking-wider font-semibold text-sm"
                        />
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="MATCH %"
                          value={newOpportunity.matchScore}
                          onChange={(e) =>
                            setNewOpportunity({
                              ...newOpportunity,
                              matchScore: e.target.value,
                            })
                          }
                          className="h-12 bg-background border-2 border-border uppercase tracking-wider font-semibold text-sm"
                        />
                      </div>
                      <Textarea
                        placeholder="SKILLS, SEPARATED BY COMMAS"
                        value={newOpportunity.skills}
                        onChange={(e) =>
                          setNewOpportunity({
                            ...newOpportunity,
                            skills: e.target.value,
                          })
                        }
                        className="min-h-24 bg-background border-2 border-border uppercase tracking-wider font-semibold text-sm resize-none"
                      />

                      {opportunityError && (
                        <p className="border-2 border-secondary bg-secondary/10 px-4 py-3 text-xs font-bold uppercase tracking-wider text-secondary">
                          {opportunityError}
                        </p>
                      )}

                      <DialogFooter className="pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setOpportunityError("");
                            setIsAddOpportunityOpen(false);
                          }}
                          className="border-2 border-border bg-transparent font-bold uppercase tracking-wider"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="border-2 border-primary bg-primary font-bold uppercase tracking-wider text-background hover:bg-primary/90"
                        >
                          Save Opportunity
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredOpportunities.map((opp, index) => (
                  <OpportunityCard
                    key={opp.id}
                    {...opp}
                    delay={index * 0.1}
                    onClick={() => setSelectedOpportunity(opp)}
                  />
                ))}
              </div>

              {filteredOpportunities.length === 0 && (
                <div className="text-center py-16 bg-card border-2 border-border clip-corner">
                  <Search
                    className="w-20 h-20 text-muted-foreground mx-auto mb-4 opacity-30"
                    strokeWidth={1.5}
                  />
                  <p className="text-muted-foreground uppercase tracking-wider font-semibold">
                    No opportunities found
                  </p>
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent
            value="recommendations"
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-r from-primary/30 via-accent/30 to-secondary/20 p-6 border-2 border-primary clip-corner">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-3 uppercase tracking-wide">
                  <Sparkles
                    className="w-6 h-6 text-primary"
                    strokeWidth={2.5}
                  />
                  AI-Powered Recommendations
                </h2>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">
                  Personalized actions to maximize career
                  potential
                </p>
              </div>

              {recommendations.map((rec, index) => {
                const isCompleted = isRecommendationCompleted(rec.id);
                const isStarted = isRecommendationStarted(rec.id);

                return (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                    }}
                    onClick={() => setSelectedRecommendation(rec)}
                    className={`bg-card p-6 border-2 transition-all cursor-pointer group clip-corner relative overflow-hidden ${
                      isCompleted
                        ? "border-secondary/50 opacity-75"
                        : isStarted
                        ? "border-primary"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    <div className={`absolute top-0 left-0 w-2 h-full ${
                      isCompleted
                        ? "bg-gradient-to-b from-secondary via-secondary to-secondary/50"
                        : "bg-gradient-to-b from-primary via-accent to-secondary"
                    }`} />
                    <div className="flex items-start justify-between ml-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {isCompleted && (
                            <div className="w-6 h-6 bg-secondary border-2 border-secondary flex items-center justify-center">
                              <Check className="w-4 h-4 text-background" strokeWidth={3} />
                            </div>
                          )}
                          <h3 className={`text-lg font-bold transition-colors uppercase tracking-wide ${
                            isCompleted ? "text-secondary line-through" : "text-foreground group-hover:text-primary"
                          }`}>
                            {rec.title}
                          </h3>
                          <span
                            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border-2 ${
                              rec.impact === "Critical"
                                ? "bg-secondary/20 text-secondary border-secondary"
                                : rec.impact === "High"
                                  ? "bg-primary/20 text-primary border-primary"
                                  : "bg-accent/20 text-accent border-accent"
                            }`}
                          >
                            {rec.impact}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {rec.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {rec.competencies.map((comp) => (
                            <span
                              key={comp}
                              className="px-2 py-1 text-xs font-bold uppercase tracking-wider bg-accent/20 text-accent border border-accent/30"
                            >
                              {comp}
                            </span>
                          ))}
                        </div>
                        {(isStarted || isCompleted) && (
                          <div className="mb-3">
                            <div className="relative h-2 bg-muted border border-border mb-1">
                              <div
                                className="absolute h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                                style={{ width: `${rec.progress}%` }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {rec.progress}% • {rec.subtasks.filter(st => st.completed).length}/{rec.subtasks.length} subtasks
                            </p>
                          </div>
                        )}
                        <div className="flex items-center gap-2 bg-primary/10 border-2 border-primary/30 px-3 py-2 w-fit">
                          <Zap className="w-5 h-5 text-primary" />
                          <span className="text-sm font-bold text-primary font-mono">
                            {isCompleted ? "Earned" : "+"}{rec.xpGain} XP
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {(isStarted || isCompleted) && (
                          <Button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRecommendationForSubtasks(rec);
                            }}
                            className="bg-accent text-background hover:bg-accent/90 border-2 border-accent font-bold uppercase tracking-wider px-6"
                          >
                            Subtasks
                          </Button>
                        )}
                        {!isCompleted && !isStarted && (
                          <Button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              startRecommendation(rec);
                            }}
                            className="bg-primary text-background hover:bg-primary/90 border-2 border-primary font-bold uppercase tracking-wider px-6"
                          >
                            Start
                          </Button>
                        )}
                        {isCompleted && (
                          <div className="bg-secondary/20 border-2 border-secondary px-6 py-2.5 font-bold uppercase tracking-wider text-secondary text-sm text-center">
                            Completed
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-card p-6 border-2 border-border clip-corner"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3 uppercase tracking-wide">
                <Plus
                  className="w-6 h-6 text-primary"
                  strokeWidth={2.5}
                />
                Add New Note
              </h2>
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="NOTE TITLE..."
                  value={newNote.title}
                  onChange={(e) => {
                    setNewNote({
                      ...newNote,
                      title: e.target.value,
                    });
                    if (noteError) {
                      setNoteError("");
                    }
                  }}
                  className="bg-input-background border-2 border-border h-12 uppercase tracking-wider font-semibold"
                />
                <Textarea
                  placeholder="WRITE YOUR INSIGHTS..."
                  value={newNote.content}
                  onChange={(e) => {
                    setNewNote({
                      ...newNote,
                      content: e.target.value,
                    });
                    if (noteError) {
                      setNoteError("");
                    }
                  }}
                  className="bg-input-background border-2 border-border min-h-32"
                />
                {noteError && (
                  <p className="border-2 border-secondary bg-secondary/10 px-4 py-3 text-xs font-bold uppercase tracking-wider text-secondary">
                    {noteError}
                  </p>
                )}
                <Button
                  onClick={addNote}
                  className="w-full h-12 bg-primary text-background hover:bg-primary/90 border-2 border-primary font-bold uppercase tracking-wider"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Note
                </Button>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {notes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  onClick={() => setSelectedNote(note)}
                  className="bg-card p-6 border-2 border-border hover:border-accent transition-all cursor-pointer group clip-corner relative"
                >
                  <div
                    className="absolute top-0 right-0 w-16 h-16 opacity-10"
                    style={{
                      background:
                        "linear-gradient(135deg, #d946ef 0%, transparent 70%)",
                      clipPath:
                        "polygon(100% 0, 100% 100%, 0 0)",
                    }}
                  />
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors uppercase tracking-wide">
                      {note.title}
                    </h3>
                    <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 border border-border">
                      {note.date}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {note.content}
                  </p>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog
        open={selectedOpportunity !== null}
        onOpenChange={(open) =>
          !open && setSelectedOpportunity(null)
        }
      >
        <DialogContent className="border-2 border-border bg-card p-0 rounded-none clip-corner overflow-hidden">
          {selectedOpportunity && (
            <>
              <DialogHeader className="border-b-2 border-border px-6 py-5">
                <DialogTitle className="text-2xl uppercase tracking-wide">
                  {selectedOpportunity.title}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground uppercase tracking-wider text-xs">
                  {selectedOpportunity.company} •{" "}
                  {selectedOpportunity.location} •{" "}
                  {selectedOpportunity.type}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-5 px-6 py-5">
                <div className="flex items-center justify-between border-2 border-primary/30 bg-primary/10 px-4 py-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Match Score
                  </span>
                  <span className="text-lg font-bold font-mono text-primary">
                    {selectedOpportunity.matchScore}%
                  </span>
                </div>
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Required Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedOpportunity.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-accent/10 text-accent border-2 border-accent/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={selectedNote !== null}
        onOpenChange={(open) => !open && setSelectedNote(null)}
      >
        <DialogContent className="border-2 border-border bg-card p-0 rounded-none clip-corner overflow-hidden">
          {selectedNote && (
            <>
              <DialogHeader className="border-b-2 border-border px-6 py-5">
                <DialogTitle className="text-2xl uppercase tracking-wide">
                  {selectedNote.title}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground uppercase tracking-wider text-xs">
                  Saved on {selectedNote.date}
                </DialogDescription>
              </DialogHeader>
              <div className="px-6 py-5">
                <p className="text-sm leading-relaxed text-foreground">
                  {selectedNote.content}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={selectedRecommendation !== null}
        onOpenChange={(open) =>
          !open && setSelectedRecommendation(null)
        }
      >
        <DialogContent className="border-2 border-border bg-card p-0 rounded-none clip-corner overflow-hidden">
          {selectedRecommendation && (
            <>
              <DialogHeader className="border-b-2 border-border px-6 py-5">
                <DialogTitle className="text-2xl uppercase tracking-wide">
                  {selectedRecommendation.title}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground uppercase tracking-wider text-xs">
                  {selectedRecommendation.impact} impact • +
                  {selectedRecommendation.xpGain} XP
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-5 px-6 py-5">
                <p className="text-sm leading-relaxed text-foreground">
                  {selectedRecommendation.description}
                </p>
                <div className="border-2 border-primary/30 bg-primary/10 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {isRecommendationCompleted(selectedRecommendation.id)
                      ? "This recommendation has been completed!"
                      : isRecommendationStarted(selectedRecommendation.id)
                      ? "This recommendation is in progress. Complete it to gain XP."
                      : "Start this recommendation to track it as an active objective."}
                  </p>
                </div>
                <DialogFooter className="gap-2">
                  {(isRecommendationStarted(selectedRecommendation.id) || isRecommendationCompleted(selectedRecommendation.id)) && (
                    <Button
                      type="button"
                      onClick={() => {
                        setSelectedRecommendationForSubtasks(selectedRecommendation);
                        setSelectedRecommendation(null);
                      }}
                      className="border-2 border-accent bg-accent font-bold uppercase tracking-wider text-background hover:bg-accent/90"
                    >
                      View Subtasks
                    </Button>
                  )}
                  {isRecommendationStarted(selectedRecommendation.id) && (
                    <Button
                      type="button"
                      onClick={() => undoRecommendation(selectedRecommendation.id)}
                      className="border-2 border-muted bg-muted font-bold uppercase tracking-wider text-foreground hover:bg-muted/80"
                    >
                      {isRecommendationCompleted(selectedRecommendation.id) ? "Undo" : "Cancel"}
                    </Button>
                  )}
                  {!isRecommendationStarted(selectedRecommendation.id) && !isRecommendationCompleted(selectedRecommendation.id) && (
                    <Button
                      type="button"
                      onClick={() => startRecommendation(selectedRecommendation)}
                      className="border-2 border-primary bg-primary font-bold uppercase tracking-wider text-background hover:bg-primary/90"
                    >
                      Start Recommendation
                    </Button>
                  )}
                </DialogFooter>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={isSkillsDialogOpen}
        onOpenChange={setIsSkillsDialogOpen}
      >
        <DialogContent className="border-2 border-border bg-card p-0 rounded-none clip-corner overflow-hidden max-w-3xl max-h-[80vh] flex flex-col">
          <DialogHeader className="border-b-2 border-border px-6 py-5">
            <DialogTitle className="text-2xl uppercase tracking-wide flex items-center gap-3">
              <Target className="w-6 h-6 text-primary" />
              Skill Management
            </DialogTitle>
            <DialogDescription className="text-muted-foreground uppercase tracking-wider text-xs">
              View all skills and add new ones to track your progress
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-5 space-y-4 flex-1 overflow-y-auto">
            <div className="bg-background border-2 border-border p-4 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Add New Skill</h3>
              <div className="flex gap-3">
                <Input
                  type="text"
                  placeholder="SKILL NAME..."
                  value={newSkillName}
                  onChange={(e) => {
                    setNewSkillName(e.target.value);
                    setNewSkillError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addSkill();
                    }
                  }}
                  className="h-12 bg-card border-2 border-border uppercase tracking-wider font-semibold text-sm flex-1"
                />
                <Button
                  onClick={addSkill}
                  className="h-12 px-6 bg-primary text-background hover:bg-primary/90 border-2 border-primary font-bold uppercase tracking-wider"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add
                </Button>
              </div>
              {newSkillName && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground bg-primary/10 border border-primary/30 px-3 py-2">
                    AI suggests {suggestXpForSkill(newSkillName)} XP for "{newSkillName}"
                  </p>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Select Competencies
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(["Frontend", "Backend", "Design", "Leadership", "Teamwork"] as Competency[]).map((comp) => (
                        <button
                          key={comp}
                          type="button"
                          onClick={() => {
                            if (selectedCompetencies.includes(comp)) {
                              setSelectedCompetencies(selectedCompetencies.filter(c => c !== comp));
                            } else {
                              setSelectedCompetencies([...selectedCompetencies, comp]);
                            }
                          }}
                          className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border-2 transition-all ${
                            selectedCompetencies.includes(comp)
                              ? "bg-primary text-background border-primary"
                              : "bg-card text-muted-foreground border-border hover:border-primary"
                          }`}
                        >
                          {comp}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {newSkillError && (
                <p className="border-2 border-secondary bg-secondary/10 px-4 py-3 text-xs font-bold uppercase tracking-wider text-secondary">
                  {newSkillError}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                All Skills ({skills.length})
              </h3>
              <div className="space-y-2">
                {skills.map((skill) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 border-2 transition-all ${
                      skill.completed
                        ? "bg-primary/10 border-primary/30"
                        : "bg-card border-border hover:border-accent"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-6 h-6 border-2 flex items-center justify-center ${
                          skill.completed
                            ? "bg-primary border-primary"
                            : "border-border"
                        }`}>
                          {skill.completed && <Check className="w-4 h-4 text-background" strokeWidth={3} />}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-bold uppercase tracking-wide ${
                            skill.completed ? "text-primary" : "text-foreground"
                          }`}>
                            {skill.name}
                          </h4>
                          <p className="text-xs text-muted-foreground font-mono mb-2">
                            Added: {skill.dateAdded}
                            {skill.dateCompleted && ` • Completed: ${skill.dateCompleted}`}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {skill.competencies.map((comp) => (
                              <span
                                key={comp}
                                className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider bg-accent/20 text-accent border border-accent/30"
                              >
                                {comp}
                              </span>
                            ))}
                          </div>
                          <div className="relative h-2 bg-muted border border-border">
                            <div
                              className="absolute h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                              style={{ width: `${skill.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Progress: {skill.progress}% • {skill.subtasks.filter(st => st.completed).length}/{skill.subtasks.length} subtasks
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 border-2 border-primary/30 px-3 py-1.5">
                          <span className="text-sm font-bold text-primary font-mono">
                            {skill.xpValue} XP
                          </span>
                        </div>
                        <Button
                          onClick={() => setSelectedSkillForSubtasks(skill)}
                          className="h-9 px-4 bg-accent text-background hover:bg-accent/90 border-2 border-accent font-bold uppercase tracking-wider text-xs"
                        >
                          Subtasks
                        </Button>
                        {skill.completed && (
                          <Button
                            onClick={() => undoSkill(skill.id)}
                            className="h-9 px-4 bg-muted text-foreground hover:bg-muted/80 border-2 border-border font-bold uppercase tracking-wider text-xs"
                          >
                            Undo
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isProfileDialogOpen}
        onOpenChange={setIsProfileDialogOpen}
      >
        <DialogContent className="border-2 border-border bg-card p-0 rounded-none clip-corner overflow-hidden">
          <DialogHeader className="border-b-2 border-border px-6 py-5">
            <DialogTitle className="text-2xl uppercase tracking-wide flex items-center gap-3">
              <User className="w-6 h-6 text-primary" />
              Edit Profile
            </DialogTitle>
            <DialogDescription className="text-muted-foreground uppercase tracking-wider text-xs">
              Update your operator information
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-5 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                Operator Name
              </label>
              <Input
                type="text"
                value={userProfile.name}
                onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                className="h-12 bg-background border-2 border-border uppercase tracking-wider font-semibold text-sm"
              />
            </div>
            <div className="bg-primary/10 border-2 border-primary/30 px-4 py-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Level</span>
                <span className="text-lg font-bold font-mono text-primary">{userProfile.level}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Experience</span>
                <span className="text-lg font-bold font-mono text-primary">{userProfile.xp} XP</span>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => setIsProfileDialogOpen(false)}
                className="border-2 border-primary bg-primary font-bold uppercase tracking-wider text-background hover:bg-primary/90"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={selectedSkillForSubtasks !== null}
        onOpenChange={(open) => !open && setSelectedSkillForSubtasks(null)}
      >
        <DialogContent className="border-2 border-border bg-card p-0 rounded-none clip-corner overflow-hidden max-w-2xl">
          {selectedSkillForSubtasks && (
            <>
              <DialogHeader className="border-b-2 border-border px-6 py-5">
                <DialogTitle className="text-2xl uppercase tracking-wide">
                  {selectedSkillForSubtasks.name}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground uppercase tracking-wider text-xs">
                  Progress: {selectedSkillForSubtasks.progress}% • {selectedSkillForSubtasks.xpValue} XP
                </DialogDescription>
              </DialogHeader>
              <div className="px-6 py-5 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {selectedSkillForSubtasks.competencies.map((comp) => (
                    <span
                      key={comp}
                      className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-accent/20 text-accent border-2 border-accent/30"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
                <div className="relative h-3 bg-muted border-2 border-border">
                  <div
                    className="absolute h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                    style={{ width: `${selectedSkillForSubtasks.progress}%` }}
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Subtasks ({selectedSkillForSubtasks.subtasks.filter(st => st.completed).length}/{selectedSkillForSubtasks.subtasks.length})
                  </h3>
                  {selectedSkillForSubtasks.subtasks.map((subtask) => (
                    <div
                      key={subtask.id}
                      onClick={() => toggleSubtaskForSkill(selectedSkillForSubtasks.id, subtask.id)}
                      className={`p-4 border-2 cursor-pointer transition-all ${
                        subtask.completed
                          ? "bg-primary/10 border-primary/30"
                          : "bg-background border-border hover:border-accent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 border-2 flex items-center justify-center ${
                          subtask.completed
                            ? "bg-primary border-primary"
                            : "border-border"
                        }`}>
                          {subtask.completed && <Check className="w-4 h-4 text-background" strokeWidth={3} />}
                        </div>
                        <span className={`text-sm font-semibold ${
                          subtask.completed ? "text-primary line-through" : "text-foreground"
                        }`}>
                          {subtask.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-primary/10 border-2 border-primary/30 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {selectedSkillForSubtasks.completed
                      ? "This skill has been completed! Undo to reset progress."
                      : `Complete all subtasks to gain ${selectedSkillForSubtasks.xpValue} XP`}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={selectedRecommendationForSubtasks !== null}
        onOpenChange={(open) => !open && setSelectedRecommendationForSubtasks(null)}
      >
        <DialogContent className="border-2 border-border bg-card p-0 rounded-none clip-corner overflow-hidden max-w-2xl">
          {selectedRecommendationForSubtasks && (
            <>
              <DialogHeader className="border-b-2 border-border px-6 py-5">
                <DialogTitle className="text-2xl uppercase tracking-wide">
                  {selectedRecommendationForSubtasks.title}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground uppercase tracking-wider text-xs">
                  Progress: {selectedRecommendationForSubtasks.progress}% • {selectedRecommendationForSubtasks.xpGain} XP
                </DialogDescription>
              </DialogHeader>
              <div className="px-6 py-5 space-y-4">
                <p className="text-sm text-muted-foreground">{selectedRecommendationForSubtasks.description}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedRecommendationForSubtasks.competencies.map((comp) => (
                    <span
                      key={comp}
                      className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-accent/20 text-accent border-2 border-accent/30"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
                <div className="relative h-3 bg-muted border-2 border-border">
                  <div
                    className="absolute h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                    style={{ width: `${selectedRecommendationForSubtasks.progress}%` }}
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Subtasks ({selectedRecommendationForSubtasks.subtasks.filter(st => st.completed).length}/{selectedRecommendationForSubtasks.subtasks.length})
                  </h3>
                  {selectedRecommendationForSubtasks.subtasks.map((subtask) => (
                    <div
                      key={subtask.id}
                      onClick={() => toggleSubtaskForRecommendation(selectedRecommendationForSubtasks.id, subtask.id)}
                      className={`p-4 border-2 cursor-pointer transition-all ${
                        subtask.completed
                          ? "bg-primary/10 border-primary/30"
                          : "bg-background border-border hover:border-accent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 border-2 flex items-center justify-center ${
                          subtask.completed
                            ? "bg-primary border-primary"
                            : "border-border"
                        }`}>
                          {subtask.completed && <Check className="w-4 h-4 text-background" strokeWidth={3} />}
                        </div>
                        <span className={`text-sm font-semibold ${
                          subtask.completed ? "text-primary line-through" : "text-foreground"
                        }`}>
                          {subtask.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <DialogFooter className="gap-2">
                  {isRecommendationStarted(selectedRecommendationForSubtasks.id) && (
                    <Button
                      onClick={() => undoRecommendation(selectedRecommendationForSubtasks.id)}
                      className="border-2 border-muted bg-muted font-bold uppercase tracking-wider text-foreground hover:bg-muted/80"
                    >
                      {isRecommendationCompleted(selectedRecommendationForSubtasks.id) ? "Undo Completion" : "Cancel Progress"}
                    </Button>
                  )}
                  {!isRecommendationStarted(selectedRecommendationForSubtasks.id) && (
                    <Button
                      onClick={() => startRecommendation(selectedRecommendationForSubtasks)}
                      className="border-2 border-primary bg-primary font-bold uppercase tracking-wider text-background hover:bg-primary/90"
                    >
                      Start Recommendation
                    </Button>
                  )}
                </DialogFooter>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {levelUpNotification !== null && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <div className="bg-gradient-to-br from-primary via-accent to-secondary p-1 clip-corner">
              <div className="bg-background p-6 clip-corner relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse" />
                <div className="relative z-10">
                  <button
                    onClick={() => setLevelUpNotification(null)}
                    className="absolute top-0 right-0 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent flex items-center justify-center border-4 border-primary">
                      <span className="text-3xl font-bold text-background">
                        {levelUpNotification}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold uppercase tracking-wide bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Level Up!
                      </h3>
                      <p className="text-sm text-muted-foreground uppercase tracking-wider">
                        You've reached level {levelUpNotification}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}