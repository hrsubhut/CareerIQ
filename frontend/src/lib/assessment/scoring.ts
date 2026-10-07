export interface AssessmentResult {
  overallScore: number;
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
  skillScores: Record<string, number>;
  difficultyScores: Record<string, number>;
  strongSkills: string[];
  weakSkills: string[];
}

export function evaluateAssessment(questions: any[], answers: Record<number, number>): AssessmentResult {
  let correct = 0;
  const skillStats: Record<string, { c: number; t: number }> = {};
  const diffStats: Record<string, { c: number; t: number }> = {};

  questions.forEach((q, idx) => {
    const isCorrect = answers[idx] === q.correctAnswer;
    if (isCorrect) correct++;

    if (!skillStats[q.skill]) skillStats[q.skill] = { c: 0, t: 0 };
    skillStats[q.skill].t++;
    if (isCorrect) skillStats[q.skill].c++;

    if (!diffStats[q.difficulty]) diffStats[q.difficulty] = { c: 0, t: 0 };
    diffStats[q.difficulty].t++;
    if (isCorrect) diffStats[q.difficulty].c++;
  });

  const skillScores: Record<string, number> = {};
  const weakSkills: string[] = [];
  const strongSkills: string[] = [];

  Object.keys(skillStats).forEach(s => {
    const score = Math.round((skillStats[s].c / skillStats[s].t) * 100);
    skillScores[s] = score;
    if (score >= 80) strongSkills.push(s);
    else weakSkills.push(s);
  });

  const difficultyScores: Record<string, number> = {};
  Object.keys(diffStats).forEach(d => {
    difficultyScores[d] = Math.round((diffStats[d].c / diffStats[d].t) * 100);
  });

  return {
    overallScore: Math.round((correct / questions.length) * 100),
    correctAnswers: correct,
    totalQuestions: questions.length,
    accuracy: Math.round((correct / questions.length) * 100),
    skillScores,
    difficultyScores,
    strongSkills,
    weakSkills
  };
}
