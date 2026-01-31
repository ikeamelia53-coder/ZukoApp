import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface UserData {
  moodEntries: Array<{
    id: string;
    date: string;
    mood: string;
    feeling: 'positive' | 'negative';
    activities: string[];
    notes: string;
    score: number;
  }>;
  consultations: Array<{
    id: string;
    date: string;
    doctor: string;
    type: 'online' | 'offline';
    method: string;
    status: 'completed' | 'upcoming' | 'cancelled';
  }>;
  breathingSessions: Array<{
    id: string;
    date: string;
    exercise: string;
    duration: number;
    cycles: number;
  }>;
  reflections: Array<{
    id: string;
    date: string;
    responses: Record<string, string>;
    wordCount: number;
    characterCount: number;
  }>;
  statistics: {
    streak: number;
    totalEntries: number;
    averageMood: number;
    lastActivity: string;
  };
}

interface AuthState {
  user: User | null;
  userData: UserData;
  isAuthenticated: boolean;
  login: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  updateUserData: (data: Partial<UserData>) => void;
  addMoodEntry: (entry: UserData['moodEntries'][0]) => void;
  addConsultation: (consultation: UserData['consultations'][0]) => void;
  addBreathingSession: (session: UserData['breathingSessions'][0]) => void;
  addReflection: (reflection: UserData['reflections'][0]) => void;
}

// Simpan ke localStorage
const saveToLocalStorage = (key: string, data: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

const loadFromLocalStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
  return null;
};

const useAuthStore = create<AuthState>((set, get) => ({
  user: loadFromLocalStorage('zuko_user') || null,
  userData: loadFromLocalStorage('zuko_user_data') || {
    moodEntries: [],
    consultations: [],
    breathingSessions: [],
    reflections: [],
    statistics: {
      streak: 0,
      totalEntries: 0,
      averageMood: 0,
      lastActivity: new Date().toISOString(),
    },
  },
  isAuthenticated: !!loadFromLocalStorage('zuko_user'),

  login: async (email: string, password: string, name?: string) => {
    // Simulasi login
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      name: name || 'User',
      email,
      createdAt: new Date().toISOString(),
    };

    saveToLocalStorage('zuko_user', user);
    
    // Load existing data or create new
    const existingData = loadFromLocalStorage('zuko_user_data') || {
      moodEntries: [],
      consultations: [],
      breathingSessions: [],
      reflections: [],
      statistics: {
        streak: 0,
        totalEntries: 0,
        averageMood: 0,
        lastActivity: new Date().toISOString(),
      },
    };

    saveToLocalStorage('zuko_user_data', existingData);

    set({
      user,
      userData: existingData,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem('zuko_user');
    set({
      user: null,
      isAuthenticated: false,
      userData: {
        moodEntries: [],
        consultations: [],
        breathingSessions: [],
        reflections: [],
        statistics: {
          streak: 0,
          totalEntries: 0,
          averageMood: 0,
          lastActivity: new Date().toISOString(),
        },
      },
    });
  },

  updateUserData: (data) => {
    const currentData = get().userData;
    const updatedData = { ...currentData, ...data };
    
    saveToLocalStorage('zuko_user_data', updatedData);
    set({ userData: updatedData });
  },

  addMoodEntry: (entry) => {
    const currentData = get().userData;
    const updatedEntries = [entry, ...currentData.moodEntries.slice(0, 9)]; // Keep last 10
    
    // Update statistics
    const totalMoodScore = updatedEntries.reduce((sum, e) => sum + e.score, 0);
    const averageMood = updatedEntries.length > 0 ? totalMoodScore / updatedEntries.length : 0;
    
    const updatedData = {
      ...currentData,
      moodEntries: updatedEntries,
      statistics: {
        ...currentData.statistics,
        totalEntries: currentData.statistics.totalEntries + 1,
        averageMood,
        lastActivity: new Date().toISOString(),
        streak: calculateStreak(updatedEntries),
      },
    };

    saveToLocalStorage('zuko_user_data', updatedData);
    set({ userData: updatedData });
  },

  addConsultation: (consultation) => {
    const currentData = get().userData;
    const updatedConsultations = [consultation, ...currentData.consultations];
    
    const updatedData = {
      ...currentData,
      consultations: updatedConsultations,
      statistics: {
        ...currentData.statistics,
        lastActivity: new Date().toISOString(),
      },
    };

    saveToLocalStorage('zuko_user_data', updatedData);
    set({ userData: updatedData });
  },

  addBreathingSession: (session) => {
    const currentData = get().userData;
    const updatedSessions = [session, ...currentData.breathingSessions];
    
    const updatedData = {
      ...currentData,
      breathingSessions: updatedSessions,
      statistics: {
        ...currentData.statistics,
        lastActivity: new Date().toISOString(),
      },
    };

    saveToLocalStorage('zuko_user_data', updatedData);
    set({ userData: updatedData });
  },

  addReflection: (reflection) => {
    const currentData = get().userData;
    const updatedReflections = [reflection, ...currentData.reflections];
    
    const updatedData = {
      ...currentData,
      reflections: updatedReflections,
      statistics: {
        ...currentData.statistics,
        totalEntries: currentData.statistics.totalEntries + 1,
        lastActivity: new Date().toISOString(),
      },
    };

    saveToLocalStorage('zuko_user_data', updatedData);
    set({ userData: updatedData });
  },
}));

// Helper function to calculate streak
const calculateStreak = (entries: UserData['moodEntries']) => {
  if (entries.length === 0) return 0;
  
  const sortedEntries = [...entries].sort((a, b) => 
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

export { useAuthStore };