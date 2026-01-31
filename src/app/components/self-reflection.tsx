import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from "@/app/components/ui/badge";
import { Progress } from "@/app/components/ui/progress";
import { 
  ArrowLeft, 
  Save, 
  BookOpen, 
  CheckCircle2, 
  Sparkles, 
  Heart, 
  Star, 
  Trophy, 
  Target,
  Zap,
  Flower2,
  Quote,
  ChevronRight,
  Calendar,
  Clock,
  FileText,
  Loader2
} from "lucide-react";

const reflectionPrompts = [
  "What am I grateful for today?",
  "What challenged me today and how did I handle it?",
  "What positive impact did I make today?",
  "What did I learn about myself today?",
  "What would make tomorrow better?",
];

// Motivational messages yang berbeda-beda
const motivationalMessages = [
  {
    quote: "Every day is a fresh start. Each sunrise is a new chapter waiting to be written.",
    author: "",
    icon: Sparkles,
    color: "from-amber-500 to-orange-500"
  },
  {
    quote: "The journey of self-discovery is the most rewarding journey you'll ever take.",
    author: "",
    icon: Heart,
    color: "from-rose-500 to-pink-500"
  },
  {
    quote: "Your feelings are valid, your thoughts matter, and your growth is beautiful.",
    author: "",
    icon: Flower2,
    color: "from-emerald-500 to-green-500"
  },
  {
    quote: "Self-reflection is the school of wisdom. Keep learning, keep growing.",
    author: "",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500"
  },
  {
    quote: "Every moment of reflection brings you closer to the person you're meant to be.",
    author: "",
    icon: Target,
    color: "from-violet-500 to-purple-500"
  },
  {
    quote: "Your courage to look inward is your greatest strength.",
    author: "",
    icon: Heart,
    color: "from-rose-500 to-pink-500"
  },
  {
    quote: "The answers you seek are already within you. You just needed to ask the right questions.",
    author: "",
    icon: Zap,
    color: "from-amber-500 to-yellow-500"
  },
  {
    quote: "Today's reflection is tomorrow's wisdom. Keep writing your story.",
    author: "",
    icon: Star,
    color: "from-sky-500 to-blue-500"
  }
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

// Helper function untuk menghitung streak reflections
const calculateReflectionStreak = (reflections: any[]) => {
  if (reflections.length === 0) return 0;
  
  // Sort reflections by date (newest first)
  const sortedReflections = [...reflections].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let streak = 0;
  let currentDate = new Date();
  
  for (let i = 0; i < sortedReflections.length; i++) {
    const reflectionDate = new Date(sortedReflections[i].date);
    const diffDays = Math.floor((currentDate.getTime() - reflectionDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === streak) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

export function SelfReflection() {
  const navigate = useNavigate();
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedMotivation, setSelectedMotivation] = useState<typeof motivationalMessages[0] | null>(null);
  const [characterCount, setCharacterCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [reflectionStreak, setReflectionStreak] = useState(0);

  // Check screen size for responsive design
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load user data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load current user
      const userStr = localStorage.getItem('zuko_user');
      setCurrentUser(userStr ? JSON.parse(userStr) : null);
      
      // Load existing reflections to calculate streak
      const userData = getUserData();
      if (userData?.reflections) {
        const streak = calculateReflectionStreak(userData.reflections);
        setReflectionStreak(streak);
      }
    }
  }, []);

  // Select random motivational message
  useEffect(() => {
    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    setSelectedMotivation(randomMessage);
  }, []);

  // Calculate character and word count
  useEffect(() => {
    const allResponses = Object.values(responses).join(' ');
    setCharacterCount(allResponses.length);
    setWordCount(allResponses.trim().split(/\s+/).filter(word => word.length > 0).length);
  }, [responses]);

  const handleSave = () => {
    setIsSubmitting(true);
    
    // Get current date
    const now = new Date();
    
    // Create reflection entry
    const reflectionEntry = {
      id: `reflection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: now.toISOString(),
      responses,
      wordCount,
      characterCount,
      promptsAnswered: Object.keys(responses).length,
      duration: "5-10 minutes", // Estimated
      timestamp: Date.now(),
    };

    // Get current user data
    const currentData = getUserData();
    
    // Prepare updated data
    const updatedReflections = [reflectionEntry, ...(currentData?.reflections || [])];
    
    // Calculate new streak
    const newStreak = calculateReflectionStreak(updatedReflections);
    
    // Update statistics
    const updatedData = {
      ...currentData,
      reflections: updatedReflections,
      statistics: {
        ...currentData?.statistics,
        totalEntries: (currentData?.statistics?.totalEntries || 0) + 1,
        lastActivity: now.toISOString(),
      },
    };

    // Simulate API call delay
    setTimeout(() => {
      // Save to localStorage
      updateUserData(updatedData);
      
      // Update local streak state
      setReflectionStreak(newStreak);
      
      // Show confirmation
      setIsSubmitting(false);
      setShowConfirmation(true);
    }, 1000);
  };

  const handleComplete = () => {
    navigate("/dashboard");
  };

  // Calculate progress percentage
  const completedPrompts = Object.keys(responses).length;
  const progressPercentage = (completedPrompts / reflectionPrompts.length) * 100;

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-background via-primary/5 to-secondary/5">
              <CardContent className="p-6 md:p-8 text-center space-y-8">
                {/* Success Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <div className="h-20 w-20 md:h-24 md:w-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <CheckCircle2 className="h-10 w-10 md:h-12 md:w-12 text-white" />
                  </div>
                </motion.div>
                
                {/* Title */}
                <div className="space-y-3">
                  <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Reflection Complete!
                  </h1>
                  <p className="text-sm md:text-lg text-muted-foreground">
                    Thank you for taking time to reflect on your day
                  </p>
                  {currentUser?.name && (
                    <p className="text-sm text-muted-foreground">
                      Great job, {currentUser.name}! 🎉
                    </p>
                  )}
                </div>
                
                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-primary/20">
                    <CardContent className="p-3 md:p-4">
                      <div className="text-2xl md:text-3xl font-bold text-primary">{completedPrompts}</div>
                      <div className="text-xs md:text-sm text-muted-foreground">Questions Answered</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-secondary/20">
                    <CardContent className="p-3 md:p-4">
                      <div className="text-2xl md:text-3xl font-bold text-secondary">{wordCount}</div>
                      <div className="text-xs md:text-sm text-muted-foreground">Words Written</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-accent/20 col-span-2 md:col-span-1">
                    <CardContent className="p-3 md:p-4">
                      <div className="text-2xl md:text-3xl font-bold text-accent">{characterCount}</div>
                      <div className="text-xs md:text-sm text-muted-foreground">Characters</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Reflection Insights */}
                <Card className="border-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Your Reflection Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Date
                        </div>
                        <p className="font-medium">{new Date().toLocaleDateString()}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          Duration
                        </div>
                        <p className="font-medium">5-10 minutes</p>
                      </div>
                    </div>
                    
                    {/* Response Count Badges */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {Object.keys(responses).map((key) => (
                        <Badge key={key} variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Question {parseInt(key) + 1}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Reflection Stats */}
                    <div className="grid grid-cols-2 gap-3 md:gap-4 pt-2">
                      <div className="text-center p-3 bg-primary/5 rounded-lg">
                        <div className="text-lg font-bold text-primary">{reflectionStreak}</div>
                        <div className="text-xs text-muted-foreground">Day Streak</div>
                      </div>
                      <div className="text-center p-3 bg-secondary/5 rounded-lg">
                        <div className="text-lg font-bold text-secondary">
                          {Math.round((completedPrompts / reflectionPrompts.length) * 100)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Completion</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Random Motivational Message */}
                {selectedMotivation && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Card className={`bg-gradient-to-r ${selectedMotivation.color}/10 border-${selectedMotivation.color.split('-')[1]}/20`}>
                      <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col md:flex-row items-start gap-3 md:gap-4">
                          <div className={`h-10 w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-r ${selectedMotivation.color} flex items-center justify-center flex-shrink-0 mx-auto md:mx-0`}>
                            <selectedMotivation.icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                          </div>
                          <div className="text-center md:text-left flex-1">
                            <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                              <Quote className="h-4 w-4 text-primary/60" />
                              <p className="text-sm md:text-base italic">"{selectedMotivation.quote}"</p>
                            </div>
                            <p className="text-xs md:text-sm text-muted-foreground md:text-right">
                              — {selectedMotivation.author}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Streak Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="inline-flex items-center gap-2 md:gap-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full px-4 md:px-6 py-2 md:py-3 border border-primary/20">
                    <Trophy className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    <span className="text-sm md:text-base font-medium text-primary">
                      Daily Reflection Streak: {reflectionStreak} {reflectionStreak === 1 ? 'Day' : 'Days'}
                    </span>
                  </div>
                </motion.div>

                {/* Your Reflection Stats */}
                <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
                  <CardContent className="p-4 md:p-6">
                    <h4 className="font-medium mb-3 text-center">Your Reflection Journey</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div className="text-center">
                        <div className="text-xl font-bold text-primary">
                          {completedPrompts}/{reflectionPrompts.length}
                        </div>
                        <div className="text-xs text-muted-foreground">Questions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-secondary">{wordCount}</div>
                        <div className="text-xs text-muted-foreground">Words</div>
                      </div>
                      <div className="text-center col-span-2 md:col-span-1">
                        <div className="text-xl font-bold text-accent">{characterCount}</div>
                        <div className="text-xs text-muted-foreground">Characters</div>
                      </div>
                    </div>
                    <p className="text-xs text-center text-muted-foreground mt-3">
                      This reflection has been saved to your personal journal.
                    </p>
                  </CardContent>
                </Card>

                {/* Floating Celebration Icons */}
                <div className="relative h-20 md:h-32">
                  {['✨', '🌟', '💫', '🌸', '🎉'].map((emoji, index) => (
                    <motion.div
                      key={index}
                      className="absolute text-2xl md:text-3xl"
                      animate={{
                        y: [0, -20, 0],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 2 + index * 0.5,
                        repeat: Infinity,
                        delay: index * 0.2,
                      }}
                      style={{
                        left: isMobile 
                          ? `${15 + index * 17}%`
                          : `${20 + index * 15}%`,
                        top: '40%',
                      }}
                    >
                      {emoji}
                    </motion.div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <Button
                    variant="outline"
                    className="h-12 md:h-14"
                    onClick={() => navigate("/dashboard")}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                  <Button
                    className="h-12 md:h-14 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                    onClick={handleComplete}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Complete Reflection
                  </Button>
                </div>
                
                {/* Quick Stats */}
                <div className="text-center text-xs text-muted-foreground pt-4">
                  <p>Reflection saved at {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  <p className="mt-1">Keep up the great self-reflection habit!</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 pb-20 md:pb-6">
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="flex-shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-3xl font-bold truncate">Self Reflection</h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Take time to reflect on your day • {currentUser?.name ? `Welcome, ${currentUser.name}` : ''}
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">Your Progress</div>
                <div className="text-sm text-muted-foreground">
                  {completedPrompts}/{reflectionPrompts.length}
                </div>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Reflection Stats */}
        {reflectionStreak > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="text-sm font-medium">Reflection Streak</p>
                      <p className="text-xs text-muted-foreground">
                        {reflectionStreak} {reflectionStreak === 1 ? 'day' : 'days'} in a row! 🔥
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/statistics")}
                  >
                    View All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Header Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="relative h-40 md:h-56">
              <img
                src="https://images.unsplash.com/photo-1594997652537-2e2dce4ebf28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb3VybmFsJTIwd3JpdGluZyUyMHdlbGxuZXNzfGVufDF8fHx8MTc2ODk3MzkzNHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Journaling"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent flex items-end p-4">
                <div className="text-white">
                  <h3 className="font-bold text-lg md:text-xl">Daily Reflection Journal</h3>
                  <p className="text-sm text-white/80 mt-1">Your path to self-awareness</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Reflection Prompts */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 md:p-6">
            <CardTitle className="text-lg md:text-xl flex items-center gap-3">
              <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              <div>
                <div>Guided Reflection</div>
                <div className="text-xs md:text-sm font-normal text-muted-foreground mt-1">
                  Answer honestly and take your time • All responses are saved automatically
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6">
            {reflectionPrompts.map((prompt, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-3"
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <div className={`
                    h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1
                    ${responses[index] 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                      : 'bg-gradient-to-r from-primary/10 to-primary/20 text-primary'
                    }
                  `}>
                    {responses[index] ? (
                      <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5" />
                    ) : (
                      <span className="text-sm md:text-base font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-2 min-w-0">
                    <h3 className="font-medium text-base md:text-lg">{prompt}</h3>
                    <Textarea
                      placeholder="Write your thoughts here... (Try to write at least 2-3 sentences)"
                      className="min-h-24 md:min-h-32 resize-none text-sm md:text-base"
                      value={responses[index] || ""}
                      onChange={(e) =>
                        setResponses((prev) => ({ ...prev, [index]: e.target.value }))
                      }
                    />
                    {responses[index] && (
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{responses[index].length} characters</span>
                        <span className="text-green-600 font-medium">
                          ✓ Saved automatically
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {index < reflectionPrompts.length - 1 && (
                  <div className="ml-4 md:ml-5 pl-4 md:pl-5 border-l-2 border-dashed border-border/50 h-6 md:h-8" />
                )}
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button 
            className="w-full h-12 md:h-14 text-base md:text-lg" 
            onClick={handleSave}
            disabled={isSubmitting || completedPrompts === 0}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 md:h-5 md:w-5 animate-spin" />
                Saving Reflection...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                {completedPrompts === reflectionPrompts.length 
                  ? 'Complete Reflection' 
                  : 'Save Reflection'}
              </>
            )}
          </Button>
        </motion.div>

        {/* Tips and Stats Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Tips */}
          <Card className="bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/50">
            <CardContent className="p-4 md:p-6">
              <h3 className="font-medium mb-3 md:mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-600" />
                Reflection Tips
              </h3>
              <ul className="space-y-2 md:space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">✓</span>
                  </div>
                  <span>Be honest and authentic with yourself</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">✓</span>
                  </div>
                  <span>Focus on both positives and areas for growth</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">✓</span>
                  </div>
                  <span>Don't judge yourself, just observe</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">✓</span>
                  </div>
                  <span>Look for patterns over time</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">✓</span>
                  </div>
                  <span>All responses are saved automatically</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="border-dashed border-primary/30">
            <CardContent className="p-4 md:p-6">
              <h3 className="font-medium mb-3 md:mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Your Reflection Stats
              </h3>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="text-center p-3 md:p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                  <div className="text-2xl md:text-3xl font-bold text-primary">{completedPrompts}</div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-1">Answered</div>
                </div>
                <div className="text-center p-3 md:p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg">
                  <div className="text-2xl md:text-3xl font-bold text-secondary">{wordCount}</div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-1">Words</div>
                </div>
                <div className="text-center p-3 md:p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg col-span-2">
                  <div className="text-2xl md:text-3xl font-bold text-accent">{characterCount}</div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-1">Characters of Insight</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Completion</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-1.5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Navigation */}
        <div className="flex justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            Skip to Dashboard
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
        
        {/* Auto-save Notice */}
        <div className="text-center text-xs text-muted-foreground pt-4 border-t">
          <p>💡 Your responses are automatically saved as you type.</p>
          <p className="mt-1">Click "Save Reflection" to complete and view your insights.</p>
        </div>
      </div>
    </div>
  );
}