import companiesData from '../../mock/companies.json';
import { AssessmentResult } from '../assessment/scoring';

export interface Company {
  id: string;
  name: string;
  industry: string;
  logo: string;
  careerPageUrl: string;
  supportedRoles: string[];
  locations: string[];
}

export interface JobMatch {
  company: Company;
  role: string;
  careerIQMatch: number;
  skillMatch: number;
  assessmentMatch: number;
  experienceMatch: number;
  locationMatch: boolean;
  matchedSkills: string[];
  missingSkills: string[];
  whyMatch: string;
  improve: string;
}

const ROLE_REQUIRED_SKILLS: Record<string, string[]> = {
  'Data Scientist':       ['Python', 'SQL', 'Machine Learning', 'Statistics', 'Pandas', 'Data Analysis'],
  'Data Analyst':         ['SQL', 'Excel', 'Python', 'Power BI', 'Statistics', 'Data Visualization'],
  'ML Engineer':          ['Python', 'Machine Learning', 'Deep Learning', 'Docker', 'MLOps', 'Deployment'],
  'Software Engineer':    ['Algorithms', 'Data Structures', 'System Design', 'Python', 'Java', 'SQL'],
  'Frontend Developer':   ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Performance'],
  'Backend Developer':    ['Node.js', 'Python', 'SQL', 'APIs', 'System Design', 'Authentication'],
  'Full Stack Developer': ['React', 'Node.js', 'SQL', 'TypeScript', 'APIs', 'System Design'],
};

export function computeMatches(
  userSkills: string[],
  targetRole: string,
  yearsExp: number,
  assessmentResult: AssessmentResult | null
): JobMatch[] {
  const requiredSkills = ROLE_REQUIRED_SKILLS[targetRole] || ROLE_REQUIRED_SKILLS['Data Scientist'];
  const userSkillsNorm = userSkills.map(s => s.toLowerCase());

  const matchedSkills = requiredSkills.filter(req =>
    userSkillsNorm.some(us => us.includes(req.toLowerCase()) || req.toLowerCase().includes(us))
  );
  const missingSkills = requiredSkills.filter(req =>
    !userSkillsNorm.some(us => us.includes(req.toLowerCase()) || req.toLowerCase().includes(us))
  );

  const skillMatch = Math.round((matchedSkills.length / requiredSkills.length) * 100);

  // Assessment match: use overall score if available, else derive from skillMatch
  const assessmentMatch = assessmentResult
    ? assessmentResult.overallScore
    : Math.max(50, skillMatch - 10);

  // Experience match: baseline using years, cap at 100
  const experienceMatch = Math.min(100, 50 + yearsExp * 8);

  const companies = (companiesData as Company[]).filter(c =>
    c.supportedRoles.some(r => r.toLowerCase() === targetRole.toLowerCase())
  );

  return companies.map(company => {
    // Slight variance per company so cards feel distinct
    const variance = (company.id.charCodeAt(company.id.length - 1) % 10) - 5;
    const careerIQMatch = Math.min(99, Math.max(40, Math.round(
      skillMatch * 0.45 + assessmentMatch * 0.35 + experienceMatch * 0.2 + variance
    )));

    const topSkill = matchedSkills[0] || 'your technical background';
    const topGap = missingSkills[0] || null;

    const whyMatch = `Your ${topSkill} skills strongly align with this ${targetRole} role at ${company.name}.${
      matchedSkills.length > 1 ? ` You also match on ${matchedSkills.slice(1, 3).join(' and ')}.` : ''
    }`;
    const improve = topGap
      ? `Focus on strengthening ${topGap} before applying. ${missingSkills.length > 1 ? `${missingSkills.slice(1, 3).join(' and ')} are also worth reviewing.` : ''}`
      : `Your profile is well-rounded. Consider building a portfolio project to stand out.`;

    return {
      company,
      role: targetRole,
      careerIQMatch,
      skillMatch,
      assessmentMatch,
      experienceMatch,
      locationMatch: company.locations.some(l => l.toLowerCase().includes('remote')),
      matchedSkills: matchedSkills.slice(0, 4),
      missingSkills: missingSkills.slice(0, 3),
      whyMatch,
      improve,
    };
  }).sort((a, b) => b.careerIQMatch - a.careerIQMatch);
}
