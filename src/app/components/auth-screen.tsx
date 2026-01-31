import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Mail, Lock, User, Loader2 } from "lucide-react";

// Simpan data user ke localStorage
const saveUserToLocalStorage = (userData: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('zuko_user', JSON.stringify(userData));
  }
};

// Inisialisasi data user default
const initializeUserData = (email: string, name: string) => {
  const defaultData = {
    moodEntries: [],
    consultations: [],
    breathingSessions: [],
    reflections: [],
    statistics: {
      streak: 0,
      totalEntries: 0,
      averageMood: 85,
      lastActivity: new Date().toISOString(),
    },
    profile: {
      name,
      email,
      joinedDate: new Date().toISOString(),
      notifications: {
        moodReminders: true,
        breathingReminders: true,
        weeklyReports: false,
        articleRecommendations: true,
      }
    }
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem('zuko_user_data', JSON.stringify(defaultData));
  }

  return defaultData;
};

export function AuthScreen() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Cek jika user sudah login
  const checkExistingUser = () => {
    if (typeof window !== 'undefined') {
      const existingUser = localStorage.getItem('zuko_user');
      return existingUser ? JSON.parse(existingUser) : null;
    }
    return null;
  };

  // Handle login
  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      // Simulasi API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Cek credentials (untuk demo, gunakan email/password default)
      const validCredentials = [
        { email: "user@example.com", password: "password123", name: "Demo User" },
        { email: "test@example.com", password: "test123", name: "Test User" },
      ];

      const user = validCredentials.find(
        cred => cred.email === email && cred.password === password
      );

      if (!user) {
        // Untuk demo, buat user baru jika tidak ditemukan
        const newUser = {
          id: Math.random().toString(36).substr(2, 9),
          name: email.split('@')[0],
          email,
          createdAt: new Date().toISOString(),
        };

        saveUserToLocalStorage(newUser);
        
        // Inisialisasi data untuk user baru
        initializeUserData(email, newUser.name);

        // Redirect ke dashboard
        setTimeout(() => {
          setIsLoading(false);
          navigate("/dashboard");
        }, 500);
        return;
      }

      // Save user data to localStorage
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        name: user.name,
        email: user.email,
        createdAt: new Date().toISOString(),
      };

      saveUserToLocalStorage(userData);

      // Cek jika data user sudah ada di localStorage
      const existingData = localStorage.getItem('zuko_user_data');
      if (!existingData) {
        initializeUserData(user.email, user.name);
      }

      // Success - redirect to dashboard
      setTimeout(() => {
        setIsLoading(false);
        navigate("/dashboard");
      }, 500);

    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  // Handle register
  const handleRegister = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setRegisterError(null);

    try {
      // Validasi input
      if (!name.trim()) {
        throw new Error("Name is required");
      }
      if (!email.includes('@')) {
        throw new Error("Please enter a valid email");
      }
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      // Simulasi API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create user object
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        createdAt: new Date().toISOString(),
      };

      // Save user to localStorage
      saveUserToLocalStorage(userData);

      // Initialize user data with default values
      initializeUserData(email, name);

      // Success - redirect to dashboard
      setTimeout(() => {
        setIsLoading(false);
        navigate("/dashboard");
      }, 500);

    } catch (error: any) {
      console.error("Register error:", error);
      setRegisterError(error.message || "Registration failed. Please try again.");
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    if (activeTab === "login") {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      await handleLogin(email, password);
    } else {
      const name = formData.get("name") as string;
      const email = formData.get("reg-email") as string;
      const password = formData.get("reg-password") as string;
      await handleRegister(name, email, password);
    }
  };

  // Handle Google login yang asli
const handleGoogleLogin = async () => {
  setIsLoading(true);
  
  try {
    // 1. Panggil Firebase Google Auth
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // 2. Ambil data dari hasil login Google
    const userData = {
      id: user.uid,
      name: user.displayName || "Google User",
      email: user.email || "",
      photoURL: user.photoURL, // Kamu bisa simpan foto profil juga
      createdAt: new Date().toISOString(),
      provider: "google",
    };

    // 3. Simpan ke localStorage (sesuai logika aplikasimu)
    saveUserToLocalStorage(userData);
    
    // Inisialisasi data aplikasi jika belum ada
    const existingData = localStorage.getItem('zuko_user_data');
    if (!existingData) {
      initializeUserData(userData.email, userData.name);
    }

    // 4. Redirect ke dashboard
    setIsLoading(false);
    navigate("/dashboard");

  } catch (error: any) {
    console.error("Google login error:", error);
    // Tampilkan error jika user menutup popup secara paksa
    if (error.code !== 'auth/cancelled-popup-request') {
      setLoginError("Gagal login dengan Google. Silakan coba lagi.");
    }
    setIsLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Illustration Side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex flex-col items-center justify-center"
        >
          <img
            src="https://images.unsplash.com/photo-1722094250550-4993fa28a51b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwY2FsbSUyMHdlbGxuZXNzfGVufDF8fHx8MTc2ODk2MzM1Nnww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Wellness"
            className="w-full max-w-md rounded-3xl shadow-2xl"
          />
          <p className="mt-6 text-center text-muted-foreground max-w-md">
            Join thousands of users on their journey to better mental health and emotional wellness
          </p>
        </motion.div>

        {/* Auth Form Side */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-border/50 shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-3xl text-center">Welcome to ZUKO</CardTitle>
              <CardDescription className="text-center">
                Your personal mental health companion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs 
                defaultValue="login" 
                className="w-full"
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as "login" | "register")}
              >
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login">
                  <form onSubmit={handleAuth} className="space-y-4">
                    {loginError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-destructive/10 border border-destructive/20 rounded-md"
                      >
                        <p className="text-sm text-destructive text-center">{loginError}</p>
                      </motion.div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </form>
                </TabsContent>

                {/* Register Tab */}
                <TabsContent value="register">
                  <form onSubmit={handleAuth} className="space-y-4">
                    {registerError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-destructive/10 border border-destructive/20 rounded-md"
                      >
                        <p className="text-sm text-destructive text-center">{registerError}</p>
                      </motion.div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your full name"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="reg-email"
                          name="reg-email"
                          type="email"
                          placeholder="you@example.com"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="reg-password"
                          name="reg-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          required
                          minLength={6}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Password must be at least 6 characters
                      </p>
                    </div>

                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>By registering, you agree to:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Our Terms of Service</li>
                        <li>Privacy Policy</li>
                        <li>Data storage for personalized wellness tracking</li>
                      </ul>
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full bg-secondary hover:bg-secondary/90"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Social Login */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                  )}
                  Continue with Google
                </Button>
              </div>

              {/* Privacy Notice */}
              <div className="mt-8 text-center border-t pt-4">
                <p className="text-xs text-muted-foreground">
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// Helper function untuk mendapatkan user saat ini
export const getCurrentUser = () => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('zuko_user');
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

// Helper function untuk mendapatkan user data
export const getUserData = () => {
  if (typeof window !== 'undefined') {
    const dataStr = localStorage.getItem('zuko_user_data');
    return dataStr ? JSON.parse(dataStr) : null;
  }
  return null;
};

// Helper function untuk update user data
export const updateUserData = (updates: any) => {
  if (typeof window !== 'undefined') {
    const currentData = getUserData();
    const updatedData = { ...currentData, ...updates };
    localStorage.setItem('zuko_user_data', JSON.stringify(updatedData));
    return updatedData;
  }
  return null;
};

// Helper function untuk clear user data (logout)
export const clearUserData = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('zuko_user');
    localStorage.removeItem('zuko_user_data');
  }
};

// Hook untuk check authentication status
export const useAuth = () => {
  const [user, setUser] = useState(() => getCurrentUser());
  const [userData, setUserData] = useState(() => getUserData());

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = getCurrentUser();
      const currentData = getUserData();
      setUser(currentUser);
      setUserData(currentData);
    };

    // Check on mount
    checkAuth();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'zuko_user' || e.key === 'zuko_user_data') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (email: string, password: string, name?: string) => {
    // Logic login (sama seperti di AuthScreen)
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      name: name || email.split('@')[0],
      email,
      createdAt: new Date().toISOString(),
    };

    saveUserToLocalStorage(userData);
    
    if (!getUserData()) {
      initializeUserData(email, userData.name);
    }

    setUser(userData);
    setUserData(getUserData());
    return userData;
  };

  const register = async (name: string, email: string, password: string) => {
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      createdAt: new Date().toISOString(),
    };

    saveUserToLocalStorage(userData);
    initializeUserData(email, name);

    setUser(userData);
    setUserData(getUserData());
    return userData;
  };

  const logout = () => {
    clearUserData();
    setUser(null);
    setUserData(null);
  };

  const updateProfile = (updates: any) => {
    const currentData = getUserData();
    const updatedData = {
      ...currentData,
      profile: {
        ...currentData.profile,
        ...updates,
      },
    };
    
    localStorage.setItem('zuko_user_data', JSON.stringify(updatedData));
    setUserData(updatedData);
    
    // Update user name if changed
    if (updates.name && user) {
      const updatedUser = { ...user, name: updates.name };
      localStorage.setItem('zuko_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  return {
    user,
    userData,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    updateUserData: (updates: any) => {
      const updated = updateUserData(updates);
      setUserData(updated);
    },
  };
};