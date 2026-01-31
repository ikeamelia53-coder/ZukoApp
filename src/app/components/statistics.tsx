import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { ArrowLeft, TrendingUp, Calendar, Brain, Activity, Target, Zap, Heart, RefreshCw } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useEffect, useState } from "react";

// Helper functions untuk localStorage
const getUserData = () => {
  if (typeof window !== 'undefined') {
    const dataStr = localStorage.getItem('zuko_user_data');
    return dataStr ? JSON.parse(dataStr) : null;
  }
  return null;
};

// Helper function untuk menghitung weekly mood data dari mood entries
const calculateWeeklyMoodData = (moodEntries: any[]) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date();
  
  // Initialize weekly data
  const weeklyData = days.map(day => ({
    date: day,
    positive: 0,
    negative: 0,
    total: 0
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
    // Adjust for our array (Monday = 0)
    const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
    const dayName = days[adjustedIndex];
    
    const dayData = weeklyData.find(d => d.date === dayName);
    if (dayData) {
      if (entry.feeling === 'positive') {
        dayData.positive += 1;
      } else {
        dayData.negative += 1;
      }
      dayData.total += 1;
    }
  });

  return weeklyData;
};

// Helper function untuk menghitung monthly mood data
const calculateMonthlyMoodData = (moodEntries: any[]) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const today = new Date();
  
  // Get last 6 months
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const month = new Date();
    month.setMonth(today.getMonth() - i);
    const monthName = months[month.getMonth()];
    
    // Filter entries for this month
    const monthEntries = moodEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getMonth() === month.getMonth() && 
             entryDate.getFullYear() === month.getFullYear();
    });
    
    // Calculate average score for the month
    const avgScore = monthEntries.length > 0 
      ? monthEntries.reduce((sum, entry) => sum + entry.score, 0) / monthEntries.length
      : 0;
    
    monthlyData.push({
      month: monthName,
      score: Math.round(avgScore),
      entries: monthEntries.length
    });
  }
  
  return monthlyData;
};

// Helper function untuk menghitung activity distribution
const calculateActivityData = (moodEntries: any[]) => {
  const activityCounts: Record<string, number> = {};
  
  moodEntries.forEach(entry => {
    entry.activities.forEach((activity: string) => {
      activityCounts[activity] = (activityCounts[activity] || 0) + 1;
    });
  });
  
  const activityData = Object.entries(activityCounts)
    .map(([activity, count]) => ({ activity, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8); // Top 8 activities
  
  return activityData;
};

// Helper function untuk feeling distribution pie chart
const calculateFeelingData = (moodEntries: any[]) => {
  const feelingCounts: Record<string, number> = {
    positive: 0,
    negative: 0
  };
  
  moodEntries.forEach(entry => {
    if (entry.feeling === 'positive' || entry.feeling === 'negative') {
      feelingCounts[entry.feeling] = (feelingCounts[entry.feeling] || 0) + 1;
    }
  });
  
  return [
    { name: "Positive", value: feelingCounts.positive, color: "#4ADE80" },
    { name: "Negative", value: feelingCounts.negative, color: "#F87171" }
  ];
};

// Helper function untuk mood type distribution
const calculateMoodTypeData = (moodEntries: any[]) => {
  const moodTypeCounts: Record<string, number> = {};
  
  moodEntries.forEach(entry => {
    moodTypeCounts[entry.mood] = (moodTypeCounts[entry.mood] || 0) + 1;
  });
  
  const moodTypeData = Object.entries(moodTypeCounts)
    .map(([mood, count]) => ({ mood, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6); // Top 6 moods
  
  return moodTypeData;
};

// Helper function untuk generate AI insights
const generateInsights = (userData: any) => {
  const insights = [];
  const moodEntries = userData?.moodEntries || [];
  
  if (moodEntries.length === 0) {
    return [
      {
        icon: "📊",
        title: "Start Tracking Your Mood",
        description: "Track your first mood to see personalized insights and patterns."
      },
      {
        icon: "🎯",
        title: "Set Wellness Goals",
        description: "Begin your mental wellness journey with daily mood tracking."
      }
    ];
  }
  
  // Insight 1: Mood trends
  const positiveEntries = moodEntries.filter((entry: any) => entry.feeling === 'positive');
  const negativeEntries = moodEntries.filter((entry: any) => entry.feeling === 'negative');
  const positivityRate = Math.round((positiveEntries.length / moodEntries.length) * 100);
  
  if (positivityRate >= 70) {
    insights.push({
      icon: "🌟",
      title: "High Positivity Rate",
      description: `You have ${positivityRate}% positive mood entries. Keep up the positive mindset!`
    });
  } else if (positivityRate <= 30) {
    insights.push({
      icon: "🤝",
      title: "Opportunity for Support",
      description: `Consider talking to a professional. You have ${100 - positivityRate}% entries needing attention.`
    });
  }
  
  // Insight 2: Activity correlation
  const entriesWithExercise = moodEntries.filter((entry: any) => 
    entry.activities.includes("Exercise")
  );
  if (entriesWithExercise.length > 0) {
    const exercisePositiveRate = Math.round(
      (entriesWithExercise.filter((e: any) => e.feeling === 'positive').length / entriesWithExercise.length) * 100
    );
    insights.push({
      icon: "💪",
      title: "Exercise Boosts Mood",
      description: `You're ${exercisePositiveRate}% more likely to have positive moods on exercise days.`
    });
  }
  
  // Insight 3: Consistency
  const totalEntries = moodEntries.length;
  const consultations = userData?.consultations?.length || 0;
  const breathingSessions = userData?.breathingSessions?.length || 0;
  const reflections = userData?.reflections?.length || 0;
  
  if (totalEntries >= 10) {
    insights.push({
      icon: "📈",
      title: "Consistent Tracking",
      description: `Great consistency! You have ${totalEntries} total wellness entries.`
    });
  }
  
  // Insight 4: Overall wellness balance
  const totalActivities = totalEntries + consultations + breathingSessions + reflections;
  const wellnessBalance = Math.round((totalEntries / totalActivities) * 100);
  
  insights.push({
    icon: "⚖️",
    title: "Wellness Balance",
    description: `Your tracking includes ${totalEntries} moods, ${consultations} consultations, ${breathingSessions} breathing sessions, and ${reflections} reflections.`
  });
  
  return insights.slice(0, 3); // Return top 3 insights
};

export function Statistics() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("weekly");
  
  // Chart data states
  const [weeklyMoodData, setWeeklyMoodData] = useState<any[]>([]);
  const [monthlyMoodData, setMonthlyMoodData] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);
  const [feelingData, setFeelingData] = useState<any[]>([]);
  const [moodTypeData, setMoodTypeData] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  
  // Statistics states
  const [averageMood, setAverageMood] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [streak, setStreak] = useState(0);
  const [positivityRate, setPositivityRate] = useState(0);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    setIsLoading(true);
    const data = getUserData();
    setUserData(data);
    
    if (data) {
      const moodEntries = data.moodEntries || [];
      const consultations = data.consultations || [];
      const breathingSessions = data.breathingSessions || [];
      const reflections = data.reflections || [];
      
      // Calculate statistics
      const totalMoodScore = moodEntries.reduce((sum: number, entry: any) => sum + entry.score, 0);
      const avgMood = moodEntries.length > 0 ? Math.round(totalMoodScore / moodEntries.length) : 0;
      const positiveEntries = moodEntries.filter((entry: any) => entry.feeling === 'positive');
      const positivity = moodEntries.length > 0 ? Math.round((positiveEntries.length / moodEntries.length) * 100) : 0;
      const total = moodEntries.length + consultations.length + breathingSessions.length + reflections.length;
      const currentStreak = data.statistics?.streak || 0;
      
      setAverageMood(avgMood);
      setTotalEntries(total);
      setStreak(currentStreak);
      setPositivityRate(positivity);
      
      // Calculate chart data
      setWeeklyMoodData(calculateWeeklyMoodData(moodEntries));
      setMonthlyMoodData(calculateMonthlyMoodData(moodEntries));
      setActivityData(calculateActivityData(moodEntries));
      setFeelingData(calculateFeelingData(moodEntries));
      setMoodTypeData(calculateMoodTypeData(moodEntries));
      setInsights(generateInsights(data));
    }
    
    setIsLoading(false);
  };

  const handleRefresh = () => {
    loadUserData();
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading your statistics...</p>
        </div>
      </div>
    );
  }

  const hasData = userData?.moodEntries?.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 pb-20 md:pb-6">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="flex-shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl">Statistics & Insights</h1>
              <p className="text-sm md:text-base text-muted-foreground">
                {hasData 
                  ? "Track your mental wellness journey with real data"
                  : "Start tracking to see your statistics"
                }
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="flex-shrink-0"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Summary Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 hover:shadow-lg transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground">Average Mood</p>
                    <p className="text-2xl md:text-3xl font-bold mt-1">{averageMood}%</p>
                    <p className="text-xs mt-2">
                      {userData?.moodEntries?.length || 0} mood entries
                    </p>
                  </div>
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                </div>
                {hasData && (
                  <div className="mt-3 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                      style={{ width: `${averageMood}%` }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 hover:shadow-lg transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground">Total Entries</p>
                    <p className="text-2xl md:text-3xl font-bold mt-1">{totalEntries}</p>
                    <p className="text-xs mt-2">All wellness activities</p>
                  </div>
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 md:h-6 md:w-6 text-secondary" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                  <span>Moods: {userData?.moodEntries?.length || 0}</span>
                  <span>•</span>
                  <span>Consults: {userData?.consultations?.length || 0}</span>
                  <span>•</span>
                  <span>Breathing: {userData?.breathingSessions?.length || 0}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-accent/10 to-accent/5 hover:shadow-lg transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground">Current Streak</p>
                    <p className="text-2xl md:text-3xl font-bold mt-1">{streak} days</p>
                    <p className="text-xs mt-2">Consistent tracking</p>
                  </div>
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-accent/20 flex items-center justify-center text-xl md:text-2xl flex-shrink-0">
                    🔥
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {streak > 0 ? "Keep it up!" : "Start your streak today!"}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 hover:shadow-lg transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground">Positivity Rate</p>
                    <p className="text-2xl md:text-3xl font-bold mt-1">{positivityRate}%</p>
                    <p className="text-xs mt-2">Positive mood entries</p>
                  </div>
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Heart className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                  </div>
                </div>
                {hasData && positivityRate > 0 && (
                  <div className="mt-3 text-xs">
                    <span className="text-green-600">
                      {Math.round((positivityRate / 100) * (userData?.moodEntries?.length || 0))} positive entries
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Section */}
        {hasData ? (
          <>
            <Tabs defaultValue="weekly" className="space-y-4" onValueChange={setActiveTab}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <TabsList className="grid w-full sm:w-auto grid-cols-3">
                  <TabsTrigger value="weekly" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Weekly
                  </TabsTrigger>
                  <TabsTrigger value="monthly" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Monthly
                  </TabsTrigger>
                  <TabsTrigger value="activities" className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Activities
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-full bg-primary"></div>
                    <span>Positive</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <span>Negative</span>
                  </div>
                </div>
              </div>

              <TabsContent value="weekly" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Mood Trend - This Week
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Daily mood patterns based on your entries
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={weeklyMoodData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 184, 230, 0.2)" />
                        <XAxis dataKey="date" stroke="#A8B8E6" />
                        <YAxis stroke="#A8B8E6" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #E8EDF5",
                            borderRadius: "8px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="positive"
                          stroke="#4ADE80"
                          strokeWidth={3}
                          dot={{ fill: "#4ADE80", r: 5 }}
                          name="Positive"
                        />
                        <Line
                          type="monotone"
                          dataKey="negative"
                          stroke="#F87171"
                          strokeWidth={3}
                          dot={{ fill: "#F87171", r: 5 }}
                          name="Negative"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-secondary" />
                      Positive vs Negative Feelings
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Comparison of positive and negative mood entries
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={weeklyMoodData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 184, 230, 0.2)" />
                            <XAxis dataKey="date" stroke="#A8B8E6" />
                            <YAxis stroke="#A8B8E6" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #E8EDF5",
                                borderRadius: "8px",
                              }}
                            />
                            <Bar dataKey="positive" fill="#4ADE80" radius={[8, 8, 0, 0]} name="Positive" />
                            <Bar dataKey="negative" fill="#F87171" radius={[8, 8, 0, 0]} name="Negative" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div>
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={feelingData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={(entry) => `${entry.name}: ${entry.value}`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {feelingData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #E8EDF5",
                                borderRadius: "8px",
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="text-center text-sm text-muted-foreground mt-2">
                          Feeling Distribution
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="monthly" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Mood Score - Last 6 Months
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Monthly average mood scores and entry counts
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlyMoodData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 184, 230, 0.2)" />
                        <XAxis dataKey="month" stroke="#A8B8E6" />
                        <YAxis stroke="#A8B8E6" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #E8EDF5",
                            borderRadius: "8px",
                          }}
                          formatter={(value, name) => {
                            if (name === "score") return [`${value}%`, "Mood Score"];
                            if (name === "entries") return [value, "Entries"];
                            return [value, name];
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="#A8B8E6"
                          strokeWidth={3}
                          dot={{ fill: "#A8B8E6", r: 5 }}
                          name="Mood Score"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-secondary" />
                        Top Mood Types
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Most frequently logged moods
                      </p>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={moodTypeData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 184, 230, 0.2)" />
                          <XAxis dataKey="mood" stroke="#A8B8E6" />
                          <YAxis stroke="#A8B8E6" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #E8EDF5",
                              borderRadius: "8px",
                            }}
                          />
                          <Bar dataKey="count" fill="#8884d8" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-accent" />
                        Monthly Activity
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Mood entries per month
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {monthlyMoodData.map((month) => (
                          <div key={month.month} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{month.month}</span>
                              <span>{month.entries} entries • {month.score}% avg</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                                style={{ width: `${Math.min(100, (month.entries / 30) * 100)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="activities" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      Activity Distribution
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Most common activities during mood tracking
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={activityData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 184, 230, 0.2)" />
                            <XAxis type="number" stroke="#A8B8E6" />
                            <YAxis dataKey="activity" type="category" stroke="#A8B8E6" width={80} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #E8EDF5",
                                borderRadius: "8px",
                              }}
                            />
                            <Bar dataKey="count" fill="#A8B8E6" radius={[0, 8, 8, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div>
                        <div className="space-y-4">
                          <h4 className="font-medium">Activity Insights</h4>
                          <div className="space-y-3">
                            {activityData.slice(0, 4).map((activity, index) => (
                              <div key={activity.activity} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                                    {index + 1}
                                  </div>
                                  <span className="font-medium">{activity.activity}</span>
                                </div>
                                <div className="text-primary font-bold">{activity.count} times</div>
                              </div>
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Based on {userData?.moodEntries?.length || 0} mood entries
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-secondary" />
                      Wellness Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-primary/5 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {userData?.moodEntries?.length || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Mood Entries</div>
                      </div>
                      <div className="text-center p-4 bg-secondary/5 rounded-lg">
                        <div className="text-2xl font-bold text-secondary">
                          {userData?.consultations?.length || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Consultations</div>
                      </div>
                      <div className="text-center p-4 bg-accent/5 rounded-lg">
                        <div className="text-2xl font-bold text-accent">
                          {userData?.breathingSessions?.length || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Breathing Sessions</div>
                      </div>
                      <div className="text-center p-4 bg-green-500/5 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {userData?.reflections?.length || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Reflections</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Insights */}
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Personalized Insights
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Based on your wellness data
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg"
                  >
                    <div className="text-2xl">{insight.icon}</div>
                    <div className="flex-1">
                      <p className="font-medium">{insight.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {insight.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </>
        ) : (
          /* Empty State */
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardContent className="p-8 text-center space-y-6">
              <div className="text-6xl">📊</div>
              <div>
                <h3 className="text-xl font-medium mb-2">No Data Yet</h3>
                <p className="text-muted-foreground">
                  Start tracking your mood, consultations, and activities to see personalized statistics and insights.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => navigate("/mood-tracker")} className="bg-primary hover:bg-primary/90">
                  Track First Mood
                </Button>
                <Button variant="outline" onClick={() => navigate("/dashboard")}>
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats Summary */}
        {hasData && (
          <Card>
            <CardHeader>
              <CardTitle>Your Wellness Summary</CardTitle>
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Mood Entries</p>
                  <p className="text-lg font-bold">{userData?.moodEntries?.length || 0}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Avg Mood Score</p>
                  <p className="text-lg font-bold text-primary">{averageMood}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Positivity Rate</p>
                  <p className="text-lg font-bold text-green-600">{positivityRate}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Current Streak</p>
                  <p className="text-lg font-bold text-orange-600">{streak} days</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Keep tracking to see more detailed insights and patterns in your mental wellness journey.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}