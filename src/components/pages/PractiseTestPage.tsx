"use client";

import { FC, useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ChevronLeft, ChevronRight, Flag, CheckCircle, XCircle, AlertCircle, RotateCcw } from 'lucide-react';
import { useParams } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
// import { practiceTests, practiceQuestions } from '@/data/practiceTests';
import Button from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { Lock } from 'lucide-react';

const EXAM_DURATION = 600; // 10 minutes in seconds

interface PracticeTest {
  _id: string;
  testId: string;
  title: string;
  description: string;
  questions: Question[];
  duration: number;
  isFree?: boolean;
}

interface ExamState {
  currentQuestion: number;
  answers: Record<number, number>;
  markedQuestions: Set<number>;
  timeLeft: number;
  isSubmitted: boolean;
}

type QuestionStatus = 'unanswered' | 'answered' | 'marked';

const ReadMore: FC<{ text: string }> = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const words = text.split(' ');
  const isLong = words.length > 30;

  if (!isLong) return <p className="text-gray-800 text-sm leading-relaxed">{text}</p>;

  return (
    <div>
      <p className="text-gray-800 text-sm leading-relaxed">
        {expanded ? text : words.slice(0, 30).join(' ') + '...'}
      </p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-primary text-xs font-bold mt-1 hover:underline"
      >
        {expanded ? 'Read Less' : 'Read More'}
      </button>
    </div>
  );
};

const PracticeTests: FC = () => {
  const params = useParams();
  const testIdFromUrl = params?.id as string | undefined;
  const { isPurchased, purchaseItem } = useCart();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTest, setCurrentTest] = useState<PracticeTest | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [examState, setExamState] = useState<ExamState>({
    currentQuestion: 0,
    answers: {},
    markedQuestions: new Set(),
    timeLeft: EXAM_DURATION,
    isSubmitted: false,
  });
  const [activePhase, setActivePhase] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const practiceQuestions = currentTest?.questions || [];
  const testIdSafe = testIdFromUrl || "default-test";
  const purchased = isPurchased(testIdSafe);
  const canStart = currentTest?.isFree || purchased;

  useEffect(() => {
    if (testIdSafe) {
      const savedAttempts = localStorage.getItem(`attempts_${testIdSafe}`);
      if (savedAttempts) setAttempts(parseInt(savedAttempts));
    }
  }, [testIdSafe]);

  const incrementAttempts = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    localStorage.setItem(`attempts_${testIdSafe}`, newAttempts.toString());
  };

  const reattemptLimitReached = !currentTest?.isFree && attempts >= 2;

  useEffect(() => {
    const fetchTestData = async () => {
      if (!testIdFromUrl) return;
      try {
        const res = await fetch(`/api/practice-tests/${testIdFromUrl}`);
        if (!res.ok) throw new Error('Test not found');
        const data = await res.json();
        setCurrentTest(data);
        if (data.duration) {
          setExamState(prev => ({ ...prev, timeLeft: data.duration * 60 }));
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTestData();
  }, [testIdFromUrl]);

  const { currentQuestion, answers, markedQuestions, timeLeft, isSubmitted } = examState;

  // Timer
  useEffect(() => {
    if (!isStarted || isSubmitted) return;

    const timer = setInterval(() => {
      setExamState((prev) => {
        if (prev.timeLeft <= 1) {
          clearInterval(timer);
          return { ...prev, timeLeft: 0, isSubmitted: true };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionStatus = useCallback((index: number): QuestionStatus => {
    if (markedQuestions.has(index)) return 'marked';
    if (answers[index] !== undefined) return 'answered';
    return 'unanswered';
  }, [answers, markedQuestions]);

  const handleSelectAnswer = (optionIndex: number) => {
    if (isSubmitted) return;
    // If it's a free test and an answer is already selected, don't allow changing it
    if (currentTest?.isFree && answers[currentQuestion] !== undefined) return;
    setExamState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [currentQuestion]: optionIndex },
    }));
  };

  const handleMarkQuestion = () => {
    setExamState((prev) => {
      const newMarked = new Set(prev.markedQuestions);
      if (newMarked.has(currentQuestion)) {
        newMarked.delete(currentQuestion);
      } else {
        newMarked.add(currentQuestion);
      }
      return { ...prev, markedQuestions: newMarked };
    });
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    setExamState((prev) => {
      const nextQ = direction === 'prev'
        ? Math.max(0, prev.currentQuestion - 1)
        : Math.min(practiceQuestions.length - 1, prev.currentQuestion + 1);

      // Auto-open the correct phase accordion
      const newPhase = Math.floor(nextQ / 100);
      if (newPhase !== activePhase) setActivePhase(newPhase);

      return {
        ...prev,
        currentQuestion: nextQ,
      };
    });
  };

  const handleSubmit = () => {
    if (window.confirm("Are you sure you want to submit the test? You won't be able to change your answers after this.")) {
      setExamState((prev) => ({ ...prev, isSubmitted: true }));
      incrementAttempts();
    }
  };

  const handleRestart = () => {
    setExamState({
      currentQuestion: 0,
      answers: {},
      markedQuestions: new Set(),
      timeLeft: (currentTest?.duration || 10) * 60,
      isSubmitted: false,
    });
    setIsStarted(false);
  };

  const calculateScore = () => {
    let correct = 0;
    practiceQuestions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  if (loading) {
    return (
      <div className="pt-40 min-h-screen bg-gray-50 flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Preparing your exam environment...</p>
      </div>
    );
  }

  if (error || !currentTest) {
    return (
      <div className="pt-40 min-h-screen bg-gray-50 flex flex-col items-center px-4">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-secondary mb-2">Test Not Found</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">The practice test you are looking for could not be loaded. Please try again or contact support.</p>
        <Link href="/practice-tests">
          <Button>Back to All Tests</Button>
        </Link>
      </div>
    );
  }

  // Start Screen
  if (!isStarted) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <AlertCircle className="w-10 h-10 text-primary" />
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-bold text-secondary mb-4">
              {currentTest?.title ?? 'Practice Test'}
            </h1>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
              {currentTest?.description ?? 'Test your knowledge with our comprehensive practice exam.'}
            </p>

            {reattemptLimitReached ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-8 mb-8 text-center max-w-md mx-auto">
                <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="font-bold text-secondary text-xl mb-2">Attempt Limit Reached</h3>
                <p className="text-gray-600 mb-6">
                  You have used your reattempt chance for this test. To continue practicing, please contact support for a reset.
                </p>
                <Link href="/practice-tests">
                  <Button variant="outline" className="w-full">Browse Other Tests</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-6 mb-10 max-w-md mx-auto">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="font-display text-2xl font-bold text-secondary">{practiceQuestions.length}</div>
                    <div className="text-gray-500 text-sm">Questions</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="font-display text-2xl font-bold text-secondary">{currentTest?.duration || 30}</div>
                    <div className="text-gray-500 text-sm">Minutes</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="font-display text-2xl font-bold text-secondary">60%</div>
                    <div className="text-gray-500 text-sm">Pass Score</div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8 text-left max-w-md mx-auto">
                  <h3 className="font-semibold text-yellow-800 mb-2">Instructions:</h3>
                  <ul className="text-yellow-700 text-sm space-y-1">
                    <li>• Read each question carefully before answering</li>
                    <li>• You can mark questions for review</li>
                    <li>• Navigate between questions freely</li>
                    <li>• Submit before time runs out</li>
                    {!currentTest?.isFree && <li>• You have only ONE reattempt for this test</li>}
                  </ul>
                </div>

                {canStart ? (
                  <Button onClick={() => setIsStarted(true)} size="lg">
                    Start Exam
                  </Button>
                ) : (
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8 text-center max-w-md mx-auto">
                    <Lock className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-secondary mb-2">Premium Practice Test</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Purchase this test to unlock unlimited attempts and detailed explanations.
                    </p>
                    <Button onClick={() => purchaseItem(testIdSafe)} size="lg" className="w-full">
                      Buy Now to Unlock
                    </Button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (isSubmitted) {
    const score = calculateScore();
    const percentage = (score / practiceQuestions.length) * 100;
    const passed = percentage >= 60;

    return (
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-8 ${passed ? 'bg-green-100' : 'bg-red-100'
                }`}
            >
              {passed ? (
                <CheckCircle className="w-12 h-12 text-green-600" />
              ) : (
                <XCircle className="w-12 h-12 text-red-600" />
              )}
            </motion.div>

            <h1 className="font-display text-3xl font-bold text-secondary mb-2">
              {passed ? 'Congratulations! 🎉' : 'Keep Practicing!'}
            </h1>
            <p className="text-gray-600 mb-8">
              {passed
                ? 'You have successfully passed the practice test.'
                : "Don't give up! Review the material and try again."}
            </p>

            <div className="flex justify-center gap-8 mb-10">
              <div className="text-center">
                <div className={`font-display text-5xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                  {percentage.toFixed(0)}%
                </div>
                <div className="text-gray-500">Score</div>
              </div>
              <div className="text-center">
                <div className="font-display text-5xl font-bold text-secondary">
                  {score}/{practiceQuestions.length}
                </div>
                <div className="text-gray-500">Correct</div>
              </div>
            </div>

            {/* Review Answers */}
            <div className="text-left mb-8">
              <h3 className="font-display text-xl font-bold text-secondary mb-4">
                Review Answers
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {practiceQuestions.map((q, idx) => {
                  const isCorrect = answers[idx] === q.correctAnswer;
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="text-secondary font-semibold mb-2">{q.question}</p>
                          <p className="text-sm text-gray-600">
                            Your answer: <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                              {answers[idx] !== undefined ? q.options[answers[idx]] : 'Not answered'}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p className="text-sm text-green-600 mt-1">
                              Correct answer: <span className="font-semibold">{q.options[q.correctAnswer]}</span>
                            </p>
                          )}
                          <div className="mt-3 p-3 bg-white/50 rounded-lg">
                            <p className="text-sm font-bold text-gray-700 mb-1">Explanation:</p>
                            <ReadMore text={q.explanation || "No explanation provided."} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Button onClick={handleRestart} size="lg" disabled={reattemptLimitReached}>
              <RotateCcw className="w-5 h-5 mr-2" />
              {reattemptLimitReached ? 'Attempt Limit Reached' : 'Retake Exam'}
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Exam Screen
  const question = practiceQuestions[currentQuestion];

  return (
    <div className="pt-20 min-h-screen bg-gray-100">
      {/* Timer Bar */}
      <div className={`fixed top-20 left-0 right-0 z-40 py-3 ${timeLeft <= 10 ? 'bg-red-600' : 'bg-secondary'}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Clock className={`w-5 h-5 ${timeLeft <= 10 ? 'animate-pulse' : ''}`} />
            <span className={`font-mono text-xl font-bold ${timeLeft <= 10 ? 'animate-pulse' : ''}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="text-white">
            Question {currentQuestion + 1} of {practiceQuestions.length}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSubmit}
            className="border-white text-white hover:bg-white hover:text-secondary"
          >
            Submit Exam
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-25">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Question Panel */}
          <div className="lg:col-span-8">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  Question {currentQuestion + 1}
                </span>
                <button
                  onClick={handleMarkQuestion}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${markedQuestions.has(currentQuestion)
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  <Flag className="w-4 h-4" />
                  {markedQuestions.has(currentQuestion) ? 'Marked' : 'Mark for Review'}
                </button>
              </div>

              <h2 className="font-display text-xl md:text-2xl font-semibold text-secondary mb-8">
                {question.question}
              </h2>

              <div className="space-y-4">
                {question.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleSelectAnswer(index)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${answers[currentQuestion] === index
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-primary/50'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${answers[currentQuestion] === index
                          ? 'bg-primary text-white'
                          : currentTest?.isFree && answers[currentQuestion] !== undefined && question.correctAnswer === index
                            ? 'bg-green-500 text-white' // highlight correct answer even if not selected
                            : 'bg-gray-100 text-gray-600'
                          }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-secondary text-sm">{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Instant Feedback (Free Test or After Submission Only) */}
              {(currentTest?.isFree || isSubmitted) && answers[currentQuestion] !== undefined && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-8 p-6 rounded-2xl border ${answers[currentQuestion] === question.correctAnswer
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                    }`}
                >
                  <div className="flex items-start gap-4">
                    {answers[currentQuestion] === question.correctAnswer ? (
                      <CheckCircle className="w-7 h-7 text-green-600 shrink-0" />
                    ) : (
                      <XCircle className="w-7 h-7 text-red-600 shrink-0" />
                    )}
                    <div>
                      <h4 className={`font-bold text-lg mb-1 ${answers[currentQuestion] === question.correctAnswer ? 'text-green-800' : 'text-red-800'
                        }`}>
                        {answers[currentQuestion] === question.correctAnswer ? 'Correct!' : 'Incorrect'}
                      </h4>
                      <p className="text-gray-800 text-sm mb-3">
                        The correct answer is: <span className="font-semibold">{question.options[question.correctAnswer]}</span>
                      </p>
                      {question.explanation && (
                        <div className="text-sm bg-white/60 p-4 rounded-xl text-gray-800 border border-white">
                          <p className="font-bold mb-1">Explanation:</p>
                          <ReadMore text={question.explanation} />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
                <Button
                  variant="outline"
                  onClick={() => handleNavigate('prev')}
                  disabled={currentQuestion === 0}
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Previous
                </Button>
                <Button
                  onClick={() =>
                    currentQuestion === practiceQuestions.length - 1
                      ? handleSubmit()
                      : handleNavigate('next')
                  }
                >
                  {currentQuestion === practiceQuestions.length - 1 ? 'Submit' : 'Next'}
                  {currentQuestion !== practiceQuestions.length - 1 && (
                    <ChevronRight className="w-5 h-5 ml-2" />
                  )}
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Question Navigator */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-36">
              <h3 className="font-display font-semibold text-secondary mb-4">
                Question Navigator
              </h3>

              <div className="space-y-3 mb-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {Array.from({ length: Math.ceil(practiceQuestions.length / 100) }).map((_, phaseIndex) => {
                  const startIdx = phaseIndex * 100;
                  const endIdx = Math.min(startIdx + 100, practiceQuestions.length);
                  const phaseQuestions = practiceQuestions.slice(startIdx, endIdx);
                  const isOpen = activePhase === phaseIndex;

                  return (
                    <div key={phaseIndex} className="border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setActivePhase(isOpen ? -1 : phaseIndex)}
                        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-semibold text-sm text-secondary">
                          Phase {phaseIndex + 1} (Q{startIdx + 1} - Q{endIdx})
                        </span>
                        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            className="overflow-hidden bg-white"
                          >
                            <div className="p-4 grid grid-cols-8 gap-2.5">
                              {phaseQuestions.map((_, idx) => {
                                const globalIndex = startIdx + idx;
                                const status = getQuestionStatus(globalIndex);
                                return (
                                  <motion.button
                                    key={globalIndex}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setExamState((prev) => ({ ...prev, currentQuestion: globalIndex }))}
                                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-semibold text-sm transition-all ${currentQuestion === globalIndex
                                      ? 'ring-2 ring-primary ring-offset-1'
                                      : ''
                                      } ${status === 'answered'
                                        ? 'bg-green-500 text-white'
                                        : status === 'marked'
                                          ? 'bg-yellow-500 text-white'
                                          : 'bg-gray-100 text-gray-600'
                                      }`}
                                  >
                                    {globalIndex + 1}
                                  </motion.button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-100" />
                  <span className="text-gray-600">Not Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-500" />
                  <span className="text-gray-600">Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-yellow-500" />
                  <span className="text-gray-600">Marked for Review</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="text-sm text-gray-600 mb-2">Progress</div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${(Object.keys(answers).length / practiceQuestions.length) * 100}%`,
                    }}
                  />
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  {Object.keys(answers).length} of {practiceQuestions.length} answered
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeTests;
