import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  ArrowRight,
  Flag,
  Brain,
  Target,
  BarChart,
  Timer,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  generateQuestionsGenerateAptitudePost,
  evaluateAnswersEvaluateAptitudePost,
  generateRandomCodingChallengeGenerateChallengePost,
  evaluateCodeSolutionEvaluateCodePost,
  generateMcqQuestionsGenerateMcqPost
} from "@/hooks/useApis";

interface Question {
  id: number;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'coding' | 'essay';
  options?: string[];
  correctAnswer?: string | number;
  explanation?: string;
  timeLimit?: number;
  points: number;
}

interface AssessmentState {
  currentQuestion: number;
  answers: Record<number, any>;
  timeRemaining: number;
  isCompleted: boolean;
  score: number;
  totalQuestions: number;
}

const AssessmentPage = () => {
  const navigate = useNavigate();
  const [assessmentState, setAssessmentState] = useState<AssessmentState>({
    currentQuestion: 0,
    answers: {},
    timeRemaining: 3600, // 1 hour in seconds
    isCompleted: false,
    score: 0,
    totalQuestions: 0
  });
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [assessmentType, setAssessmentType] = useState<'aptitude' | 'mcq' | 'coding'>('aptitude');
  const [apiError, setApiError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Quiz service hooks
  const { mutate: generateAptitudeQuestions, isLoading: isGeneratingAptitude } = generateQuestionsGenerateAptitudePost({
    onSuccess: (data) => {
      console.log('Aptitude questions generated:', data);
      const formattedQuestions = (data.questions || []).map((q: any, index: number) => ({
        id: index + 1,
        question: q.question || '',
        type: 'essay' as const, // API returns essay-type questions with question and answer
        options: [],
        correctAnswer: q.answer || '',
        explanation: '',
        timeLimit: 60,
        points: 10
      }));
      setQuestions(formattedQuestions);
      setAssessmentState(prev => ({ ...prev, totalQuestions: formattedQuestions.length }));
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('Failed to generate aptitude questions:', error);
      console.error('Error details:', error);
      
      let errorMessage = `Failed to generate aptitude questions: ${error.message}`;
      
      // Check if it's an AI model error
      if (error.response && typeof error.response === 'object') {
        const responseText = JSON.stringify(error.response);
        if (responseText.includes('quota') || responseText.includes('429')) {
          errorMessage = `API Quota Exceeded: The AI service has reached its daily limit. Please try again tomorrow or contact support to upgrade the plan.`;
        } else if (responseText.includes('gemini') || responseText.includes('AI') || responseText.includes('model')) {
          errorMessage = `AI Service Error: The quiz service is having issues with the AI model. Please contact support or try again later.`;
        }
      }
      
      setApiError(errorMessage);
      setIsLoading(false);
    }
  });

  const { mutate: generateMcqQuestions, isLoading: isGeneratingMcq } = generateMcqQuestionsGenerateMcqPost({
    onSuccess: (data) => {
      console.log('MCQ questions generated:', data);
      const formattedQuestions = (data.questions || []).map((q: any, index: number) => ({
        id: index + 1,
        question: q.question || '',
        type: 'multiple-choice' as const,
        options: q.options || [],
        correctAnswer: q.answer || '',
        explanation: '',
        timeLimit: 60,
        points: 10
      }));
      setQuestions(formattedQuestions);
      setAssessmentState(prev => ({ ...prev, totalQuestions: formattedQuestions.length }));
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('Failed to generate MCQ questions:', error);
      setApiError('Failed to generate MCQ questions. Please try again.');
      setIsLoading(false);
    }
  });

  const { mutate: generateCodingChallenge, isLoading: isGeneratingCoding } = generateRandomCodingChallengeGenerateChallengePost({
    onSuccess: (data) => {
      console.log('Coding challenge generated:', data);
      const formattedQuestions = [{
        id: 1,
        question: data.problem || data.description || 'Solve the coding challenge',
        type: 'coding' as const,
        options: [],
        correctAnswer: data.solution || '',
        explanation: data.explanation || '',
        timeLimit: 1800,
        points: 50
      }];
      setQuestions(formattedQuestions);
      setAssessmentState(prev => ({ ...prev, totalQuestions: formattedQuestions.length }));
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('Failed to generate coding challenge:', error);
      setApiError('Failed to generate coding challenge. Please try again.');
      setIsLoading(false);
    }
  });

  const { mutate: evaluateAnswers } = evaluateAnswersEvaluateAptitudePost({
    onSuccess: (data) => {
      console.log('Assessment results:', data);
      setTestResults(data);
      setAssessmentState(prev => ({ 
        ...prev, 
        isCompleted: true, 
        score: data.score || 0 
      }));
    },
    onError: (error) => {
      console.error('Failed to evaluate answers:', error);
      
      // Handle different types of errors with more specific messaging
      let errorMessage = 'Failed to evaluate answers. Please try again.';
      let errorType = 'general';
      
      if (error.message?.includes('500') || error.message?.includes('Internal Server Error')) {
        errorMessage = 'The evaluation service is currently experiencing issues. This is a temporary problem on our end.';
        errorType = 'server';
      } else if (error.message?.includes('422')) {
        errorMessage = 'Invalid data format. Please refresh and try again.';
        errorType = 'validation';
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
        errorType = 'network';
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'Request timed out. The server is taking too long to respond.';
        errorType = 'timeout';
      }
      
      setApiError(errorMessage);
    }
  });

  const { mutate: evaluateCode } = evaluateCodeSolutionEvaluateCodePost({
    onSuccess: (data) => {
      console.log('Code evaluation results:', data);
      setTestResults(data);
      setAssessmentState(prev => ({ ...prev, isCompleted: true, score: data.score || 0 }));
    },
    onError: (error) => {
      console.error('Failed to evaluate code:', error);
    }
  });

  useEffect(() => {
    // Generate questions based on assessment type
    setIsLoading(true);
    setApiError(null);
    
    // Add a small delay to show loading state
    const timer = setTimeout(() => {
      if (assessmentType === 'aptitude') {
        generateAptitudeQuestions({});
      } else if (assessmentType === 'mcq') {
        generateMcqQuestions({
          subject: 'programming',
          difficulty: 'medium',
          count: 10
        });
      } else if (assessmentType === 'coding') {
        generateCodingChallenge({
          difficulty: 'medium',
          language: 'python',
          topic: 'algorithms'
        });
      }
    }, 500);

    return () => clearTimeout(timer);

    // Start timer
    timerRef.current = setInterval(() => {
      setAssessmentState(prev => {
        if (prev.timeRemaining <= 1) {
          // Time's up - auto-submit
          clearInterval(timerRef.current!);
          return { ...prev, timeRemaining: 0, isCompleted: true };
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmitAssessment = () => {
    setApiError(null);
    setRetryCount(0);
    setIsRetrying(false);
    
    if (assessmentType === 'coding') {
      evaluateCode({
        code: assessmentState.answers[0] || "",
        language: 'python',
        problem: questions[0]?.question || ""
      });
    } else {
      // Format data according to EvaluateRequest schema
      const answers = questions.map((question, index) => 
        assessmentState.answers[question.id] || ""
      );
      
      // Validate data before sending
      if (!questions || !Array.isArray(questions)) {
        setApiError('Invalid questions: questions array is missing or invalid');
        return;
      }
      if (!answers || !Array.isArray(answers)) {
        setApiError('Invalid answers: answers array is missing or invalid');
        return;
      }
      if (questions.length !== answers.length) {
        setApiError(`Mismatch: ${questions.length} questions but ${answers.length} answers`);
        return;
      }
      
      // Convert questions to the format expected by the API
      const apiQuestions = questions.map(q => {
        // Check for various possible field names for the answer
        const answerField = q.correctAnswer || q.answer || q.correct_answer || q.solution;
        
        if (!q.question || !answerField) {
          console.warn('Invalid question data:', q);
          setApiError(`Invalid question data: missing question or answer. Question: ${q.question}, Answer: ${answerField}`);
          return null;
        }
        return {
          question: q.question,
          answer: answerField
        };
      }).filter(Boolean);
      
      if (apiQuestions.length !== questions.length) {
        const failedQuestions = questions.filter(q => {
          const answerField = q.correctAnswer || q.answer || q.correct_answer || q.solution;
          return !q.question || !answerField;
        });
        setApiError(`Some questions are missing required data. Failed questions: ${failedQuestions.length}. Check console for details.`);
        console.error('Failed questions:', failedQuestions);
        return;
      }
      
      console.log('AssessmentPage - Sending aptitude evaluation request:');
      console.log('Questions:', apiQuestions);
      console.log('Answers:', answers);
      console.log('Original questions:', questions);
      
      evaluateAnswers({
        questions: apiQuestions,
        answers: answers.map(answer => String(answer || ''))
      });
    }
  };

  const handleRetry = () => {
    if (retryCount >= 3) {
      setApiError('Maximum retry attempts reached. Please refresh the page and try again.');
      return;
    }
    
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    // Wait a bit before retrying
    setTimeout(() => {
      handleSubmitAssessment();
      setIsRetrying(false);
    }, 1000 * retryCount); // Exponential backoff
  };


  const handleAssessmentTypeChange = (type: 'aptitude' | 'mcq' | 'coding') => {
    setAssessmentType(type);
    setAssessmentState(prev => ({
      ...prev,
      currentQuestion: 0,
      answers: {},
      timeRemaining: 3600,
      isCompleted: false,
      score: 0,
      totalQuestions: 0
    }));
    setQuestions([]);
    setTestResults(null);
    setApiError(null);
  };

  const handleAnswer = (answer: any) => {
    setAssessmentState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questions[prev.currentQuestion].id]: answer }
    }));
  };

  const handleNext = () => {
    if (assessmentState.currentQuestion < questions.length - 1) {
      setAssessmentState(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }));
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (assessmentState.currentQuestion > 0) {
      setAssessmentState(prev => ({ ...prev, currentQuestion: prev.currentQuestion - 1 }));
      setShowExplanation(false);
    }
  };

  const handleSubmit = () => {
    // Calculate score
    let score = 0;
    questions.forEach(question => {
      const userAnswer = assessmentState.answers[question.id];
      if (userAnswer === question.correctAnswer) {
        score += question.points;
      }
    });

    setAssessmentState(prev => ({ 
      ...prev, 
      isCompleted: true, 
      score 
    }));
  };

  const handleFlagQuestion = () => {
    // In a real app, this would mark the question for review
    console.log('Question flagged for review');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold">Loading Assessment...</h2>
          <p className="text-muted-foreground">Preparing your questions</p>
        </div>
      </div>
    );
  }

  if (assessmentState.isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-bg">
        <div className="pt-24 pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="p-8 text-center">
              <div className="mb-6">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold mb-2">Assessment Complete!</h1>
                <p className="text-muted-foreground">Great job completing your assessment</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-primary/10 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Your Score</h3>
                  <div className="text-4xl font-bold text-primary">
                    {testResults?.score || assessmentState.score}/{testResults?.total || questions.length}
                  </div>
                  <div className="text-muted-foreground">
                    {testResults?.total ? Math.round((testResults.score / testResults.total) * 100) : 0}%
                  </div>
                </div>
                <div className="bg-secondary/10 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Result</h3>
                  <div className="text-4xl font-bold text-secondary">
                    {testResults?.passed ? 'PASSED' : 'FAILED'}
                  </div>
                  <div className="text-muted-foreground">
                    {testResults?.time_taken ? `Time: ${Math.round(testResults.time_taken)}s` : 'Assessment completed'}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={() => navigate('/ai-assessment')}
                  className="w-full md:w-auto"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Assessment Center
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="w-full md:w-auto"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Retake Assessment
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[assessmentState.currentQuestion];
  const userAnswer = currentQuestion ? assessmentState.answers[currentQuestion.id] : null;
  const progress = questions.length > 0 ? ((assessmentState.currentQuestion + 1) / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading State */}
          {isLoading && (
            <div className="mb-8">
              <Card className="p-6">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Generating {assessmentType} questions...</p>
                </div>
              </Card>
            </div>
          )}

          {/* Error State */}
          {apiError && (
            <div className="mb-8">
              <Card className="p-6 border-red-200 bg-red-50">
                <div className="flex items-center mb-4">
                  <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
                  <h3 className="text-lg font-semibold text-red-800">Service Error</h3>
                </div>
                <p className="text-red-700 mb-4">{apiError}</p>
                {apiError.includes('server') && (
                  <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-800">
                      <strong>Server Issue:</strong> The evaluation service is temporarily unavailable. 
                      Please try again in a few minutes or contact support if the issue persists.
                    </p>
                  </div>
                )}
                {apiError.includes('API Quota Exceeded') && (
                  <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-800">
                      <strong>Quota Limit Reached:</strong> The AI service has reached its daily limit of 50 requests. 
                      This is a free tier limitation. Please try again tomorrow or contact support to upgrade the plan.
                    </p>
                  </div>
                )}
                {apiError.includes('AI Service Error') && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Technical Issue:</strong> The AI model service is currently unavailable. 
                      This is a backend configuration issue that needs to be resolved by the development team.
                    </p>
                  </div>
                )}
                {apiError.includes('network') && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Connection Issue:</strong> There's a problem with your internet connection or our servers.
                    </p>
                    <div className="mt-2 text-xs text-blue-700">
                      <strong>What you can do:</strong>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Check your internet connection</li>
                        <li>Try refreshing the page</li>
                        <li>Wait a moment and try again</li>
                      </ul>
                    </div>
                  </div>
                )}
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    onClick={handleRetry}
                    disabled={isRetrying || retryCount >= 3}
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-100 disabled:opacity-50"
                  >
                    {isRetrying ? 'Retrying...' : `Try Again ${retryCount > 0 ? `(${retryCount}/3)` : ''}`}
                  </Button>
                  
                  
                  <Button 
                    onClick={() => {
                      setApiError(null);
                      setRetryCount(0);
                      setIsRetrying(false);
                      setIsLoading(true);
                      if (assessmentType === 'aptitude') {
                        generateAptitudeQuestions({});
                      } else if (assessmentType === 'mcq') {
                        generateMcqQuestions({
                          subject: 'programming',
                          difficulty: 'medium',
                          count: 10
                        });
                      } else if (assessmentType === 'coding') {
                        generateCodingChallenge({
                          difficulty: 'medium',
                          language: 'python',
                          topic: 'algorithms'
                        });
                      }
                    }}
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    Start Fresh
                  </Button>
                  {apiError.includes('API Quota Exceeded') && (
                    <Button 
                      onClick={() => {
                        setApiError(null);
                        setAssessmentType('aptitude');
                        setQuestions([]);
                        setAssessmentState(prev => ({
                          ...prev,
                          currentQuestion: 0,
                          answers: {},
                          timeRemaining: 3600,
                          isCompleted: false,
                          score: 0,
                          totalQuestions: 0
                        }));
                      }}
                      variant="outline"
                      className="border-orange-300 text-orange-700 hover:bg-orange-100"
                    >
                      Choose Different Test
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Assessment Type Selection */}
          {questions.length === 0 && !isLoading && !apiError && (
            <div className="mb-8">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Choose Assessment Type</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button
                    variant={assessmentType === 'aptitude' ? 'default' : 'outline'}
                    onClick={() => handleAssessmentTypeChange('aptitude')}
                    className="h-20 flex flex-col items-center justify-center"
                  >
                    <Brain className="w-6 h-6 mb-2" />
                    <span>Aptitude Test</span>
                  </Button>
                  <Button
                    variant={assessmentType === 'mcq' ? 'default' : 'outline'}
                    onClick={() => handleAssessmentTypeChange('mcq')}
                    className="h-20 flex flex-col items-center justify-center"
                  >
                    <Target className="w-6 h-6 mb-2" />
                    <span>MCQ Test</span>
                  </Button>
                  <Button
                    variant={assessmentType === 'coding' ? 'default' : 'outline'}
                    onClick={() => handleAssessmentTypeChange('coding')}
                    className="h-20 flex flex-col items-center justify-center"
                  >
                    <BarChart className="w-6 h-6 mb-2" />
                    <span>Coding Challenge</span>
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/ai-assessment')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Assessment Center
              </Button>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Time Remaining</div>
                <div className={`text-2xl font-mono font-bold ${
                  assessmentState.timeRemaining < 300 ? 'text-red-500' : 'text-foreground'
                }`}>
                  {formatTime(assessmentState.timeRemaining)}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Question {assessmentState.currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          {/* Only show questions if we have questions and no errors */}
          {questions.length > 0 && !apiError && (
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Question Panel */}
              <div className="lg:col-span-3">
                <Card className="p-6">
                  {/* Question Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="text-primary border-primary">
                        {currentQuestion?.type?.replace('-', ' ').toUpperCase() || 'QUESTION'}
                      </Badge>
                    <Badge variant="secondary">
                      {currentQuestion?.points || 0} points
                    </Badge>
                    {currentQuestion?.timeLimit && (
                      <Badge variant="outline">
                        <Clock className="w-3 h-3 mr-1" />
                        {currentQuestion.timeLimit}s
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFlagQuestion}
                    className="text-muted-foreground hover:text-amber-500"
                  >
                    <Flag className="w-4 h-4" />
                  </Button>
                </div>

                {/* Question */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">{currentQuestion?.question || 'Loading question...'}</h2>
                  
                  {/* Answer Options */}
                  {currentQuestion?.type === 'multiple-choice' && currentQuestion?.options && (
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => (
                        <label
                          key={index}
                          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                            userAnswer === index
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${currentQuestion?.id || 0}`}
                            value={index}
                            checked={userAnswer === index}
                            onChange={() => handleAnswer(index)}
                            className="sr-only"
                          />
                          <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            userAnswer === index
                              ? 'border-primary bg-primary'
                              : 'border-muted-foreground'
                          }`}>
                            {userAnswer === index && (
                              <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                            )}
                          </div>
                          <span className="flex-1">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {currentQuestion?.type === 'true-false' && (
                    <div className="space-y-3">
                      {['True', 'False'].map((option, index) => (
                        <label
                          key={index}
                          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                            userAnswer === index
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${currentQuestion?.id || 0}`}
                            value={index}
                            checked={userAnswer === index}
                            onChange={() => handleAnswer(index)}
                            className="sr-only"
                          />
                          <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            userAnswer === index
                              ? 'border-primary bg-primary'
                              : 'border-border hover:border-primary/50'
                          }`}>
                            {userAnswer === index && (
                              <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                            )}
                          </div>
                          <span className="flex-1">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {currentQuestion?.type === 'coding' && (
                    <div className="space-y-4">
                      <div className="bg-secondary/20 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">
                          Write your code solution below:
                        </p>
                        <textarea
                          className="w-full h-32 p-3 bg-background border rounded-lg font-mono text-sm"
                          placeholder="// Write your code here..."
                          value={userAnswer || ''}
                          onChange={(e) => handleAnswer(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {currentQuestion?.type === 'essay' && (
                    <div className="space-y-4">
                      <div className="bg-secondary/20 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">
                          Write your detailed answer below:
                        </p>
                        <textarea
                          className="w-full h-32 p-3 bg-background border rounded-lg"
                          placeholder="Type your answer here..."
                          value={userAnswer || ''}
                          onChange={(e) => handleAnswer(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={assessmentState.currentQuestion === 0}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  <div className="flex space-x-3">
                    {assessmentState.currentQuestion < questions.length - 1 ? (
                      <Button onClick={handleNext}>
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button onClick={handleSubmitAssessment} className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Submit Assessment
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-4">
                <h3 className="font-semibold mb-4 flex items-center">
                  <BarChart className="w-4 h-4 mr-2" />
                  Question Navigator
                </h3>
                
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setAssessmentState(prev => ({ ...prev, currentQuestion: index }));
                        setShowExplanation(false);
                      }}
                      className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                        index === assessmentState.currentQuestion
                          ? 'bg-primary text-white'
                          : assessmentState.answers[questions[index].id] !== undefined
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      Answered
                    </span>
                    <span className="font-medium">
                      {Object.keys(assessmentState.answers).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <div className="w-3 h-3 bg-secondary rounded-full mr-2" />
                      Unanswered
                    </span>
                    <span className="font-medium">
                      {questions.length - Object.keys(assessmentState.answers).length}
                    </span>
                  </div>
                </div>

                {assessmentState.timeRemaining < 300 && (
                  <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Time is running out!</span>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;
