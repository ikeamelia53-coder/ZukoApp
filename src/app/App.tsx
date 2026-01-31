import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { SplashScreen } from "@/app/components/splash-screen";
import { AuthScreen } from "@/app/components/auth-screen";
import { Dashboard } from "@/app/components/dashboard";
import { MoodTracker } from "@/app/components/mood-tracker";
import { Consultation } from "@/app/components/consultation";
import { DoctorDetail } from "@/app/components/doctor-detail";
import { BookingFlow } from "@/app/components/booking-flow";
import { BreathingExercises } from "@/app/components/breathing-exercises";
import { SelfReflection } from "@/app/components/self-reflection";
import { Articles } from "@/app/components/articles";
import { Profile } from "@/app/components/profile";
import { Statistics } from "@/app/components/statistics";
import { MobileNav } from "@/app/components/mobile-nav";

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative">
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/auth" element={<AuthScreen />} />
          <Route path="/dashboard" element={<><Dashboard /><MobileNav /></>} />
          <Route path="/mood-tracker" element={<><MoodTracker /><MobileNav /></>} />
          <Route path="/consultation" element={<><Consultation /><MobileNav /></>} />
          <Route path="/doctor/:id" element={<><DoctorDetail /><MobileNav /></>} />
          <Route path="/booking/:doctorId" element={<><BookingFlow /><MobileNav /></>} />
          <Route path="/breathing" element={<><BreathingExercises /><MobileNav /></>} />
          <Route path="/reflection" element={<><SelfReflection /><MobileNav /></>} />
          <Route path="/articles" element={<><Articles /><MobileNav /></>} />
          <Route path="/statistics" element={<><Statistics /><MobileNav /></>} />
          <Route path="/profile" element={<><Profile /><MobileNav /></>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}