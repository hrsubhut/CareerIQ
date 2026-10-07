import React, { useState } from 'react';
import { Award, CheckCircle2, AlertCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface CareerReadinessAssessmentProps {
  targetRole: string;
  onAssessmentCompleted: (score: number) => void;
}

export const CareerReadinessAssessment: React.FC<CareerReadinessAssessmentProps> = ({
  targetRole,
  onAssessmentCompleted,
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions = [
    {
      id: 1,
      skill: 'Machine Learning',
      question: 'When dealing with a severe class imbalance problem in classification (e.g. 99:1), which metric is most deceptive to rely upon?',
      options: [
        'Accuracy',
        'Precision-Recall Area (PR-AUC)',
        'F1-Score',
        'Balanced Accuracy'
      ],
      correctIndex: 0,
      explanation: 'Accuracy will show 99% simply by predicting the majority class every time, failing completely on the minority class of interest.'
    },
    {
      id: 2,
      skill: 'Applied Statistics',
      question: 'In an A/B test, if your p-value is 0.03 at an alpha significance threshold of 0.05, what is the statistical interpretation?',
      options: [
        'There is a 3% probability that the null hypothesis is true.',
        'The observed effect has less than a 5% probability of occurring under the null hypothesis, so reject the null hypothesis.',
        'The test is inconclusive and requires running for 30 more days.',
        'The conversion rate has increased by exactly 3%.'
      ],
      correctIndex: 1,
      explanation: 'p < alpha implies the observed data is sufficiently unlikely under the null hypothesis to reject it.'
    },
    {
      id: 3,
      skill: 'SQL Querying',
      question: 'Which SQL clause is strictly used with window functions to define the grouping over which the calculation is performed without collapsing rows?',
      options: [
        'GROUP BY',
        'ORDER BY ... HAVING',
        'PARTITION BY',
        'DISTINCT ON'
      ],
      correctIndex: 2,
      explanation: 'PARTITION BY divides query rows into groups for window evaluation while preserving individual rows.'
    },
    {
      id: 4,
      skill: 'Python / Model Validation',
      question: 'What is data leakage during cross-validation, and how is it properly prevented?',
      options: [
        'When test data is leaked to competitors; prevented by NDAs.',
        'When information from outside the training dataset (e.g. scaling or imputing with full dataset statistics) influences model training; prevented by pipelines fitted strictly on train folds.',
        'When memory runs out in Python RAM; prevented by garbage collection.',
        'When labels are converted to one-hot encoding improperly.'
      ],
      correctIndex: 1,
      explanation: 'Data leakage happens when preprocessing/feature engineering utilizes test data prior to cross-validation fold splitting.'
    }
  ];

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });
    return Math.round((correctCount / questions.length) * 100);
  };

  const handleSubmit = () => {
    const score = calculateScore();
    setIsSubmitted(true);
    onAssessmentCompleted(score);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentQIndex(0);
    setIsSubmitted(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6">
      <div className="border-b border-gray-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
            Skill Assessment / Mock Test
          </span>
          <h2 className="text-lg font-bold text-gray-900">
            Career Readiness Assessment for {targetRole}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Objective platform benchmark testing your identified gap skills (Platform evidence, not a statutory certification).
          </p>
        </div>

        {!isSubmitted && (
          <span className="text-xs text-gray-600 font-semibold px-2.5 py-1 bg-gray-100 rounded-md">
            Question {currentQIndex + 1} of {questions.length}
          </span>
        )}
      </div>

      {!isSubmitted ? (
        <div className="space-y-5">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-indigo-600 uppercase">
              Topic: {questions[currentQIndex].skill}
            </span>
            <h3 className="text-sm font-bold text-gray-900 leading-snug">
              {questions[currentQIndex].question}
            </h3>
          </div>

          <div className="space-y-2">
            {questions[currentQIndex].options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentQIndex] === optIdx;
              return (
                <div
                  key={optIdx}
                  onClick={() => handleSelectOption(currentQIndex, optIdx)}
                  className={`p-3.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/60 text-indigo-900 font-semibold'
                      : 'border-gray-200 hover:border-gray-300 text-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-[10px] shrink-0 font-bold">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            {currentQIndex > 0 ? (
              <button
                type="button"
                onClick={() => setCurrentQIndex(i => i - 1)}
                className="text-xs text-gray-600 hover:text-gray-900 font-medium"
              >
                ← Previous
              </button>
            ) : <span />}

            {currentQIndex < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentQIndex(i => i + 1)}
                disabled={selectedAnswers[currentQIndex] === undefined}
                className="px-4 py-2 bg-indigo-600 disabled:opacity-40 text-white rounded-lg text-xs font-semibold"
              >
                Next Question →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={selectedAnswers[currentQIndex] === undefined}
                className="px-5 py-2 bg-emerald-600 disabled:opacity-40 text-white rounded-lg text-xs font-bold"
              >
                Submit Assessment
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results Report */
        <div className="space-y-6">
          <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
                Assessment Completed
              </span>
              <h3 className="text-xl font-bold text-gray-900 mt-1">
                Your Assessment Score: {calculateScore()}%
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                {calculateScore() >= 75
                  ? 'Strong performance. Your career readiness index has been updated.'
                  : 'Good effort. Review weak areas below to continue improving readiness.'}
              </p>
            </div>

            <button
              onClick={handleRetake}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 bg-white rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake Test
            </button>
          </div>

          {/* Skill-wise breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Skill-Wise Question Breakdown:
            </h4>
            {questions.map((q, idx) => {
              const isCorrect = selectedAnswers[idx] === q.correctIndex;
              return (
                <div key={q.id} className="p-3.5 border border-gray-200 rounded-lg text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">{q.skill}</span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}
                    >
                      {isCorrect ? 'Correct' : 'Needs Review'}
                    </span>
                  </div>
                  <p className="text-gray-600">{q.question}</p>
                  <p className="text-gray-500 text-[11px]">
                    <strong className="text-gray-700">Explanation:</strong> {q.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
