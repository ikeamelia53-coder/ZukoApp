import { motion } from "motion/react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";
import {
  Smile,
  Calendar,
  TrendingUp,
  Heart,
  Brain,
  BookOpen,
  Wind,
  MessageCircle,
  Activity,
  User,
  Target,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

import { useAuthStore } from "@lib/auth";

const activities = [
  { icon: Smile, label: "Mood Tracker", path: "/mood-tracker", color: "bg-primary", description: "Track your daily emotions" },
  { icon: MessageCircle, label: "Consultation", path: "/consultation", color: "bg-secondary", description: "Talk to professionals" },
  { icon: Wind, label: "Breathing", path: "/breathing", color: "bg-accent", description: "Relaxation exercises" },
  { icon: BookOpen, label: "Self Reflection", path: "/reflection", color: "bg-chart-1", description: "Journal your thoughts" },
  { icon: Brain, label: "Articles", path: "/articles", color: "bg-chart-2", description: "Learn about mental health" },
  { icon: TrendingUp, label: "Statistics", path: "/statistics", color: "bg-chart-3", description: "View your progress" },
];

// Motivational quotes array
const motivationalQuotes = [
  {
    quote: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela",
    emoji: "🌟"
  },
  {
    quote: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
    author: "",
    emoji: "💖"
  },
  {
    quote: "It's okay not to be okay. What's important is that you don't give up.",
    author: "",
    emoji: "🤗"
  },
  {
    quote: "Every day is a fresh start. Each sunrise is a new chapter waiting to be written.",
    author: "",
    emoji: "🌅"
  },
  {
    quote: "The journey of self-discovery is the most rewarding journey you'll ever take.",
    author: "",
    emoji: "🧭"
  },
  {
    quote: "You are stronger than you think, more capable than you imagine, and worthy of all the good things.",
    author: "",
    emoji: "💪"
  },
];

// Helper function to get mood emoji based on score
const getMoodEmoji = (score: number) => {
  if (score >= 80) return { emoji: "😊", label: "Excellent" };
  if (score >= 60) return { emoji: "🙂", label: "Good" };
  if (score >= 40) return { emoji: "😐", label: "Neutral" };
  if (score >= 20) return { emoji: "😔", label: "Low" };
  return { emoji: "😢", label: "Very Low" };
};

// Helper function to calculate weekly data from mood entries
const calculateWeeklyData = (moodEntries: any[]) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  
  // Initialize weekly data with default values
  const weeklyData = days.map(day => ({
    day,
    mood: 0,
    hasData: false
  }));

  // Get mood entries from last 7 days
  const lastWeekEntries = moodEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    const diffTime = today.getTime() - entryDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 7;
  });

  // Group entries by day
  lastWeekEntries.forEach(entry => {
    const entryDate = new Date(entry.date);
    const dayIndex = entryDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayName = days[dayIndex];
    
    const dayData = weeklyData.find(d => d.day === dayName);
    if (dayData) {
      // Convert score (0-100) to mood level (1-5)
      dayData.mood = Math.round(entry.score / 20);
      dayData.hasData = true;
    }
  });

  // Fill missing days with average of available data
  const daysWithData = weeklyData.filter(d => d.hasData);
  const averageMood = daysWithData.length > 0 
    ? Math.round(daysWithData.reduce((sum, d) => sum + d.mood, 0) / daysWithData.length)
    : 3; // Default neutral mood

  weeklyData.forEach(day => {
    if (!day.hasData) {
      day.mood = averageMood;
    }
  });

  return weeklyData;
};

// Helper function to get recent activities
const getRecentActivities = (userData: any) => {
  const activities = [];
  const today = new Date();
  const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Mood entries
  const recentMoods = userData?.moodEntries
    ?.filter((entry: any) => new Date(entry.date) >= oneWeekAgo)
    .slice(0, 3)
    .map((entry: any) => ({
      type: 'mood',
      emoji: entry.feeling === 'positive' ? '😊' : '😔',
      title: `${entry.mood}`,
      description: `${entry.activities?.slice(0, 2).join(', ') || 'No activities'}`,
      date: new Date(entry.date).toLocaleDateString(),
      score: entry.score,
    })) || [];

  // Consultations
  const recentConsultations = userData?.consultations
    ?.filter((consult: any) => new Date(consult.date) >= oneWeekAgo)
    .slice(0, 2)
    .map((consult: any) => ({
      type: 'consultation',
      emoji: '💬',
      title: `Talk with Dr. ${consult.doctor?.split(' ')[1] || 'Professional'}`,
      description: `${consult.type} consultation`,
      date: new Date(consult.date).toLocaleDateString(),
      status: consult.status,
    })) || [];

  // Breathing sessions
  const recentBreathing = userData?.breathingSessions
    ?.filter((session: any) => new Date(session.date) >= oneWeekAgo)
    .slice(0, 2)
    .map((session: any) => ({
      type: 'breathing',
      emoji: '🌬️',
      title: `${session.exercise}`,
      description: `${session.cycles} cycles • ${Math.round(session.duration / 60)}min`,
      date: new Date(session.date).toLocaleDateString(),
    })) || [];

  // Reflections
  const recentReflections = userData?.reflections
    ?.filter((reflection: any) => new Date(reflection.date) >= oneWeekAgo)
    .slice(0, 2)
    .map((reflection: any) => ({
      type: 'reflection',
      emoji: '📝',
      title: 'Self Reflection',
      description: `${reflection.wordCount} words • ${reflection.characterCount} chars`,
      date: new Date(reflection.date).toLocaleDateString(),
    })) || [];

  // Combine and sort by date
  return [...recentMoods, ...recentConsultations, ...recentBreathing, ...recentReflections]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);
};

export function Dashboard() {
  const { user, userData } = useAuthStore();
  const [randomQuote, setRandomQuote] = useState(motivationalQuotes[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user data
    const loadUserData = () => {
      setIsLoading(true);

      // Select random quote
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      setRandomQuote(motivationalQuotes[randomIndex]);

      setIsLoading(false);
    };

    loadUserData();

    // Listen for storage changes (if user updates data in another tab)
    const handleStorageChange = () => {
      loadUserData();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Calculate statistics
  const totalMoodEntries = userData?.moodEntries?.length || 0;
  const totalConsultations = userData?.consultations?.length || 0;
  const totalBreathingSessions = userData?.breathingSessions?.length || 0;
  const totalReflections = userData?.reflections?.length || 0;
  const totalEntries = totalMoodEntries + totalConsultations + totalBreathingSessions + totalReflections;

  // Calculate average mood score
  const averageMoodScore = userData?.moodEntries?.length > 0
    ? Math.round(userData.moodEntries.reduce((sum: number, entry: any) => sum + entry.score, 0) / userData.moodEntries.length)
    : 85; // Default score

  // Calculate streak (consecutive days with mood entries)
  const streak = userData?.statistics?.streak || 0;

  // Get weekly data
  const weeklyData = calculateWeeklyData(userData?.moodEntries || []);
  
  // Get recent activities
  const recentActivities = getRecentActivities(userData);
  
  // Get today's mood emoji
  const todayMood = getMoodEmoji(averageMoodScore);

  // Get last activity date
  const lastActivityDate = userData?.statistics?.lastActivity 
    ? new Date(userData.statistics.lastActivity).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      })
    : 'No recent activity';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading your wellness data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 pb-20 md:pb-6">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        {/* Greeting Section with User Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl">
            Hi, {user?.name || "Friend"} 👋
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {totalEntries > 0 
              ? `You have ${totalEntries} wellness entries. Keep up the great work!`
              : "How are you feeling today? Start tracking your wellness journey."}
          </p>
        </motion.div>

        {/* Today's Mood Summary with Real Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Heart className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                Today's Wellness Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm md:text-base">
                  <span>Overall Mood Score</span>
                  <span className="font-medium">{averageMoodScore}%</span>
                </div>
                <Progress value={averageMoodScore} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Based on {totalMoodEntries} mood entries
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pt-2">
                <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="text-2xl md:text-3xl mb-1">{todayMood.emoji}</div>
                  <p className="text-xs md:text-sm font-medium">{todayMood.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">Current Mood</p>
                </div>
                <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="text-2xl md:text-3xl mb-1">🔥</div>
                  <p className="text-xs md:text-sm font-medium">{streak} days</p>
                  <p className="text-xs text-muted-foreground mt-1">Streak</p>
                </div>
                <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="text-2xl md:text-3xl mb-1">💬</div>
                  <p className="text-xs md:text-sm font-medium">{totalConsultations}</p>
                  <p className="text-xs text-muted-foreground mt-1">Consultations</p>
                </div>
                <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="text-2xl md:text-3xl mb-1">📊</div>
                  <p className="text-xs md:text-sm font-medium">{totalEntries}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total Entries</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Mood Preview with Real Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Calendar className="h-5 w-5 md:h-6 md:w-6 text-secondary" />
                  {totalMoodEntries > 0 ? "Your Weekly Mood" : "Weekly Mood Preview"}
                </CardTitle>
                <Link to="/statistics">
                  <Button variant="ghost" size="sm" className="text-xs md:text-sm">
                    View Details
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-1 md:gap-2 h-32 mb-4">
                {weeklyData.map((data, index) => (
                  <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className={`w-full rounded-lg origin-bottom transition-all duration-300 ${
                        data.hasData 
                          ? 'bg-gradient-to-t from-primary to-secondary' 
                          : 'bg-gradient-to-t from-muted to-muted/50'
                      }`}
                      style={{ height: `${data.mood * 20}%` }}
                    />
                    <div className="text-center">
                      <span className="text-xs text-muted-foreground">{data.day}</span>
                      {data.hasData && (
                        <div className="text-xs text-primary font-medium mt-1">
                          {data.mood}/5
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary"></div>
                  <span>Mood Level</span>
                </div>
                <span>1 = Low, 5 = High</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activities Section */}
        {recentActivities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-xl md:text-2xl flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Activities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={`${activity.type}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-all cursor-pointer h-full">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                          {activity.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h3 className="font-medium text-sm md:text-base truncate">
                              {activity.title}
                            </h3>
                            {activity.score && (
                              <Badge className="ml-2 bg-primary/20 text-primary border-0">
                                {activity.score}%
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {activity.description}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">
                              {activity.date}
                            </span>
                            {activity.status && (
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  activity.status === 'completed' 
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : 'bg-blue-50 text-blue-700 border-blue-200'
                                }`}
                              >
                                {activity.status}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl md:text-2xl flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to={activity.path}>
                  <Card className="hover:shadow-lg transition-all cursor-pointer group h-full border-2 border-transparent hover:border-primary/20">
                    <CardContent className="p-4 md:p-6 flex flex-col items-center gap-3 text-center">
                      <div className={`${activity.color} p-3 md:p-4 rounded-2xl text-white transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                        <activity.icon className="h-5 w-5 md:h-6 md:w-6" />
                      </div>
                      <div>
                        <span className="text-xs md:text-sm font-medium block">
                          {activity.label}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1 hidden md:block">
                          {activity.description}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Wellness Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Target className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                Your Wellness Journey
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary">
                    {totalMoodEntries}
                  </div>
                  <p className="text-sm text-muted-foreground">Mood Entries</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-secondary">
                    {totalConsultations}
                  </div>
                  <p className="text-sm text-muted-foreground">Consultations</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-accent">
                    {totalBreathingSessions}
                  </div>
                  <p className="text-sm text-muted-foreground">Breathing Sessions</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-chart-1">
                    {totalReflections}
                  </div>
                  <p className="text-sm text-muted-foreground">Reflections</p>
                </div>
              </div>
              
              {totalEntries === 0 && (
                <div className="mt-4 p-4 bg-primary/5 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">
                    Start your wellness journey today! Track your first mood or try a breathing exercise.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Motivational Quote with User Context */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-accent/20 to-primary/20 border-accent/30 shadow-lg">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="text-3xl">{randomQuote.emoji}</div>
                <div className="flex-1">
                  <p className="italic text-foreground/80 text-base md:text-lg">
                    "{randomQuote.quote}"
                  </p>
                  {randomQuote.author && (
                    <p className="text-sm md:text-base text-muted-foreground mt-2">
                      — {randomQuote.author}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-xs text-muted-foreground">
                      Last activity: {lastActivityDate}
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
                        setRandomQuote(motivationalQuotes[randomIndex]);
                      }}
                    >
                      New Quote
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Welcome Message for New Users */}
        {totalEntries === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-lg md:text-xl font-medium mb-2">
                  Welcome to ZUKO, {user?.name || "Friend"}!
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start your mental wellness journey today. Track your mood, try breathing exercises, or schedule a consultation.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/mood-tracker">
                    <Button className="bg-primary hover:bg-primary/90">
                      <Smile className="h-4 w-4 mr-2" />
                      Track First Mood
                    </Button>
                  </Link>
                  <Link to="/breathing">
                    <Button variant="outline">
                      <Wind className="h-4 w-4 mr-2" />
                      Try Breathing Exercise
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Badge component for internal use
function Badge({ 
  children, 
  className = "", 
  variant = "default" 
}: { 
  children: React.ReactNode, 
  className?: string,
  variant?: "default" | "outline" 
}) {
  const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  
  const variantStyles = {
    default: "bg-primary text-primary-foreground",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}