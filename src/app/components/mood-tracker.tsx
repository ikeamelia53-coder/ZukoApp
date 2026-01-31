import { motion, useAnimation } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from "@/app/components/ui/badge";
import { ArrowLeft, Save, CheckCircle2, Loader2 } from "lucide-react";

const moodTypes = {
  positive: [
    { emoji: "😁", label: "Happy", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", size: "large" },
    { emoji: "☺️", label: "Calm", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", size: "medium" },
    { emoji: "🤩", label: "Excited", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200", size: "small" },
    { emoji: "😇", label: "Grateful", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", size: "large" },
    { emoji: "😉", label: "Joyful", color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200", size: "medium" },
    { emoji: "💗", label: "Loved", color: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200", size: "small" },
    { emoji: "😎", label: "Confident", color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200", size: "large" },
    { emoji: "🤗", label: "Content", color: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200", size: "medium" },
    { emoji: "✨", label: "Inspired", color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200", size: "small" },
    { emoji: "🌟", label: "Amazing", color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200", size: "large" },
    { emoji: "💪", label: "Energized", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200", size: "medium" },
    { emoji: "🧘‍♀️", label: "Peaceful", color: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200", size: "small" },
    { emoji: "🎇", label: "Celebratory", color: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-200", size: "large" },
    { emoji: "🌻", label: "Hopeful", color: "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200", size: "medium" },
    { emoji: "🌈", label: "Optimistic", color: "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200", size: "small" },
  ],
  negative: [
    { emoji: "☹️", label: "Sad", color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200", size: "large" },
    { emoji: "😰", label: "Anxious", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200", size: "medium" },
    { emoji: "😡", label: "Angry", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", size: "small" },
    { emoji: "😪", label: "Tired", color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200", size: "large" },
    { emoji: "🥲", label: "Tearful", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", size: "medium" },
    { emoji: "😖", label: "Frustrated", color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200", size: "small" },
    { emoji: "☹️", label: "Worried", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", size: "large" },
    { emoji: "😫", label: "Stressed", color: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200", size: "medium" },
    { emoji: "😞", label: "Disappointed", color: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200", size: "small" },
    { emoji: "😵‍💫", label: "Overwhelmed", color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200", size: "large" },
    { emoji: "🥴", label: "Exhausted", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200", size: "medium" },
    { emoji: "😤", label: "Irritated", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", size: "small" },
    { emoji: "😑", label: "Numb", color: "bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200", size: "large" },
    { emoji: "😶", label: "Confused", color: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200", size: "medium" },
    { emoji: "💔", label: "Heartbroken", color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200", size: "small" },
  ],
};

const activities = [
  { label: "Work", icon: "💼" },
  { label: "Study", icon: "📚" },
  { label: "Exercise", icon: "🏃" },
  { label: "Rest", icon: "😴" },
  { label: "Socializing", icon: "👥" },
  { label: "Hobbies", icon: "🎨" },
  { label: "Family Time", icon: "👨‍👩‍👧‍👦" },
  { label: "Self Care", icon: "💆" },
];

// POSISI NATURAL (tidak berjejer, tersebar seperti awan/kluster)
const NATURAL_POSITIONS = [
  // Cluster tengah atas
  { left: 45, top: 25 },   // Happy
  { left: 55, top: 20 },   // Calm
  { left: 35, top: 30 },   // Excited
  
  // Cluster kiri tengah
  { left: 25, top: 45 },   // Grateful
  { left: 30, top: 55 },   // Joyful
  { left: 15, top: 50 },   // Loved
  
  // Cluster kanan tengah
  { left: 75, top: 40 },   // Confident
  { left: 85, top: 45 },   // Content
  { left: 70, top: 55 },   // Inspired
  
  // Cluster bawah kiri
  { left: 40, top: 70 },   // Amazing
  { left: 50, top: 75 },   // Energized
  { left: 35, top: 80 },   // Peaceful
  
  // Cluster bawah kanan
  { left: 65, top: 65 },   // Celebratory
  { left: 75, top: 70 },   // Hopeful
  { left: 60, top: 75 },   // Optimistic
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

// Helper function untuk menghitung mood score
const calculateMoodScore = (feeling: "positive" | "negative" | null, selectedActivities: string[], notes: string): number => {
  let baseScore = feeling === "positive" ? 80 : 40;
  let activityBonus = selectedActivities.length * 5;
  let noteBonus = notes.length > 50 ? 10 : notes.length > 20 ? 5 : 0;
  return Math.min(100, baseScore + activityBonus + noteBonus);
};

// Helper function untuk menghitung streak
const calculateStreak = (moodEntries: any[]) => {
  if (moodEntries.length === 0) return 0;
  
  // Sort entries by date (newest first)
  const sortedEntries = [...moodEntries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let streak = 0;
  let currentDate = new Date();
  
  for (let i = 0; i < sortedEntries.length; i++) {
    const entryDate = new Date(sortedEntries[i].date);
    const diffDays = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === streak) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

// Floating Bubble Component dengan animasi STANDAR (tidak terlalu cepat/lambat)
function FloatingBubble({ 
  mood, 
  index, 
  onClick, 
  isSelected 
}: { 
  mood: typeof moodTypes.positive[0], 
  index: number, 
  onClick: () => void,
  isSelected: boolean 
}) {
  const controls = useAnimation();
  
  // Size mapping yang natural
  const sizeClasses = {
    small: "h-16 w-16 text-2xl md:h-18 md:w-18",
    medium: "h-20 w-20 text-3xl md:h-22 md:w-22",
    large: "h-24 w-24 text-4xl md:h-28 md:w-28",
  };

  // Generate STANDARD floating animation (kecepatan sedang)
  const generateStandardFloat = (idx: number) => {
    // Amplitudo sedang agar gerakan terlihat tapi tidak berlebihan
    const amplitude = 12 + Math.random() * 15;
    
    // DURASI STANDAR: 8-12 detik (tidak terlalu cepat, tidak terlalu lambat)
    const duration = 8 + Math.random() * 4;
    
    // Pattern yang natural dan smooth
    const angle = (idx * Math.PI * 2) / 15;
    const speedVariation = 0.8 + (idx % 5) * 0.1; // Sedikit variasi kecepatan
    
    return {
      x: [
        0,
        amplitude * Math.sin(angle * speedVariation),
        amplitude * Math.cos(angle * speedVariation * 1.4),
        amplitude * Math.sin(angle * speedVariation * 1.8),
        0
      ],
      y: [
        0,
        amplitude * Math.cos(angle * speedVariation * 0.9),
        amplitude * Math.sin(angle * speedVariation * 1.3),
        amplitude * Math.cos(angle * speedVariation * 1.6),
        0
      ],
      rotate: [0, 2, -1, 1, 0],
      transition: {
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.3, 0.6, 0.9, 1]
      }
    };
  };

  // Generate animation on mount
  const animation = generateStandardFloat(index);

  // Ambil posisi dari array NATURAL_POSITIONS
  const position = NATURAL_POSITIONS[index] || { left: 50, top: 50 };

  return (
    <motion.div
      animate={animation}
      whileHover={{ 
        scale: 1.2, 
        rotate: 0, 
        zIndex: 50,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
      className="absolute cursor-pointer z-10"
      style={{
        left: `${position.left}%`,
        top: `${position.top}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onClick={onClick}
    >
      <motion.div
        className={`${sizeClasses[mood.size as keyof typeof sizeClasses]} rounded-full ${mood.color} 
          flex flex-col items-center justify-center shadow-lg backdrop-blur-sm
          transition-all duration-300 ${isSelected ? 'ring-4 ring-primary shadow-2xl' : 'hover:shadow-xl'}
          border-2 border-white/20 hover:border-white/40`}
        animate={isSelected ? { 
          scale: [1, 1.15, 1],
          boxShadow: [
            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 2px var(--primary)",
            "0 20px 40px -10px rgba(0, 0, 0, 0.2), 0 0 0 4px var(--primary)",
            "0 15px 30px -7px rgba(0, 0, 0, 0.15), 0 0 0 3px var(--primary)"
          ]
        } : {}}
        transition={{ 
          duration: 0.5, 
          repeat: isSelected ? Infinity : 0,
        }}
      >
        <motion.span 
          className="mb-1"
          animate={isSelected ? { 
            scale: [1, 1.1, 1]
          } : {}}
          transition={{ duration: 0.5, repeat: isSelected ? Infinity : 0 }}
        >
          {mood.emoji}
        </motion.span>
        <span className="text-xs font-semibold px-1 text-center leading-tight">
          {mood.label}
        </span>
      </motion.div>
    </motion.div>
  );
}

export function MoodTracker() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [feeling, setFeeling] = useState<"positive" | "negative" | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Load current user
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('zuko_user');
      setCurrentUser(userStr ? JSON.parse(userStr) : null);
    }
  }, []);

  const handleSave = () => {
    if (!feeling || !selectedMood) {
      alert("Please select your mood first!");
      return;
    }

    setIsSaving(true);

    // Calculate mood score
    const moodScore = calculateMoodScore(feeling, selectedActivities, notes);

    // Create mood entry object
    const moodEntry = {
      id: `mood_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString(),
      mood: selectedMood,
      feeling,
      activities: selectedActivities,
      notes,
      score: moodScore,
      timestamp: Date.now(),
    };

    // Get current user data
    const currentData = getUserData();
    
    // Prepare updated data
    const updatedMoodEntries = [moodEntry, ...(currentData?.moodEntries || [])];
    
    // Calculate new statistics
    const totalMoodScore = updatedMoodEntries.reduce((sum, entry) => sum + entry.score, 0);
    const averageMood = Math.round(totalMoodScore / updatedMoodEntries.length);
    const streak = calculateStreak(updatedMoodEntries);
    
    const updatedData = {
      ...currentData,
      moodEntries: updatedMoodEntries,
      statistics: {
        ...currentData?.statistics,
        streak,
        totalEntries: (currentData?.statistics?.totalEntries || 0) + 1,
        averageMood,
        lastActivity: new Date().toISOString(),
      },
    };

    // Simulate API call delay
    setTimeout(() => {
      // Save to localStorage
      updateUserData(updatedData);
      
      // Show success animation
      setSaveSuccess(true);
      
      setTimeout(() => {
        setIsSaving(false);
        navigate("/dashboard");
      }, 1500);
    }, 1000);
  };

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev =>
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const handleMoodSelect = (moodLabel: string) => {
    setSelectedMood(moodLabel);
    setTimeout(() => {
      setStep(3);
    }, 500);
  };

  // Reset jika user kembali ke step sebelumnya
  const handleBackToFeeling = () => {
    setFeeling(null);
    setSelectedMood(null);
    setSelectedActivities([]);
    setNotes("");
    setStep(1);
  };

  // Reset jika user kembali ke mood selection
  const handleBackToMood = () => {
    setSelectedMood(null);
    setSelectedActivities([]);
    setNotes("");
    setStep(2);
  };

  // Reset jika user kembali ke activities
  const handleBackToActivities = () => {
    setSelectedActivities([]);
    setNotes("");
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 overflow-hidden">
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl">Daily Mood Journal</h1>
            <p className="text-sm text-muted-foreground">
              Step {step} of 4 • {currentUser?.name ? `Welcome, ${currentUser.name}` : 'Track your mood'}
            </p>
          </div>
        </div>

        {/* Success Animation Overlay */}
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center max-w-md mx-4 shadow-2xl"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">Mood Saved!</h3>
              <p className="text-muted-foreground mb-6">
                Your mood entry has been saved successfully.
              </p>
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 mb-6">
                <div className="text-lg font-medium mb-2">{selectedMood}</div>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary" className="capitalize">{feeling}</Badge>
                  <Badge>{selectedMood}</Badge>
                  {selectedActivities.slice(0, 3).map(activity => (
                    <Badge key={activity} variant="outline">{activity}</Badge>
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Redirecting to dashboard...
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Step 1: Choose Feeling Type */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>How are you feeling today?</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Select the general category that matches your current emotional state
                </p>
              </CardHeader>
              <CardContent className="grid gap-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    className="h-auto py-8 text-lg justify-start gap-4 hover:bg-primary/10 border-2 w-full"
                    onClick={() => {
                      setFeeling("positive");
                      setStep(2);
                    }}
                  >
                    <div className="text-4xl">😊</div>
                    <div className="text-left">
                      <div className="font-medium">Positive Feeling</div>
                      <div className="text-sm text-muted-foreground">
                        Happy, grateful, excited, inspired, hopeful
                      </div>
                    </div>
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    className="h-auto py-8 text-lg justify-start gap-4 hover:bg-accent/10 border-2 w-full"
                    onClick={() => {
                      setFeeling("negative");
                      setStep(2);
                    }}
                  >
                    <div className="text-4xl">😔</div>
                    <div className="text-left">
                      <div className="font-medium">Negative Feeling</div>
                      <div className="text-sm text-muted-foreground">
                        Sad, anxious, stressed, tired, overwhelmed
                      </div>
                    </div>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
            
            {/* Quick Stats */}
            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Your Mood History</p>
                    <p className="text-xs text-muted-foreground">
                      Tracking helps you understand patterns
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/statistics")}
                  >
                    View Stats
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Floating Mood Bubbles */}
        {step === 2 && feeling && (
          <motion.div
            key="step2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <Card className="overflow-hidden border shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                <CardTitle className="text-center text-xl md:text-2xl">
                  How are you feeling right now?
                </CardTitle>
                <p className="text-sm text-muted-foreground text-center">
                  Select the emotion that matches your current mood
                </p>
                {selectedMood && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-center"
                  >
                    <Badge className="bg-primary text-white">
                      Selected: {selectedMood}
                    </Badge>
                  </motion.div>
                )}
              </CardHeader>
              <CardContent className="p-0">
                <div 
                  className="relative h-[75vh] min-h-[500px] w-full overflow-hidden"
                  style={{
                    touchAction: 'none',
                    overscrollBehavior: 'none',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-background/50 via-transparent to-background/50" />
                  
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="h-64 w-64 md:h-80 md:w-80 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 blur-2xl opacity-50" />
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative h-full w-full max-w-4xl flex items-center justify-center">
                      {moodTypes[feeling].map((mood, index) => (
                        <FloatingBubble
                          key={mood.label}
                          mood={mood}
                          index={index}
                          onClick={() => handleMoodSelect(mood.label)}
                          isSelected={selectedMood === mood.label}
                        />
                      ))}
                    </div>
                  </div>

                  {!selectedMood && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="absolute bottom-8 left-0 right-0 text-center px-4 pointer-events-none"
                    >
                      <div className="inline-block bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl px-6 py-3 shadow-md border border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Tap on a bubble to select your mood
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                onClick={handleBackToFeeling}
                className="px-8"
              >
                ← Back to Feeling Selection
              </Button>
              {selectedMood && (
                <Button 
                  onClick={() => setStep(3)}
                  className="px-8"
                >
                  Continue to Activities →
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 3: Select Activities */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {selectedMood && moodTypes[feeling!].find(m => m.label === selectedMood)?.emoji}
                  </div>
                  <div>
                    <CardTitle>What were you doing?</CardTitle>
                    <p className="text-sm text-muted-foreground">Select all activities that apply</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {activities.map((activity) => (
                    <motion.div
                      key={activity.label}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Badge
                        variant={selectedActivities.includes(activity.label) ? "default" : "outline"}
                        className={`h-20 w-full cursor-pointer justify-center gap-2 text-base transition-all flex-col py-4
                          ${selectedActivities.includes(activity.label) 
                            ? 'bg-primary hover:bg-primary/90' 
                            : 'hover:bg-primary/20'
                          }`}
                        onClick={() => toggleActivity(activity.label)}
                      >
                        <span className="text-3xl">{activity.icon}</span>
                        <span className="text-xs mt-1">{activity.label}</span>
                      </Badge>
                    </motion.div>
                  ))}
                </div>
                
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Selected activities: {selectedActivities.length > 0 ? selectedActivities.join(", ") : "None"}
                  </p>
                  <Button 
                    className="w-full" 
                    onClick={() => setStep(4)}
                    disabled={selectedActivities.length === 0}
                  >
                    {selectedActivities.length > 0 
                      ? `Continue with ${selectedActivities.length} activities` 
                      : 'Select at least one activity to continue'
                    }
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-center">
              <Button variant="outline" onClick={handleBackToMood}>
                ← Back to Mood Selection
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Add Notes */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Add a note (optional)</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Writing about your feelings can help process emotions
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Write about your day, thoughts, or feelings...
Example: Today I felt excited about my new project, but also a bit anxious about the deadline. Taking a walk helped clear my mind."
                  className="min-h-32 resize-none"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{notes.length} characters</span>
                  <span>{notes.split(/\s+/).filter(word => word.length > 0).length} words</span>
                </div>
                
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4 space-y-3">
                  <div className="text-sm font-medium">Your Mood Summary</div>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <Badge variant="secondary" className="capitalize">
                      {feeling} • {calculateMoodScore(feeling, selectedActivities, notes)}%
                    </Badge>
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      {selectedMood}
                    </Badge>
                    {selectedActivities.map(activity => (
                      <Badge key={activity} variant="outline">
                        {activity}
                      </Badge>
                    ))}
                  </div>
                  {notes.length > 0 && (
                    <div className="pt-2">
                      <p className="text-xs font-medium mb-1">Note Preview:</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notes.length > 100 ? notes.substring(0, 100) + '...' : notes}
                      </p>
                    </div>
                  )}
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Mood Entry...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Mood Entry
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
            
            <div className="flex justify-center">
              <Button variant="outline" onClick={handleBackToActivities}>
                ← Back to Activities
              </Button>
            </div>
            
            {/* Quick Tips */}
            <Card className="border-dashed">
              <CardContent className="p-4">
                <div className="text-sm font-medium mb-2">💡 Tips for Better Mood Tracking</div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Be honest with yourself - this is for your wellbeing</li>
                  <li>• Try to track at the same time each day</li>
                  <li>• Note what triggers certain moods</li>
                  <li>• Review your patterns weekly</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}