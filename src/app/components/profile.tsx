import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Switch } from "@/app/components/ui/switch";
import { ArrowLeft, User, Mail, Bell, Shield, LogOut, Camera, Calendar, Activity, Loader2, Check } from "lucide-react";
import { useState, useEffect } from "react";

// Helper functions untuk localStorage
const getCurrentUser = () => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('zuko_user');
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

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

const updateUser = (updates: any) => {
  if (typeof window !== 'undefined') {
    const currentUser = getCurrentUser();
    const updatedUser = { ...currentUser, ...updates };
    localStorage.setItem('zuko_user', JSON.stringify(updatedUser));
    return updatedUser;
  }
  return null;
};

export function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  // Load user data on mount
  useEffect(() => {
    const loadUserData = () => {
      setIsLoading(true);
      const currentUser = getCurrentUser();
      const currentData = getUserData();
      
      setUser(currentUser);
      setUserData(currentData);
      
      // Initialize form data
      if (currentUser) {
        const nameParts = currentUser.name?.split(' ') || ['', ''];
        setFormData({
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: currentUser.email || '',
        });
      }
      
      setIsLoading(false);
    };

    loadUserData();
  }, []);

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle save profile changes
  const handleSaveProfile = () => {
    if (!user) return;
    
    setIsSaving(true);
    
    // Update user name
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const updatedUser = updateUser({
      name: fullName,
      email: formData.email,
    });

    // Update user data
    const updatedData = updateUserData({
      profile: {
        ...userData?.profile,
        name: fullName,
        email: formData.email,
      }
    });

    // Update local state
    setUser(updatedUser);
    setUserData(updatedData);

    // Show success message
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  // Handle notification toggle
  const handleNotificationToggle = (setting: string, value: boolean) => {
    const updatedData = updateUserData({
      profile: {
        ...userData?.profile,
        notifications: {
          ...userData?.profile?.notifications,
          [setting]: value,
        }
      }
    });
    setUserData(updatedData);
  };

  // Handle logout
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('zuko_user');
      localStorage.removeItem('zuko_user_data');
    }
    navigate("/auth");
  };

  // Calculate user statistics
  const calculateStats = () => {
    if (!userData) return { totalEntries: 0, streak: 0, lastActivity: 'Never' };
    
    const totalEntries = userData.statistics?.totalEntries || 0;
    const streak = userData.statistics?.streak || 0;
    
    let lastActivity = 'Never';
    if (userData.statistics?.lastActivity) {
      const lastDate = new Date(userData.statistics.lastActivity);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) lastActivity = 'Today';
      else if (diffDays === 1) lastActivity = 'Yesterday';
      else if (diffDays < 7) lastActivity = `${diffDays} days ago`;
      else lastActivity = lastDate.toLocaleDateString();
    }
    
    return { totalEntries, streak, lastActivity };
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 pb-20 md:pb-6">
      <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl">Profile & Settings</h1>
            <p className="text-sm text-muted-foreground">
              {user?.name ? `Welcome back, ${user.name}` : 'Manage your account and preferences'}
            </p>
          </div>
        </div>

        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                    <AvatarImage 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'user'}`} 
                      alt={user?.name || 'User'} 
                    />
                    <AvatarFallback className="bg-primary text-white text-xl">
                      {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary hover:bg-primary/90 shadow-md"
                    onClick={() => alert('Photo upload feature coming soon!')}
                  >
                    <Camera className="h-4 w-4 text-white" />
                  </Button>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-medium">{user?.name || 'User'}</h2>
                  <p className="text-muted-foreground">{user?.email || 'No email'}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric'
                        }) : 'Recently'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Activity className="h-3 w-3" />
                      <span>{stats.totalEntries} entries</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="text-center p-3 bg-primary/5 rounded-lg">
                  <div className="text-lg font-bold text-primary">{stats.totalEntries}</div>
                  <div className="text-xs text-muted-foreground">Total Entries</div>
                </div>
                <div className="text-center p-3 bg-secondary/5 rounded-lg">
                  <div className="text-lg font-bold text-secondary">{stats.streak}</div>
                  <div className="text-xs text-muted-foreground">Day Streak</div>
                </div>
                <div className="text-center p-3 bg-accent/5 rounded-lg">
                  <div className="text-lg font-bold text-accent">Active</div>
                  <div className="text-xs text-muted-foreground">{stats.lastActivity}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Edit Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-green-600 text-sm"
                >
                  <Check className="h-4 w-4" />
                  Profile updated successfully!
                </motion.div>
              )}
              
              <Button 
                onClick={handleSaveProfile}
                disabled={isSaving || (!formData.firstName && !formData.lastName)}
                className="w-full md:w-auto"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-secondary" />
                Notifications
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage how you receive notifications
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Daily Mood Reminders</p>
                  <p className="text-sm text-muted-foreground">Get reminded to log your mood</p>
                </div>
                <Switch 
                  checked={userData?.profile?.notifications?.moodReminders ?? true}
                  onCheckedChange={(checked) => handleNotificationToggle('moodReminders', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Breathing Exercise Reminders</p>
                  <p className="text-sm text-muted-foreground">Scheduled relaxation breaks</p>
                </div>
                <Switch 
                  checked={userData?.profile?.notifications?.breathingReminders ?? true}
                  onCheckedChange={(checked) => handleNotificationToggle('breathingReminders', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekly Reports</p>
                  <p className="text-sm text-muted-foreground">Summary of your wellness journey</p>
                </div>
                <Switch 
                  checked={userData?.profile?.notifications?.weeklyReports ?? false}
                  onCheckedChange={(checked) => handleNotificationToggle('weeklyReports', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Article Recommendations</p>
                  <p className="text-sm text-muted-foreground">Personalized mental health content</p>
                </div>
                <Switch 
                  checked={userData?.profile?.notifications?.articleRecommendations ?? true}
                  onCheckedChange={(checked) => handleNotificationToggle('articleRecommendations', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy & Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-accent" />
                Privacy & Security
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage your account security and data
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => alert('Password change feature coming soon!')}
              >
                Change Password
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => alert('Two-factor authentication coming soon!')}
              >
                Two-Factor Authentication
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  const data = getUserData();
                  const dataStr = JSON.stringify(data, null, 2);
                  const blob = new Blob([dataStr], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `zuko-data-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Download My Data
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => {
                  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                    localStorage.removeItem('zuko_user');
                    localStorage.removeItem('zuko_user_data');
                    navigate('/auth');
                  }
                }}
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Your Data Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Activity className="h-4 w-4" />
                Your Data Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                <div>
                  <div className="text-lg font-bold text-primary">
                    {userData?.moodEntries?.length || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Mood Entries</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-secondary">
                    {userData?.consultations?.length || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Consultations</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-accent">
                    {userData?.breathingSessions?.length || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Breathing Sessions</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-chart-1">
                    {userData?.reflections?.length || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Reflections</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="outline"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Sign Out
          </Button>
        </motion.div>

        {/* App Info */}
        <Card className="bg-muted/50">
          <CardContent className="p-6 text-center text-sm text-muted-foreground">
            <div className="space-y-2">
              <p className="font-medium">ZUKO v1.0.0</p>
              <p>© 2026 ZUKO. All rights reserved.</p>
              <div className="pt-2 border-t border-border/50">
                <p className="text-xs">
                  {userData ? 'Your data is stored locally in your browser.' : 'No data stored yet.'}
                </p>
                {user?.createdAt && (
                  <p className="text-xs mt-1">
                    Account created: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}