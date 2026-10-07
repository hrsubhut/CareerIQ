export interface AssessmentQuestion {
  id: string;
  skill: string;
  difficulty: 'basic' | 'medium' | 'hard';
  type: 'mcq' | 'code' | 'scenario';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  concept: string;
}

const ROLE_SKILLS: Record<string, string[]> = {
  'Data Scientist': ['Python', 'SQL', 'Statistics', 'Machine Learning', 'Pandas', 'Data Analysis'],
  'Frontend Developer': ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Performance'],
  'Backend Developer': ['APIs', 'Databases', 'Node.js', 'Python', 'System Design', 'Auth'],
  'ML Engineer': ['Python', 'Machine Learning', 'Deep Learning', 'Docker', 'MLOps', 'Deployment']
};

export function getMockQuestions(role: string): AssessmentQuestion[] {
  const skills = ROLE_SKILLS[role] || ROLE_SKILLS['Data Scientist'];
  const questions: AssessmentQuestion[] = [];
  
  // Generate exactly 30 questions
  for (let i = 0; i < 30; i++) {
    const skill = skills[i % skills.length];
    
    let difficulty: 'basic' | 'medium' | 'hard' = 'medium';
    if (i < 10) difficulty = 'basic';
    else if (i > 22) difficulty = 'hard';

    questions.push({
      id: `q_${i}`,
      skill,
      difficulty,
      type: 'mcq',
      question: `This is a realistic mock question about ${skill} for a ${role}. What is the correct approach to handle X?`,
      options: [
        `Use approach A which is common in ${skill}`,
        `Use approach B which is optimal`,
        `Use approach C which is outdated`,
        `Use approach D which causes errors`
      ],
      correctAnswer: 1, // B is correct
      explanation: `Approach B is optimal because it leverages core ${skill} principles efficiently.`,
      concept: `${skill} Fundamentals`
    });
  }

  return questions;
}
