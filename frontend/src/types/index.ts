export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface UserSkill {
  name: string;
  level: ProficiencyLevel;
  verified?: boolean;
  yearsOfExperience?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  currentRole: string;
  targetRole: string;
  yearsOfExperience: number;
  education: string;
  location: string;
  careerReadiness: number; // e.g. 72%
  profileStrength: number; // e.g. 84%
  matchingCareersCount: number;
  criticalSkillGapsCount: number;
  marketOpportunity: 'High' | 'Medium' | 'Emerging';
  careerInterests: string[];
  skills: UserSkill[];
  lastUpdated: string;
}

export interface CareerRecommendation {
  id: string;
  role: string;
  match_score: number;
  readiness_score: number;
  opportunity_score: number;
  demand: 'High' | 'Medium' | 'Very High' | 'Moderate';
  salary_range: string;
  avg_salary: number;
  required_experience: string;
  key_skills: string[];
  required_skills: { name: string; importance: 'High' | 'Medium' | 'Low' }[];
  current_skills: string[];
  skill_gaps: { name: string; severity: 'Critical' | 'Important' | 'Optional' }[];
  reasons: string[];
  missing_skills: string[];
  next_action: string;
  confidence: 'High' | 'Medium' | 'Low';
  transition_effort: 'Low' | 'Manageable' | 'Substantial';
  analyzed_postings: number;
  pathway_stage?: 'Ready Now' | 'Near-Term' | 'Long-Term' | 'Large Gap';
}

export interface SkillGapItem {
  skill: string;
  yourLevel: ProficiencyLevel;
  requiredLevel: ProficiencyLevel;
  gapStatus: 'None' | 'Minor' | 'Medium' | 'Large';
  importance: 'High' | 'Medium' | 'Low';
  careerImpact: number; // 1-100
  learningEffortWeeks: number;
}

export interface SkillGapAnalysis {
  targetRole: string;
  overallGapScore: number;
  skills: SkillGapItem[];
  prioritySkills: {
    rank: number;
    skill: string;
    gap: string;
    importance: 'High' | 'Medium';
    reason: string;
  }[];
}

export interface MarketOverview {
  totalJobsAnalyzed: number;
  averageSalary: string;
  topRole: string;
  topSkill: string;
  topLocation: string;
  dataPeriod: string;
  datasetName: string;
  recordsAnalyzed: {
    analyticsJobs: number;
    dataScienceJobs: number;
  };
  lastUpdated: string;
}

export interface JobDemandRole {
  role: string;
  jobCount: number;
  avgSalaryK: number;
  growthYoY: string;
}

export interface SalaryRolePoint {
  role: string;
  p25: number;
  median: number;
  p75: number;
}

export interface SalaryExpPoint {
  yearsExp: number;
  salaryK: number;
  role: string;
}

export interface LocationDemandPoint {
  location: string;
  count: number;
  remotePct: number;
}

export interface ExperienceDistPoint {
  bracket: string;
  percentage: number;
}

export interface JobTypeDistPoint {
  type: string;
  count: number;
  percentage: number;
}

export interface MarketChartData {
  demandByRole: JobDemandRole[];
  salaryByRole: SalaryRolePoint[];
  salaryVsExperience: SalaryExpPoint[];
  demandByLocation: LocationDemandPoint[];
  experienceRequirements: ExperienceDistPoint[];
  jobTypeDistribution: JobTypeDistPoint[];
  insights: {
    roleDemand: string;
    salary: string;
    experience: string;
    location: string;
  };
}

export interface SkillLeaderboardItem {
  name: string;
  demandPercentage: number;
  roleDiversity: number; // 0-100
  avgSalaryAssociation: string;
  experienceRequirement: string;
  opportunityScore: number;
  category: 'Languages' | 'ML/AI' | 'Analytics' | 'Engineering' | 'Visualization';
  relatedSkills: string[];
  rolesRequiring: string[];
  learningPriority: 'High' | 'Medium' | 'Standard';
}

export interface SkillRoleMatrix {
  roles: string[];
  skills: {
    skill: string;
    levels: Record<string, 'High' | 'Medium' | 'Low' | 'None'>;
  }[];
}

export interface OpportunityScoreBreakdown {
  overallScore: number;
  roleCompatibility: number;
  marketDemand: number;
  careerGrowth: number;
  compensation: number;
  roleDiversity: number;
  transitionEffort: number;
  methodologyNote: string;
}

export interface JdsModelResult {
  predictedOutcome: 'High' | 'Moderate' | 'Low';
  probability: number;
  modelName: string;
  sampleRecords: number;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  };
  featureImportance: {
    feature: string;
    importance: number;
    description: string;
  }[];
  disclaimer: string;
}

export interface SdsWorkStyleResult {
  title: string;
  sampleRecords: number;
  dimensions: {
    dimension: string;
    score: number;
    benchmarkAverage: number;
    observedAssociation: string;
  }[];
  disclaimer: string;
}

export interface LearningRoadmapWeek {
  weekRange: string;
  title: string;
  skills: {
    name: string;
    whyNeeded: string;
    currentLevel: string;
    targetLevel: string;
    resources: string[];
    practiceProject: string;
    status: 'Not Started' | 'In Progress' | 'Completed' | 'Verified';
  }[];
}

export interface AssessmentItem {
  id: string;
  title: string;
  skill: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTimeMin: number;
  attempts: number;
  bestScore?: number;
  status: 'Available' | 'Completed' | 'In Progress';
  verificationBadge: string;
  feedback?: {
    score: number;
    skillLevel: string;
    strengths: string[];
    weaknesses: string[];
    recommendedAction: string;
  };
}

export interface MockInterviewStage {
  id: number;
  name: string;
  question: string;
  focus: string;
}

export interface ApplicationTrackerItem {
  id: string;
  company: string;
  role: string;
  stage: 'Recommended' | 'Saved' | 'Applied' | 'Interview' | 'Rejected' | 'Offer';
  matchScore: number;
  location: string;
  salary: string;
  appliedDate?: string;
}
