"use client";

import { FC, useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ChevronLeft, ChevronRight, Flag, CheckCircle, XCircle, AlertCircle, RotateCcw, BookOpen, Target, Trophy, HelpCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { AnimatePresence } from 'framer-motion';
// import { practiceTests, practiceQuestions } from '@/data/practiceTests';
import Button from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { Lock } from 'lucide-react';
import Link from 'next/link';

// Time in milliseconds to wait before showing again (15 minutes)
const REAPPEAR_DELAY = 15 * 60 * 1000;
const EXAM_DURATION = 600; // 10 minutes in seconds

interface Question {
  _id?: string;
  id?: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface PracticeTest {
  _id: string;
  testId: string;
  title: string;
  description: string;
  questions: Question[];
  duration: number;
  isFree?: boolean;
  passPercentage?: number;
  price?: number;
}

interface ExamState {
  currentQuestion: number;
  answers: Record<number, number>;
  markedQuestions: Set<number>;
  timeLeft: number;
  isSubmitted: boolean;
  testMode: 'practice' | 'exam' | null;
  totalTimeSpent: number; // in seconds
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
  const router = useRouter();
  const { data: session } = useSession();
  const { isPurchased, purchaseItem } = useCart();
  const { currency, convertPrice } = useCurrency();
  const [isBuying, setIsBuying] = useState<string | boolean>(false);

  useEffect(() => {
    const handlePageShow = () => setIsBuying(false);
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

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
    testMode: null,
    totalTimeSpent: 0,
  });
  const [activePhase, setActivePhase] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [reminder, setReminder] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Correct' | 'Incorrect' | 'Skipped'>('All');

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

  const reattemptLimitReached = !currentTest?.isFree && attempts >= 5;

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

  const { currentQuestion, answers, markedQuestions, timeLeft, isSubmitted, testMode, totalTimeSpent } = examState;

  // Load persistence and auto-start if progress exists
  useEffect(() => {
    if (!currentTest) return;

    const saved = localStorage.getItem(`test_progress_${testIdSafe}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setExamState(prev => ({
          ...prev,
          currentQuestion: parsed.currentQuestion || 0,
          answers: parsed.answers || {},
          markedQuestions: new Set(parsed.markedQuestions || []),
          timeLeft: parsed.timeLeft !== undefined ? parsed.timeLeft : prev.timeLeft
        }));
        // Automatically start the test to the saved state ONLY if they have access
        if (currentTest.isFree || isPurchased(testIdSafe)) {
          setIsStarted(true);
        }
      } catch (e) {
        console.error("Failed to parse saved test progress", e);
      }
    }
  }, [currentTest, testIdSafe, isPurchased]);

  // Save persistence & Prevent leave
  useEffect(() => {
    if (isStarted && !isSubmitted) {
      // Save state
      const stateToSave = {
        currentQuestion,
        answers,
        markedQuestions: Array.from(markedQuestions),
        timeLeft
      };
      localStorage.setItem(`test_progress_${testIdSafe}`, JSON.stringify(stateToSave));

      // Prevent leave
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = 'Please submit your test before leaving. Your progress is saved, but you should finish it now.';
        return e.returnValue;
      };
      window.addEventListener('beforeunload', handleBeforeUnload);

      // Attempt to prevent browser back navigation
      window.history.pushState(null, '', window.location.href);
      const handlePopState = () => {
        if (window.confirm("You have an active test session. Please submit before leaving. Stay on page?")) {
          window.history.pushState(null, '', window.location.href);
        }
      };
      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isStarted, isSubmitted, currentQuestion, answers, markedQuestions, timeLeft, testIdSafe]);

  // Timer
  useEffect(() => {
    if (!isStarted || isSubmitted) return;

    const timer = setInterval(() => {
      setExamState((prev) => {
        const newTimeSpent = prev.totalTimeSpent + 1;
        
        // Timer only logic for Exam mode
        if (prev.testMode === 'exam') {
          if (prev.timeLeft <= 1) {
            clearInterval(timer);
            return { ...prev, timeLeft: 0, isSubmitted: true, totalTimeSpent: newTimeSpent };
          }
          
          const newTime = prev.timeLeft - 1;
          if (newTime === 600) setReminder("10 Minutes Remaining");
          if (newTime === 60) setReminder("1 Minute Remaining");
          if (newTime === 10) setReminder("10 Seconds Remaining - Submit Now!");
          
          return { ...prev, timeLeft: newTime, totalTimeSpent: newTimeSpent };
        }

        // Practice mode just tracks time
        return { ...prev, totalTimeSpent: newTimeSpent };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, isSubmitted]);

  // Clear reminder after 3 seconds
  useEffect(() => {
    if (reminder) {
      const timeout = setTimeout(() => setReminder(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [reminder]);

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
    // In practice mode, don't allow changing after seeing feedback
    if (testMode === 'practice' && answers[currentQuestion] !== undefined) return;
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
      const newPhase = Math.floor(nextQ / 110);
      if (newPhase !== activePhase) setActivePhase(newPhase);

      return {
        ...prev,
        currentQuestion: nextQ,
      };
    });
  };

  const handleStartMode = (mode: 'practice' | 'exam') => {
    setExamState(prev => ({
      ...prev,
      testMode: mode,
      timeLeft: (currentTest?.duration || 10) * 60,
      totalTimeSpent: 0
    }));
    setIsStarted(true);
  };

  const handleSubmit = () => {
    if (window.confirm("Are you sure you want to submit the test? You won't be able to change your answers after this.")) {
      setExamState((prev) => ({ ...prev, isSubmitted: true }));
      localStorage.removeItem(`test_progress_${testIdSafe}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (examState.testMode === 'exam') {
        incrementAttempts();
      }
    }
  };

  const handleRestart = () => {
    setExamState({
      currentQuestion: 0,
      answers: {},
      markedQuestions: new Set(),
      timeLeft: (currentTest?.duration || 10) * 60,
      isSubmitted: false,
      testMode: null,
      totalTimeSpent: 0,
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

  const handlePurchase = async () => {
    if (!currentTest) return;
    if (!session?.user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setIsBuying(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{
            id: currentTest.testId,
            title: currentTest.title,
            price: convertPrice(currentTest.price || 49),
            type: 'practice-test'
          }],
          currency: currency.code
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (err: any) {
      alert(err.message);
      setIsBuying(false);
    }
  };

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
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-10">
                  {/* Practice Mode Card */}
                  <motion.div 
                    whileHover={{ y: -5, borderColor: '#3F9FA3' }}
                    onClick={() => handleStartMode('practice')}
                    className="bg-white border-2 border-gray-100 rounded-3xl p-8 text-left cursor-pointer transition-all shadow-sm hover:shadow-xl group"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                        <BookOpen className="w-8 h-8" />
                      </div>
                      <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-bold uppercase tracking-wider">Beta</span>
                    </div>
                    <h3 className="text-xl font-bold text-secondary mb-3">Practice mode</h3>
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                      Practice answering questions in a low-stakes environment and review each answer before moving on to the next question.
                    </p>
                    
                    <div className="grid grid-cols-3 pt-6 border-t border-gray-50 gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-semibold uppercase">Questions</span>
                        </div>
                        <div className="text-sm font-bold text-secondary">{practiceQuestions.length}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-semibold uppercase">Duration</span>
                        </div>
                        <div className="text-sm font-bold text-secondary">None</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-semibold uppercase">Passing</span>
                        </div>
                        <div className="text-sm font-bold text-secondary">None</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Exam Mode Card */}
                  <motion.div 
                    whileHover={{ y: -5, borderColor: '#061F33' }}
                    onClick={() => handleStartMode('exam')}
                    className="bg-white border-2 border-gray-100 rounded-3xl p-8 text-left cursor-pointer transition-all shadow-sm hover:shadow-xl group"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors text-secondary">
                        <Target className="w-8 h-8" />
                      </div>
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider">Timed</span>
                    </div>
                    <h3 className="text-xl font-bold text-secondary mb-3">Exam mode</h3>
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                      Simulate a standardized test by completing your practice test within the time limit and achieving a passing score.
                    </p>
                    
                    <div className="grid grid-cols-3 pt-6 border-t border-gray-50 gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-semibold uppercase">Questions</span>
                        </div>
                        <div className="text-sm font-bold text-secondary">{practiceQuestions.length}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-semibold uppercase">Duration</span>
                        </div>
                        <div className="text-sm font-bold text-secondary">{currentTest?.duration || 10}m</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-semibold uppercase">Passing</span>
                        </div>
                        <div className="text-sm font-bold text-secondary">{currentTest?.passPercentage || 65}%</div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {canStart ? (
                  <div className="text-gray-400 text-sm">
                    {currentTest?.isFree ? 'Free test - Unlimited attempts' : `Premium test - ${5 - attempts} attempts remaining`}
                  </div>
                ) : (
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8 text-center max-w-md mx-auto">
                    <Lock className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-secondary mb-2">Premium Practice Test</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Purchase this test to unlock unlimited attempts and detailed explanations.
                    </p>
                    <Button onClick={handlePurchase} disabled={!!isBuying} size="lg" className="w-full">
                      {isBuying ? "Processing..." : "Buy Now to Unlock"}
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
    const totalQuestions = practiceQuestions.length;
    const percentage = (score / totalQuestions) * 100;
    const passThreshold = currentTest?.passPercentage || 65;
    const passed = percentage >= passThreshold;
    const unanswered = totalQuestions - Object.keys(answers).length;
    const incorrect = Object.keys(answers).length - score;

    const formatDuration = (seconds: number) => {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      return h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`;
    };

    return (
      <div className="pt-20 min-h-screen bg-gray-50 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Summary */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 bg-white rounded-3xl shadow-xl overflow-hidden"
            >
              <div className={`p-8 text-center ${passed ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm"
                >
                  {passed ? <Trophy className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
                </motion.div>
                <h1 className="text-3xl font-bold mb-2">
                  {passed ? 'Exam Passed!' : 'Exam Failed'}
                </h1>
                <p className="text-white/80">
                  {passed 
                    ? `Great job! You exceeded the ${passThreshold}% requirement.` 
                    : `You need ${passThreshold}% to pass. Keep studying!`}
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 bg-white">
                <div className="p-6 text-center">
                  <div className="text-2xl font-bold text-secondary">{percentage.toFixed(1)}%</div>
                  <div className="text-gray-500 text-xs uppercase tracking-wider mt-1">Accuracy</div>
                </div>
                <div className="p-6 text-center">
                  <div className="text-2xl font-bold text-secondary">{score}/{totalQuestions}</div>
                  <div className="text-gray-500 text-xs uppercase tracking-wider mt-1">Score</div>
                </div>
                <div className="p-6 text-center">
                  <div className="text-2xl font-bold text-secondary">{formatDuration(examState.totalTimeSpent)}</div>
                  <div className="text-gray-500 text-xs uppercase tracking-wider mt-1">Time Spent</div>
                </div>
                <div className="p-6 text-center">
                  <div className="text-2xl font-bold text-secondary">{passed ? 'PASS' : 'FAIL'}</div>
                  <div className="text-gray-500 text-xs uppercase tracking-wider mt-1">Result</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-xl p-8"
            >
              <h3 className="font-bold text-secondary mb-6 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                Performance Breakdown
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Correct Answers</span>
                    <span className="font-bold text-green-600">{score}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${(score/totalQuestions)*100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Incorrect Answers</span>
                    <span className="font-bold text-red-600">{incorrect}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: `${(incorrect/totalQuestions)*100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Skipped/Unanswered</span>
                    <span className="font-bold text-gray-400">{unanswered}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-300" style={{ width: `${(unanswered/totalQuestions)*100}%` }} />
                  </div>
                </div>
              </div>
              
              <Button onClick={handleRestart} className="w-full mt-8" variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" /> Retake {examState.testMode === 'exam' ? 'Exam' : 'Practice'}
              </Button>
            </motion.div>
          </div>

          {/* Detailed Question Review */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="p-8 border-b border-gray-100">
              <h3 className="text-xl font-bold text-secondary mb-6">Detailed Question Review</h3>
              
              <div className="flex flex-wrap gap-4">
                {['All', 'Correct', 'Incorrect', 'Skipped'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter as any)}
                    className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                      activeFilter === filter 
                        ? 'bg-secondary text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 space-y-6 max-h-[800px] overflow-y-auto">
              {practiceQuestions
                .map((q, idx) => ({ ...q, originalIndex: idx }))
                .filter(q => {
                  if (activeFilter === 'All') return true;
                  const isCorrect = answers[q.originalIndex] === q.correctAnswer;
                  const isAnswered = answers[q.originalIndex] !== undefined;
                  if (activeFilter === 'Correct') return isAnswered && isCorrect;
                  if (activeFilter === 'Incorrect') return isAnswered && !isCorrect;
                  if (activeFilter === 'Skipped') return !isAnswered;
                  return true;
                })
                .map((q) => {
                  const isCorrect = answers[q.originalIndex] === q.correctAnswer;
                  const isAnswered = answers[q.originalIndex] !== undefined;
                  
                  return (
                    <div key={q.originalIndex} className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50">
                      <div className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-sm ${
                          !isAnswered ? 'bg-gray-200 text-gray-500' : isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {q.originalIndex + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-secondary font-medium mb-4">{q.question}</h4>
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className={`p-4 rounded-xl border ${!isAnswered ? 'bg-white border-gray-100' : isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Your Answer</p>
                              <p className={`font-semibold ${!isAnswered ? 'text-gray-400' : isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                {isAnswered ? q.options[answers[q.originalIndex]] : 'Not answered'}
                              </p>
                            </div>
                            <div className="p-4 rounded-xl border bg-green-50 border-green-100">
                              <p className="text-xs font-bold uppercase tracking-wider text-green-400 mb-1">Correct Answer</p>
                              <p className="font-semibold text-green-700">{q.options[q.correctAnswer]}</p>
                            </div>
                          </div>
                          {q.explanation && (
                            <div className="bg-white p-4 rounded-xl border border-gray-100">
                              <p className="text-sm font-bold text-secondary mb-2 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-primary" /> Explanation
                              </p>
                              <p className="text-gray-600 text-sm leading-relaxed">{q.explanation}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Exam Screen
  const question = practiceQuestions[currentQuestion];

  return (
    <div className="pt-20 min-h-screen bg-gray-100">
      {/* Reminder Notification */}
      <AnimatePresence>
        {reminder && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 50, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className="fixed top-24 left-1/2 z-[100] bg-secondary text-white px-6 py-3 rounded-full shadow-2xl border border-primary/20 flex items-center gap-3 backdrop-blur-md"
          >
            <AlertCircle className="w-5 h-5 text-primary animate-pulse" />
            <span className="font-bold tracking-wide uppercase text-sm">{reminder}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timer Bar */}
      <motion.div
        animate={testMode === 'exam' && timeLeft <= 10 ? {
          scale: [1, 1.02, 1],
          backgroundColor: ["#dc2626", "#ef4444", "#dc2626"],
        } : {}}
        transition={{ duration: 0.5, repeat: Infinity }}
        className={`fixed top-20 left-0 right-0 z-40 py-3 transition-all duration-500 ${
          testMode === 'exam' 
            ? (timeLeft <= 10
              ? 'bg-red-600 shadow-[0_0_40px_rgba(220,38,38,0.6)]'
              : timeLeft <= 60
                ? 'bg-red-500'
                : 'bg-secondary')
            : 'bg-primary'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all duration-300 ${testMode === 'exam' && timeLeft < 60 ? 'border-red-500/50 bg-red-500/10' : 'border-white/20 bg-white/10'} ${testMode === 'exam' && timeLeft < 10 ? 'animate-pulse scale-105' : ''}`}>
            <Clock className={`w-5 h-5 ${testMode === 'exam' && timeLeft < 60 ? 'text-red-400' : 'text-white'}`} />
            <span className={`font-mono text-xl font-bold ${testMode === 'exam' && timeLeft < 60 ? 'text-red-400' : 'text-white'}`}>
              {testMode === 'exam' ? formatTime(timeLeft) : formatTime(examState.totalTimeSpent)}
            </span>
          </div>
          <div className="text-white font-bold hidden md:block">
            {testMode === 'exam' ? 'EXAM MODE' : 'PRACTICE MODE'} - {currentQuestion + 1} / {practiceQuestions.length}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSubmit}
            className="border-white text-white hover:bg-white hover:text-secondary"
          >
            Submit {testMode === 'exam' ? 'Exam' : 'Practice'}
          </Button>
        </div>
      </motion.div>

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

              <h2 className="font-display text-base md:text-lg font-medium text-secondary mb-8 leading-relaxed">
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

              {/* Instant Feedback (Practice Mode Only) */}
              {testMode === 'practice' && answers[currentQuestion] !== undefined && (
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
                {Array.from({ length: Math.ceil(practiceQuestions.length / 110) }).map((_, phaseIndex) => {
                  const startIdx = phaseIndex * 110;
                  const endIdx = Math.min(startIdx + 110, practiceQuestions.length);
                  const phaseQuestions = practiceQuestions.slice(startIdx, endIdx);

                  // Calculate phase progress
                  const phaseAnswered = phaseQuestions.filter((_, idx) => answers[startIdx + idx] !== undefined).length;
                  const phaseProgress = (phaseAnswered / phaseQuestions.length) * 100;

                  const isOpen = activePhase === phaseIndex;

                  return (
                    <div key={phaseIndex} className="border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setActivePhase(isOpen ? -1 : phaseIndex)}
                        className="w-full p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-secondary">
                            Phase {phaseIndex + 1} (Q{startIdx + 1} - Q{endIdx})
                          </span>
                          <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </motion.div>
                        </div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            className="overflow-hidden bg-white"
                          >
                            <div className="p-4 grid grid-cols-7 gap-2">
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
