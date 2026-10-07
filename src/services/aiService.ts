/**
 * CareerIQ — AI Service
 *
 * All AI API calls are isolated here.
 * The API key comes from environment variables ONLY — never hardcoded.
 * For production: replace direct browser calls with a backend proxy.
 *
 * Used ONLY for:
 *  - Mock Test question generation
 *  - Mock Test evaluation
 *  - Mock Interview question generation
 *  - Mock Interview evaluation
 *  - Learning path generation
 *  - CareerIQ Assistant chatbot
 */

const AI_API_KEY = import.meta.env.VITE_AI_API_KEY ?? '';
const AI_API_URL = import.meta.env.VITE_AI_API_URL ?? 'https://api.groq.com/openai/v1';
const AI_MODEL = import.meta.env.VITE_AI_MODEL ?? 'gpt-oss-120b';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MCQQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'basic' | 'medium' | 'hard';
  skill: string;
  explanation: string;
}

export interface MockTestResult {
  totalScore: number;
  basicScore: { correct: number; total: number };
  mediumScore: { correct: number; total: number };
  hardScore: { correct: number; total: number };
  skillScores: Record<string, { correct: number; total: number }>;
  weakSkills: string[];
  strongSkills: string[];
}

export interface InterviewQuestion {
  id: number;
  question: string;
  domain: string;
  difficulty: string;
  followUp?: string;
}

export interface InterviewAnswer {
  questionId: number;
  question: string;
  domain: string;
  answer: string;
}

export interface InterviewEvaluation {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  strengths: string[];
  weaknesses: string[];
  skillScores: Record<string, number>;
  detailedFeedback: string;
  improvementPlan: { skill: string; steps: string[] }[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface LearningPathItem {
  topic: string;
  difficulty: string;
  estimatedHours: number;
  whyImportant: string;
}

// ─── Core fetch helper ────────────────────────────────────────────────────────

async function chatCompletion(
  messages: { role: string; content: string }[],
  options: { temperature?: number; max_tokens?: number } = {}
): Promise<string> {
  if (!AI_API_KEY) {
    throw new Error('AI_API_KEY not configured. Add VITE_AI_API_KEY to your .env file.');
  }

  const res = await fetch(`${AI_API_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages,
      temperature: options.temperature ?? 0.4,
      max_tokens: options.max_tokens ?? 4096,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`AI API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

function parseJSON<T>(raw: string): T {
  try {
    return JSON.parse(raw) as T;
  } catch (e) {
    // If direct parse fails, try to extract JSON array or object
    const match = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      return JSON.parse(match[1]) as T;
    }
    // Fallback: try finding first [ or { and last ] or }
    const firstBracket = raw.indexOf('[');
    const lastBracket = raw.lastIndexOf(']');
    const firstBrace = raw.indexOf('{');
    const lastBrace = raw.lastIndexOf('}');
    
    let jsonStr = raw;
    if (firstBracket !== -1 && lastBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
      jsonStr = raw.substring(firstBracket, lastBracket + 1);
    } else if (firstBrace !== -1 && lastBrace !== -1) {
      jsonStr = raw.substring(firstBrace, lastBrace + 1);
    }
    return JSON.parse(jsonStr) as T;
  }
}

// ─── 1. Generate Mock Test Questions ─────────────────────────────────────────

export async function generateMockTest(
  jobRole: string,
  skills: string[]
): Promise<MCQQuestion[]> {
  const skillList = skills.join(', ');
  const prompt = `You are a senior technical assessor for ${jobRole} positions.

Generate exactly 30 multiple-choice questions to assess a candidate for the role of ${jobRole}.
Focus on these skills: ${skillList}.

Structure:
- Questions 1-10: BASIC difficulty
- Questions 11-20: MEDIUM difficulty  
- Questions 21-30: HARD difficulty

Return ONLY a valid JSON array of 30 objects in this exact format:
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 0,
    "difficulty": "basic",
    "skill": "${skills[0] || 'General'}",
    "explanation": "Short explanation of why this answer is correct."
  }
]

Rules:
- correctAnswer is the 0-based index of the correct option
- Mix the skills across questions (don't cluster all SQL together)
- Questions must be specific to ${jobRole}
- No general trivia — only role-relevant technical content
- Hard questions should test application/analysis, not just recall
- Return ONLY the JSON array, no markdown, no preamble`;

  const raw = await chatCompletion([{ role: 'user', content: prompt }], {
    temperature: 0.5,
    max_tokens: 6000,
  });

  return parseJSON<MCQQuestion[]>(raw);
}

// ─── 2. Evaluate Mock Test ────────────────────────────────────────────────────

export async function evaluateMockTest(
  jobRole: string,
  questions: MCQQuestion[],
  userAnswers: Record<number, number>
): Promise<MockTestResult> {
  // Calculate scores deterministically — no AI needed for the math
  const basicQs = questions.filter(q => q.difficulty === 'basic');
  const mediumQs = questions.filter(q => q.difficulty === 'medium');
  const hardQs = questions.filter(q => q.difficulty === 'hard');

  const skillMap: Record<string, { correct: number; total: number }> = {};
  let totalCorrect = 0;

  let basicCorrect = 0, basicTotal = 0;
  let mediumCorrect = 0, mediumTotal = 0;
  let hardCorrect = 0, hardTotal = 0;

  questions.forEach((q, idx) => {
    const userAns = userAnswers[idx];
    const correct = userAns === q.correctAnswer;
    if (correct) totalCorrect++;

    if (!skillMap[q.skill]) skillMap[q.skill] = { correct: 0, total: 0 };
    skillMap[q.skill].total++;
    if (correct) skillMap[q.skill].correct++;
    
    if (q.difficulty === 'basic') {
      basicTotal++;
      if (correct) basicCorrect++;
    } else if (q.difficulty === 'medium') {
      mediumTotal++;
      if (correct) mediumCorrect++;
    } else if (q.difficulty === 'hard') {
      hardTotal++;
      if (correct) hardCorrect++;
    }
  });

  const weakSkills = Object.entries(skillMap)
    .filter(([, v]) => (v.correct / v.total) < 0.6)
    .map(([k]) => k);

  const strongSkills = Object.entries(skillMap)
    .filter(([, v]) => (v.correct / v.total) >= 0.8)
    .map(([k]) => k);

  return {
    totalScore: Math.round((totalCorrect / questions.length) * 100),
    basicScore: { correct: basicCorrect, total: basicTotal },
    mediumScore: { correct: mediumCorrect, total: mediumTotal },
    hardScore: { correct: hardCorrect, total: hardTotal },
    skillScores: skillMap,
    weakSkills,
    strongSkills,
  };
}

// ─── 3. Generate Learning Path for Weak Skills ────────────────────────────────

export async function generateLearningPath(
  jobRole: string,
  weakSkill: string
): Promise<LearningPathItem[]> {
  const prompt = `You are a senior career coach for ${jobRole} roles.

The user is weak in: ${weakSkill}

Generate a personalized learning path with 6-9 sequential topics to master ${weakSkill} for ${jobRole}.

Return ONLY a valid JSON array:
[
  {
    "topic": "Topic name",
    "difficulty": "Beginner|Intermediate|Advanced",
    "estimatedHours": 5,
    "whyImportant": "Why this topic matters for ${jobRole}"
  }
]

Make topics sequential (foundations first, advanced last).
Return ONLY JSON, no markdown.`;

  const raw = await chatCompletion([{ role: 'user', content: prompt }], {
    temperature: 0.3,
    max_tokens: 1500,
  });

  return parseJSON<LearningPathItem[]>(raw);
}

// ─── 4. Generate Interview Questions ─────────────────────────────────────────

export async function generateInterviewQuestions(
  jobRole: string,
  domain: string,
  difficulty: string,
  interviewType: string,
  count: number,
  resumeContext?: string
): Promise<InterviewQuestion[]> {
  const resumeSection = resumeContext
    ? `\nCandidate resume context: ${resumeContext}\nUse this to ask resume-specific follow-up questions.`
    : '';

  const prompt = `You are a technical interviewer for a ${jobRole} position.

Generate exactly ${count} interview questions.
Domain: ${domain}
Difficulty: ${difficulty}
Type: ${interviewType}${resumeSection}

Return ONLY a valid JSON array:
[
  {
    "id": 1,
    "question": "Full interview question text",
    "domain": "${domain}",
    "difficulty": "${difficulty}",
    "followUp": "Optional follow-up question if answer is strong"
  }
]

Rules:
- Questions must be specific to ${jobRole} and ${domain}
- Make them conversational, as a real interviewer would ask
- Include scenario-based and practical questions
- For resume-aware questions, reference only what's in the candidate's context
- Return ONLY JSON array, no markdown`;

  const raw = await chatCompletion([{ role: 'user', content: prompt }], {
    temperature: 0.6,
    max_tokens: 2000,
  });

  return parseJSON<InterviewQuestion[]>(raw);
}

// ─── 5. Evaluate Interview ────────────────────────────────────────────────────

export async function evaluateInterview(
  jobRole: string,
  domain: string,
  answers: InterviewAnswer[]
): Promise<InterviewEvaluation> {
  const qaText = answers
    .map((a, i) => `Q${i + 1} [${a.domain}]: ${a.question}\nAnswer: ${a.answer}`)
    .join('\n\n');

  const prompt = `You are a senior ${jobRole} interviewer evaluating a candidate's performance.

Role: ${jobRole}
Domain: ${domain}

Questions and Answers:
${qaText}

Evaluate this interview comprehensively.

Return ONLY a valid JSON object:
{
  "overallScore": 74,
  "technicalScore": 78,
  "communicationScore": 71,
  "problemSolvingScore": 76,
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "skillScores": {
    "${domain}": 72,
    "General": 75
  },
  "detailedFeedback": "2-3 sentence personalized summary of performance",
  "improvementPlan": [
    {
      "skill": "Skill name",
      "steps": ["Step 1", "Step 2", "Step 3", "Step 4"]
    }
  ]
}

Be specific. Reference actual answers. Do not generate generic feedback.
Return ONLY JSON, no markdown.`;

  const raw = await chatCompletion([{ role: 'user', content: prompt }], {
    temperature: 0.3,
    max_tokens: 2000,
  });

  return parseJSON<InterviewEvaluation>(raw);
}

// ─── 6. CareerIQ Chatbot ──────────────────────────────────────────────────────

export async function careerChat(
  messages: ChatMessage[],
  userContext: {
    name: string;
    currentRole: string;
    targetRole: string;
    skills: string[];
    careerReadiness: number;
    criticalSkillGapsCount: number;
    testResult?: { totalScore: number; weakSkills: string[] } | null;
    interviewResult?: { overallScore: number; weaknesses: string[] } | null;
  }
): Promise<string> {
  const systemPrompt = `You are CareerIQ Assistant — a personalized career intelligence advisor.

You ONLY answer using the user's CareerIQ data below. Never invent facts.

USER PROFILE:
- Name: ${userContext.name}
- Current Role: ${userContext.currentRole}
- Target Role: ${userContext.targetRole}
- Skills: ${userContext.skills.join(', ')}
- Career Readiness: ${userContext.careerReadiness}%
- Critical Skill Gaps: ${userContext.criticalSkillGapsCount}

${userContext.testResult ? `MOCK TEST RESULT:
- Overall Score: ${userContext.testResult.totalScore}%
- Weak Skills: ${userContext.testResult.weakSkills.join(', ')}` : 'MOCK TEST: Not taken yet.'}

${userContext.interviewResult ? `INTERVIEW RESULT:
- Overall Score: ${userContext.interviewResult.overallScore}/100
- Key Weaknesses: ${userContext.interviewResult.weaknesses.join(', ')}` : 'INTERVIEW: Not taken yet.'}

RULES:
- Be concise and personalized. Use their name when natural.
- Answer ONLY career-related questions about ${userContext.name}'s profile
- Never invent job statistics, market data, or user facts not in this context
- If you don't have enough data, say so clearly
- Keep responses under 200 words unless asked for detail
- Format with bullet points when listing multiple items`;

  const apiMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({ role: m.role, content: m.content })),
  ];

  return chatCompletion(apiMessages, { temperature: 0.5, max_tokens: 600 });
}

export const aiService = {
  generateMockTest,
  evaluateMockTest,
  generateLearningPath,
  generateInterviewQuestions,
  evaluateInterview,
  careerChat,
};
