import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";
import { ArrowLeft, Play, Pause, RotateCcw, CheckCircle2, Loader2 } from "lucide-react";

type Phase = "inhale" | "hold" | "exhale" | "rest";

const exercises = [
  { name: "4-7-8 Breathing", inhale: 4, hold: 7, exhale: 8, rest: 0, cycles: 4 },
  { name: "Box Breathing", inhale: 4, hold: 4, exhale: 4, rest: 4, cycles: 5 },
  { name: "Deep Breathing", inhale: 5, hold: 2, exhale: 6, rest: 2, cycles: 6 },
];

// Helper functions untuk localStorage
const getUserData = () => {
  if (typeof window !== 'undefined') {
    const dataStr = localStorage.getItem('zuko_user_data');
    return dataStr ? JSON.parse(dataStr) : null;
  }
  return null;
};

const updateUserData = (updates: any) => {
  if (typeof window !== 'undefined') {
    const currentData = getUserData();
    const updatedData = { ...currentData, ...updates };
    localStorage.setItem('zuko_user_data', JSON.stringify(updatedData));
    return updatedData;
  }
  return null;
};

export function BreathingExercises() {
  const navigate = useNavigate();
  const [selectedExercise, setSelectedExercise] = useState(exercises[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState<Phase>("inhale");
  const [currentCycle, setCurrentCycle] = useState(1);
  const [timeLeft, setTimeLeft] = useState(selectedExercise.inhale);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [totalTime, setTotalTime] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Load user data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('zuko_user');
      setCurrentUser(userStr ? JSON.parse(userStr) : null);
    }
  }, []);

  // Timer effect untuk breathing exercise
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Move to next phase
          if (phase === "inhale") {
            setPhase("hold");
            return selectedExercise.hold;
          } else if (phase === "hold") {
            setPhase("exhale");
            return selectedExercise.exhale;
          } else if (phase === "exhale") {
            if (selectedExercise.rest > 0) {
              setPhase("rest");
              return selectedExercise.rest;
            } else {
              // Move to next cycle
              if (currentCycle >= selectedExercise.cycles) {
                // Exercise completed
                handleExerciseComplete();
                setIsPlaying(false);
                return selectedExercise.inhale;
              }
              setCurrentCycle((c) => c + 1);
              setPhase("inhale");
              return selectedExercise.inhale;
            }
          } else {
            // rest phase
            if (currentCycle >= selectedExercise.cycles) {
              // Exercise completed
              handleExerciseComplete();
              setIsPlaying(false);
              return selectedExercise.inhale;
            }
            setCurrentCycle((c) => c + 1);
            setPhase("inhale");
            return selectedExercise.inhale;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, phase, currentCycle, selectedExercise]);

  // Track session time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && !sessionCompleted) {
      setSessionStartTime(Date.now());
      
      interval = setInterval(() => {
        setTotalTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, sessionCompleted]);

  const handleExerciseComplete = () => {
    setSessionCompleted(true);
    saveSessionData();
  };

  const saveSessionData = () => {
    setIsSaving(true);

    // Calculate session duration
    const sessionDuration = totalTime;
    
    // Create breathing session entry
    const breathingSession = {
      id: `breathing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString(),
      exercise: selectedExercise.name,
      duration: sessionDuration,
      cycles: currentCycle,
      inhaleTime: selectedExercise.inhale,
      holdTime: selectedExercise.hold,
      exhaleTime: selectedExercise.exhale,
      restTime: selectedExercise.rest,
      timestamp: Date.now(),
    };

    // Get current user data
    const currentData = getUserData();
    
    // Prepare updated data
    const updatedSessions = [breathingSession, ...(currentData?.breathingSessions || [])];
    
    // Update statistics
    const updatedData = {
      ...currentData,
      breathingSessions: updatedSessions,
      statistics: {
        ...currentData?.statistics,
        totalEntries: (currentData?.statistics?.totalEntries || 0) + 1,
        lastActivity: new Date().toISOString(),
      },
    };

    // Simulate API call delay
    setTimeout(() => {
      // Save to localStorage
      updateUserData(updatedData);
      
      // Show success animation
      setIsSaving(false);
      setShowSuccess(true);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 800);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setPhase("inhale");
    setCurrentCycle(1);
    setTimeLeft(selectedExercise.inhale);
    setSessionCompleted(false);
    setTotalTime(0);
    setSessionStartTime(null);
  };

  const handleExerciseSelect = (exercise: typeof exercises[0]) => {
    setSelectedExercise(exercise);
    setTimeLeft(exercise.inhale);
    setPhase("inhale");
    setCurrentCycle(1);
    setSessionCompleted(false);
    setTotalTime(0);
  };

  const getPhaseText = () => {
    switch (phase) {
      case "inhale":
        return "Breathe In";
      case "hold":
        return "Hold";
      case "exhale":
        return "Breathe Out";
      case "rest":
        return "Rest";
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case "inhale":
        return "from-primary to-secondary";
      case "hold":
        return "from-secondary to-accent";
      case "exhale":
        return "from-accent to-primary";
      case "rest":
        return "from-muted to-background";
    }
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case "inhale":
        return "Slowly inhale through your nose";
      case "hold":
        return "Hold your breath";
      case "exhale":
        return "Gently exhale through your mouth";
      case "rest":
        return "Relax and rest";
    }
  };

  const progress = ((selectedExercise.cycles - currentCycle + 1) / selectedExercise.cycles) * 100;

  // Format time (seconds to minutes:seconds)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getPhaseColor()} pb-20 md:pb-6 transition-all duration-1000`}>
      {/* Success Overlay */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 text-center max-w-md w-full shadow-2xl"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5 }}
            >
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-2">Great Job!</h3>
            <p className="text-muted-foreground mb-6">
              You completed {selectedExercise.name} breathing exercise.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-primary/5 rounded-lg p-3">
                <div className="text-lg font-bold text-primary">{currentCycle} cycles</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div className="bg-secondary/5 rounded-lg p-3">
                <div className="text-lg font-bold text-secondary">{formatTime(totalTime)}</div>
                <div className="text-xs text-muted-foreground">Duration</div>
              </div>
            </div>
            <Button 
              className="w-full" 
              onClick={() => setShowSuccess(false)}
            >
              Continue Breathing
            </Button>
          </motion.div>
        </motion.div>
      )}

      <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="bg-white/10 hover:bg-white/20">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl text-white">Breathing Exercises</h1>
            <p className="text-sm text-white/80">
              Find your calm through mindful breathing {currentUser?.name ? `, ${currentUser.name}` : ''}
            </p>
          </div>
        </div>

        {/* Exercise Selection */}
        {!isPlaying && currentCycle === 1 && !sessionCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-3"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-white">Choose an Exercise</h2>
              {currentUser && (
                <div className="text-xs text-white/60">
                  Focus on your breath
                </div>
              )}
            </div>
            
            {exercises.map((exercise) => (
              <motion.div
                key={exercise.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`cursor-pointer transition-all ${
                    selectedExercise.name === exercise.name
                      ? "ring-2 ring-white shadow-xl bg-white/10"
                      : "hover:shadow-lg bg-white/5"
                  }`}
                  onClick={() => handleExerciseSelect(exercise)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-white">{exercise.name}</h3>
                        <p className="text-sm text-white/80">
                          {exercise.inhale}s inhale • {exercise.hold}s hold • {exercise.exhale}s exhale • {exercise.cycles} cycles
                        </p>
                      </div>
                      {selectedExercise.name === exercise.name && (
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Session Stats */}
        {(isPlaying || sessionCompleted) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
          >
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{currentCycle}</div>
                <div className="text-xs text-white/80">Cycle</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {selectedExercise.cycles}
                </div>
                <div className="text-xs text-white/80">Total Cycles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {formatTime(totalTime)}
                </div>
                <div className="text-xs text-white/80">Duration</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Breathing Circle */}
        <div className="flex items-center justify-center py-8 md:py-12">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${phase}-${timeLeft}`}
                className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl"
                animate={{
                  scale: phase === "inhale" ? 1.2 : phase === "exhale" ? 0.8 : 1,
                  backgroundColor: 
                    phase === "inhale" ? "rgba(255,255,255,0.25)" :
                    phase === "hold" ? "rgba(255,255,255,0.2)" :
                    phase === "exhale" ? "rgba(255,255,255,0.15)" :
                    "rgba(255,255,255,0.1)",
                }}
                transition={{
                  duration: phase === "inhale" ? selectedExercise.inhale : 
                           phase === "exhale" ? selectedExercise.exhale : 
                           phase === "hold" ? selectedExercise.hold :
                           phase === "rest" ? selectedExercise.rest : 1,
                  ease: "easeInOut",
                }}
              >
                <div className="text-center">
                  <div className="text-6xl md:text-7xl font-bold text-white mb-2">{timeLeft}</div>
                  <div className="text-xl md:text-2xl text-white/90 font-medium">{getPhaseText()}</div>
                  <div className="text-sm text-white/70 mt-2 max-w-xs">
                    {getPhaseInstruction()}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Progress Ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-72 h-72 md:w-88 md:h-88" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="3"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={2 * Math.PI * 45 * (1 - (timeLeft / (
                    phase === "inhale" ? selectedExercise.inhale :
                    phase === "hold" ? selectedExercise.hold :
                    phase === "exhale" ? selectedExercise.exhale :
                    selectedExercise.rest || 1
                  )))}
                  initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                  transition={{ duration: 1 }}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Progress and Controls */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white/90">
                <span>Cycle {currentCycle} of {selectedExercise.cycles}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} className="h-2 bg-white/20" />
            </div>

            <div className="flex gap-3">
              <Button
                className="flex-1 bg-white hover:bg-white/90 text-primary font-medium"
                onClick={() => {
                  if (!isPlaying && currentCycle === 1 && !sessionCompleted) {
                    setSessionStartTime(Date.now());
                  }
                  setIsPlaying(!isPlaying);
                }}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : isPlaying ? (
                  <>
                    <Pause className="mr-2 h-5 w-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    {currentCycle > 1 ? "Resume" : "Start"}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                onClick={handleReset}
                disabled={isSaving}
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>

            {/* Quick Stats */}
            {sessionStartTime && (
              <div className="pt-4 border-t border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">
                      {selectedExercise.inhale}-{selectedExercise.hold}-{selectedExercise.exhale}
                    </div>
                    <div className="text-xs text-white/80">Breath Pattern</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">
                      {Math.round((currentCycle / selectedExercise.cycles) * 100)}%
                    </div>
                    <div className="text-xs text-white/80">Session Progress</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Exercise Info */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <h3 className="font-medium text-white mb-3 flex items-center gap-2">
              {selectedExercise.name}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="text-center bg-white/10 rounded-lg p-2">
                <div className="text-lg font-bold text-white">{selectedExercise.inhale}s</div>
                <div className="text-xs text-white/80">Inhale</div>
              </div>
              <div className="text-center bg-white/10 rounded-lg p-2">
                <div className="text-lg font-bold text-white">{selectedExercise.hold}s</div>
                <div className="text-xs text-white/80">Hold</div>
              </div>
              <div className="text-center bg-white/10 rounded-lg p-2">
                <div className="text-lg font-bold text-white">{selectedExercise.exhale}s</div>
                <div className="text-xs text-white/80">Exhale</div>
              </div>
              <div className="text-center bg-white/10 rounded-lg p-2">
                <div className="text-lg font-bold text-white">{selectedExercise.rest || 0}s</div>
                <div className="text-xs text-white/80">Rest</div>
              </div>
            </div>
            <p className="text-sm text-white/80">
              This exercise helps {selectedExercise.name.toLowerCase().includes('box') ? 'reduce stress and improve focus' : 
                                  selectedExercise.name.toLowerCase().includes('deep') ? 'relax the body and mind' : 
                                  'calm the nervous system and promote sleep'}.
            </p>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <h3 className="font-medium text-white mb-2">Tips for Better Results</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                <span>Find a quiet, comfortable space</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                <span>Sit or lie in a relaxed position</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                <span>Focus on your breathing rhythm</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                <span>Let go of distracting thoughts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white">•</span>
                <span>Your session will be automatically saved</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Completion Notice */}
        {sessionCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-400" />
              <div>
                <h4 className="font-medium text-white">Exercise Completed!</h4>
                <p className="text-sm text-white/80">
                  You've completed {selectedExercise.name}. Great job! 🎉
                </p>
                {currentUser?.name && (
                  <p className="text-xs text-white/60 mt-1">
                    This session has been saved to your wellness journal, {currentUser.name}.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Session History Button */}
        <Button
          variant="outline"
          className="w-full bg-white/5 hover:bg-white/10 text-white border-white/20"
          onClick={() => navigate("/dashboard")}
        >
          View Your Breathing History
        </Button>
      </div>
    </div>
  );
}