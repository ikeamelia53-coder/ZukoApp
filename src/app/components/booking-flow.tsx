import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Calendar } from "@/app/components/ui/calendar";
import { Badge } from "@/app/components/ui/badge";
import {
  ArrowLeft,
  Video,
  Phone,
  MessageSquare,
  MapPin,
  Calendar as CalendarIcon,
  Clock,
  CreditCard,
  Wallet,
  Building2,
  CheckCircle2,
  QrCode,
  Navigation,
  Smartphone,
  Landmark,
  Shield,
  Loader2,
} from "lucide-react";

const hospitals = [
  {
    id: 1,
    name: "Mental Wellness Center",
    address: "123 Health Street, Downtown, Jakarta",
    distance: "2.5 km",
    room: "Building A, Floor 3, Room 301",
    phone: "(021) 1234-5678",
    hours: "08:00 - 20:00",
    facilities: ["Free Parking", "WiFi", "Cafeteria", "Pharmacy"],
  },
  {
    id: 2,
    name: "Hope Medical Hospital",
    address: "456 Care Avenue, Menteng, Jakarta",
    distance: "3.8 km",
    room: "Building B, Floor 2, Room 205",
    phone: "(021) 2345-6789",
    hours: "24 Hours",
    facilities: ["Emergency Room", "Ambulance", "ICU", "Lab"],
  },
  {
    id: 3,
    name: "Serenity Health Clinic",
    address: "789 Therapy Lane, Senayan, Jakarta",
    distance: "5.1 km",
    room: "Main Building, Floor 1, Room 104",
    phone: "(021) 3456-7890",
    hours: "09:00 - 21:00",
    facilities: ["Play Room", "Library", "Garden", "Café"],
  },
  {
    id: 4,
    name: "Mind & Soul Hospital",
    address: "101 Peace Road, Kebayoran, Jakarta",
    distance: "4.2 km",
    room: "West Wing, Floor 4, Room 412",
    phone: "(021) 4567-8901",
    hours: "07:00 - 22:00",
    facilities: ["Yoga Studio", "Meditation Room", "Art Therapy", "Gym"],
  },
  {
    id: 5,
    name: "Psychiatric Care Center",
    address: "202 Healing Blvd, Pondok Indah, Jakarta",
    distance: "6.7 km",
    room: "Tower C, Floor 5, Room 501",
    phone: "(021) 5678-9012",
    hours: "08:30 - 19:30",
    facilities: ["Group Therapy", "Family Counseling", "Workshops", "Library"],
  },
  {
    id: 6,
    name: "Tranquility Medical Clinic",
    address: "303 Wellness Street, Kuningan, Jakarta",
    distance: "3.5 km",
    room: "Annex Building, Floor 2, Room 208",
    phone: "(021) 6789-0123",
    hours: "10:00 - 18:00",
    facilities: ["Private Rooms", "Quiet Zone", "Tea Lounge", "Bookstore"],
  },
  {
    id: 7,
    name: "Brain Health Institute",
    address: "404 Neuro Lane, Sudirman, Jakarta",
    distance: "2.8 km",
    room: "Research Wing, Floor 3, Room 309",
    phone: "(021) 7890-1234",
    hours: "08:00 - 17:00",
    facilities: ["Neuro Lab", "Research Library", "Conference Room", "Cafeteria"],
  },
  {
    id: 8,
    name: "Harmony Psychiatry Hospital",
    address: "505 Balance Road, Gatot Subroto, Jakarta",
    distance: "5.5 km",
    room: "Main Tower, Floor 6, Room 603",
    phone: "(021) 8901-2345",
    hours: "24 Hours",
    facilities: ["Inpatient Ward", "Day Care", "Rehabilitation", "Garden"],
  },
  {
    id: 9,
    name: "Calm Minds Clinic",
    address: "606 Serenity Ave, Thamrin, Jakarta",
    distance: "3.1 km",
    room: "Plaza Building, Floor 2, Room 215",
    phone: "(021) 9012-3456",
    hours: "09:00 - 20:00",
    facilities: ["Music Room", "Art Studio", "Reading Corner", "Café"],
  },
  {
    id: 10,
    name: "Peaceful Heart Medical Center",
    address: "707 Harmony Street, Mega Kuningan, Jakarta",
    distance: "4.8 km",
    room: "Garden Wing, Floor 1, Room 107",
    phone: "(021) 0123-4567",
    hours: "08:00 - 21:00",
    facilities: ["Garden View", "Aquarium Lounge", "Meditation Garden", "Juice Bar"],
  },
  {
    id: 11,
    name: "Neuroscience Center Jakarta",
    address: "808 Brain Street, Setiabudi, Jakarta",
    distance: "5.3 km",
    room: "Neuro Tower, Floor 7, Room 701",
    phone: "(021) 1122-3344",
    hours: "07:30 - 19:30",
    facilities: ["MRI Center", "Sleep Lab", "Therapy Pool", "Gym"],
  },
  {
    id: 12,
    name: "Child & Adolescent Mental Health",
    address: "909 Youth Road, Kemang, Jakarta",
    distance: "6.2 km",
    room: "Child Wing, Floor 2, Room 222",
    phone: "(021) 2233-4455",
    hours: "08:00 - 18:00",
    facilities: ["Playground", "Toy Library", "Parent Lounge", "Therapy Gym"],
  },
];

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
];

// Data untuk e-wallet
const eWallets = [
  { id: "gopay", name: "GoPay", icon: "GP", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { id: "ovo", name: "OVO", icon: "OV", color: "bg-purple-100 text-purple-800 border-purple-200" },
  { id: "dana", name: "Dana", icon: "DN", color: "bg-green-100 text-green-800 border-green-200" },
  { id: "shopeepay", name: "ShopeePay", icon: "SP", color: "bg-orange-100 text-orange-800 border-orange-200" },
  { id: "linkaja", name: "LinkAja", icon: "LA", color: "bg-red-100 text-red-800 border-red-200" },
];

// Data untuk bank transfer
const banks = [
  { id: "bca", name: "BCA", code: "014", icon: "BCA", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "mandiri", name: "Bank Mandiri", code: "008", icon: "MDR", color: "bg-red-50 text-red-700 border-red-200" },
  { id: "bni", name: "BNI", code: "009", icon: "BNI", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  { id: "bri", name: "BRI", code: "002", icon: "BRI", color: "bg-green-50 text-green-700 border-green-200" },
  { id: "cimb", name: "CIMB Niaga", code: "022", icon: "CIM", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { id: "danamon", name: "Danamon", code: "011", icon: "DNM", color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
];

// Data untuk kartu debit/kredit
const cards = [
  { id: "visa", name: "Visa", number: "**** 1234", expiry: "12/25", icon: "VISA", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "mastercard", name: "Mastercard", number: "**** 5678", expiry: "06/24", icon: "MC", color: "bg-red-50 text-red-700 border-red-200" },
  { id: "jcb", name: "JCB", number: "**** 9012", expiry: "09/26", icon: "JCB", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { id: "american", name: "American Express", number: "**** 3456", expiry: "03/25", icon: "AE", color: "bg-green-50 text-green-700 border-green-200" },
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

export function BookingFlow() {
  const navigate = useNavigate();
  const { doctorId } = useParams();
  const [step, setStep] = useState(1);
  const [consultationType, setConsultationType] = useState<"online" | "offline" | null>(null);
  const [onlineMethod, setOnlineMethod] = useState<"video" | "voice" | "chat" | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [selectedPaymentDetail, setSelectedPaymentDetail] = useState<string | null>(null);
  const [queueNumber, setQueueNumber] = useState("A-" + Math.floor(Math.random() * 100 + 1));
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Load current user
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('zuko_user');
      setCurrentUser(userStr ? JSON.parse(userStr) : null);
    }
  }, []);

  const handleNext = () => {
    if (step === 1 && consultationType === "online") {
      setStep(2);
    } else if (step === 1 && consultationType === "offline") {
      setStep(3);
    } else if (step === 2) {
      setStep(4); // Skip hospital selection for online
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      setStep(5);
    } else if (step === 5) {
      processPaymentAndSave();
    }
  };

  const processPaymentAndSave = () => {
    if (!paymentMethod || !selectedPaymentDetail) return;
    
    setIsProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Create consultation entry
      const consultationEntry = {
        id: `consultation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        date: selectedDate ? selectedDate.toISOString() : new Date().toISOString(),
        time: selectedTime,
        doctor: `Doctor ${doctorId || "Unknown"}`,
        type: consultationType || 'online',
        method: consultationType === 'online' ? onlineMethod || 'video' : 'offline',
        status: 'upcoming' as const,
        hospital: consultationType === 'offline' ? hospitals.find(h => h.id === selectedHospital)?.name : null,
        payment: {
          method: paymentMethod,
          detail: selectedPaymentDetail,
          amount: 155.00,
          currency: "USD",
          status: "completed"
        },
        queueNumber: consultationType === 'offline' ? queueNumber : null,
        timestamp: Date.now(),
      };

      // Get current user data
      const currentData = getUserData();
      
      // Prepare updated data
      const updatedConsultations = [consultationEntry, ...(currentData?.consultations || [])];
      
      // Update statistics
      const updatedData = {
        ...currentData,
        consultations: updatedConsultations,
        statistics: {
          ...currentData?.statistics,
          totalEntries: (currentData?.statistics?.totalEntries || 0) + 1,
          lastActivity: new Date().toISOString(),
        },
      };

      // Save to localStorage
      updateUserData(updatedData);
      
      setIsProcessingPayment(false);
      setStep(6);
    }, 1500);
  };

  const canProceed = () => {
    if (step === 1) return consultationType !== null;
    if (step === 2) return onlineMethod !== null;
    if (step === 3) return selectedHospital !== null;
    if (step === 4) return selectedDate !== undefined && selectedTime !== null;
    if (step === 5) return paymentMethod !== null && selectedPaymentDetail !== null;
    return false;
  };

  const renderPaymentDetails = () => {
    if (!paymentMethod) return null;

    switch (paymentMethod) {
      case "ewallet":
        return (
          <div className="space-y-3 mt-4">
            <h4 className="font-medium text-sm">Select E-Wallet</h4>
            <RadioGroup value={selectedPaymentDetail || ""} onValueChange={setSelectedPaymentDetail}>
              <div className="space-y-2">
                {eWallets.map((wallet) => (
                  <div key={wallet.id} className="flex items-center space-x-3 border rounded-lg p-3 cursor-pointer hover:bg-accent/50">
                    <RadioGroupItem value={wallet.id} id={`ewallet-${wallet.id}`} />
                    <Label htmlFor={`ewallet-${wallet.id}`} className="flex-1 cursor-pointer flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full ${wallet.color} flex items-center justify-center font-bold`}>
                        {wallet.icon}
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-medium">{wallet.name}</div>
                        <div className="text-xs text-muted-foreground">Pay with {wallet.name}</div>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        );

      case "bank":
        return (
          <div className="space-y-3 mt-4">
            <h4 className="font-medium text-sm">Select Bank</h4>
            <RadioGroup value={selectedPaymentDetail || ""} onValueChange={setSelectedPaymentDetail}>
              <div className="space-y-2">
                {banks.map((bank) => (
                  <div key={bank.id} className="flex items-center space-x-3 border rounded-lg p-3 cursor-pointer hover:bg-accent/50">
                    <RadioGroupItem value={bank.id} id={`bank-${bank.id}`} />
                    <Label htmlFor={`bank-${bank.id}`} className="flex-1 cursor-pointer flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full ${bank.color} flex items-center justify-center font-bold`}>
                        {bank.icon}
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-medium">{bank.name}</div>
                        <div className="text-xs text-muted-foreground">Bank Code: {bank.code}</div>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        );

      case "credit":
        return (
          <div className="space-y-3 mt-4">
            <h4 className="font-medium text-sm">Select Card</h4>
            <RadioGroup value={selectedPaymentDetail || ""} onValueChange={setSelectedPaymentDetail}>
              <div className="space-y-2">
                {cards.map((card) => (
                  <div key={card.id} className="flex items-center space-x-3 border rounded-lg p-3 cursor-pointer hover:bg-accent/50">
                    <RadioGroupItem value={card.id} id={`card-${card.id}`} />
                    <Label htmlFor={`card-${card.id}`} className="flex-1 cursor-pointer flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full ${card.color} flex items-center justify-center font-bold`}>
                        {card.icon}
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-medium">{card.name}</div>
                        <div className="text-xs text-muted-foreground">Expires {card.expiry}</div>
                        <div className="text-xs text-muted-foreground">{card.number}</div>
                      </div>
                      <Shield className="h-4 w-4 text-green-600" />
                    </Label>
                  </div>
                ))}
                <div className="pt-2">
                  <Button variant="outline" className="w-full">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Add New Card
                  </Button>
                </div>
              </div>
            </RadioGroup>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 pb-20 md:pb-6">
      <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl">Book Consultation</h1>
            <p className="text-sm text-muted-foreground">
              Step {step} of {consultationType === "online" ? 5 : 6}
              {currentUser?.name && ` • For ${currentUser.name}`}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2">
          <motion.div
            className="bg-primary h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(step / (consultationType === "online" ? 5 : 6)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Consultation Type */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Choose Consultation Type</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Select how you'd like to connect with the professional
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="outline"
                    className={`w-full h-auto py-6 justify-start gap-4 ${
                      consultationType === "online" ? "border-primary border-2 bg-primary/5" : ""
                    }`}
                    onClick={() => setConsultationType("online")}
                  >
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Video className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-medium">Online Consultation</div>
                      <div className="text-sm text-muted-foreground">Video call, voice call, or chat</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className={`w-full h-auto py-6 justify-start gap-4 ${
                      consultationType === "offline" ? "border-secondary border-2 bg-secondary/5" : ""
                    }`}
                    onClick={() => setConsultationType("offline")}
                  >
                    <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-secondary" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-medium">Offline Consultation</div>
                      <div className="text-sm text-muted-foreground">Visit hospital or clinic</div>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Online Method */}
          {step === 2 && consultationType === "online" && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Select Online Method</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred communication method
                  </p>
                </CardHeader>
                <CardContent className="grid gap-3">
                  {[
                    { value: "video", icon: Video, label: "Video Call", desc: "Face-to-face conversation" },
                    { value: "voice", icon: Phone, label: "Voice Call", desc: "Audio only call" },
                    { value: "chat", icon: MessageSquare, label: "Chat", desc: "Text messaging" },
                  ].map((method) => (
                    <Button
                      key={method.value}
                      variant="outline"
                      className={`h-auto py-4 justify-start gap-4 ${
                        onlineMethod === method.value ? "border-primary border-2 bg-primary/5" : ""
                      }`}
                      onClick={() => setOnlineMethod(method.value as any)}
                    >
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <method.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{method.label}</div>
                        <div className="text-xs text-muted-foreground">{method.desc}</div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Hospital Selection */}
          {step === 3 && consultationType === "offline" && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Choose Hospital/Clinic</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Select a location convenient for you
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {hospitals.map((hospital) => (
                    <Button
                      key={hospital.id}
                      variant="outline"
                      className={`w-full h-auto py-4 justify-start gap-4 ${
                        selectedHospital === hospital.id ? "border-secondary border-2 bg-secondary/5" : ""
                      }`}
                      onClick={() => setSelectedHospital(hospital.id)}
                    >
                      <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-5 w-5 text-secondary" />
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-medium">{hospital.name}</div>
                        <div className="text-xs text-muted-foreground">{hospital.address}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 inline mr-1" />
                          {hospital.distance} away • {hospital.hours}
                        </div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Date & Time */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Select Date</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Choose a date for your consultation
                  </p>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    disabled={(date) => date < new Date()}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Select Time Slot</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Available time slots for {selectedDate?.toLocaleDateString()}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        className="h-12"
                        onClick={() => setSelectedTime(time)}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        {time}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 5: Payment Method */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Choose how you'd like to pay for the consultation
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={paymentMethod || ""} onValueChange={(value) => {
                    setPaymentMethod(value);
                    setSelectedPaymentDetail(null);
                  }}>
                    <div className="space-y-3">
                      {/* E-Wallet Option */}
                      <div className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent/50 ${
                        paymentMethod === "ewallet" ? "border-primary border-2 bg-primary/5" : ""
                      }`}>
                        <RadioGroupItem value="ewallet" id="ewallet" />
                        <Label htmlFor="ewallet" className="flex-1 cursor-pointer flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <Wallet className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium">E-Wallet</div>
                            <div className="text-xs text-muted-foreground">GoPay, OVO, Dana, etc.</div>
                          </div>
                        </Label>
                      </div>

                      {/* Bank Transfer Option */}
                      <div className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent/50 ${
                        paymentMethod === "bank" ? "border-primary border-2 bg-primary/5" : ""
                      }`}>
                        <RadioGroupItem value="bank" id="bank" />
                        <Label htmlFor="bank" className="flex-1 cursor-pointer flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Landmark className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">Bank Transfer</div>
                            <div className="text-xs text-muted-foreground">Virtual account</div>
                          </div>
                        </Label>
                      </div>

                      {/* Credit/Debit Card Option */}
                      <div className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent/50 ${
                        paymentMethod === "credit" ? "border-primary border-2 bg-primary/5" : ""
                      }`}>
                        <RadioGroupItem value="credit" id="credit" />
                        <Label htmlFor="credit" className="flex-1 cursor-pointer flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium">Credit/Debit Card</div>
                            <div className="text-xs text-muted-foreground">Visa, Mastercard, etc.</div>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>

                  {/* Payment Details Selection */}
                  {paymentMethod && (
                    <div className="space-y-3 mt-4">
                      <h4 className="font-medium text-sm">Select {paymentMethod === "ewallet" ? "E-Wallet" : paymentMethod === "bank" ? "Bank" : "Card"}</h4>
                      {renderPaymentDetails()}
                    </div>
                  )}

                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Consultation Fee</span>
                      <span className="font-medium">$150.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Service Fee</span>
                      <span className="font-medium">$5.00</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-medium">
                      <span>Total</span>
                      <span className="text-primary">$155.00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 6: Confirmation (Offline Only) */}
          {step === 6 && consultationType === "offline" && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
                <CardContent className="p-6 text-center">
                  <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-medium mb-2">Booking Confirmed!</h2>
                  <p className="text-muted-foreground">Your payment has been processed successfully</p>
                  {currentUser?.name && (
                    <p className="text-sm text-green-700 mt-2">
                      Thank you, {currentUser.name}! Your consultation has been booked.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Queue Number & QR Code */}
              <Card>
                <CardContent className="p-6 text-center space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Your Queue Number</p>
                    <div className="text-5xl font-bold text-primary">{queueNumber}</div>
                    <p className="text-xs text-muted-foreground mt-2">Please confirm with staff upon arrival</p>
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="h-48 w-48 bg-white rounded-lg p-4 shadow-md flex items-center justify-center border">
                      <QrCode className="h-full w-full text-foreground" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Scan this QR code at the hospital</p>
                </CardContent>
              </Card>

              {/* Hospital Details */}
              {selectedHospital && (
                <Card>
                  <CardHeader>
                    <CardTitle>Hospital Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{hospitals.find(h => h.id === selectedHospital)?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {hospitals.find(h => h.id === selectedHospital)?.address}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Room</p>
                        <p className="font-medium">{hospitals.find(h => h.id === selectedHospital)?.room}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Contact</p>
                        <p className="font-medium">{hospitals.find(h => h.id === selectedHospital)?.phone}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Operating Hours</p>
                        <p className="font-medium">{hospitals.find(h => h.id === selectedHospital)?.hours}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Distance</p>
                        <p className="font-medium">{hospitals.find(h => h.id === selectedHospital)?.distance}</p>
                      </div>
                    </div>

                    {/* Facilities */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Facilities</p>
                      <div className="flex flex-wrap gap-2">
                        {hospitals.find(h => h.id === selectedHospital)?.facilities.map((facility, index) => (
                          <Badge key={index} variant="outline" className="bg-secondary/10">
                            {facility}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Map */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Location Map</p>
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8195613!3d-6.1944491!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5390917b759%3A0x6b45e67356080477!2sNational%20Monument!5e0!3m2!1sen!2sid!4v1234567890"
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                        />
                        <Button
                          size="sm"
                          className="absolute bottom-3 right-3 shadow-lg"
                        >
                          <Navigation className="h-4 w-4 mr-2" />
                          Open in Maps
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">{selectedDate?.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-medium">{selectedTime}</p>
                      </div>
                    </div>

                    {/* Booking Summary */}
                    <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4 mt-4">
                      <p className="text-sm font-medium mb-2">Booking Summary</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Type:</div>
                        <div className="font-medium">Offline Consultation</div>
                        
                        <div className="text-muted-foreground">Hospital:</div>
                        <div className="font-medium">{hospitals.find(h => h.id === selectedHospital)?.name}</div>
                        
                        <div className="text-muted-foreground">Payment:</div>
                        <div className="font-medium">
                          {paymentMethod === 'ewallet' ? 'E-Wallet' : 
                           paymentMethod === 'bank' ? 'Bank Transfer' : 
                           'Credit/Debit Card'}
                        </div>
                        
                        <div className="text-muted-foreground">Amount:</div>
                        <div className="font-medium text-primary">$155.00</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={() => navigate("/dashboard")}>
                  Back to Home
                </Button>
                <Button onClick={() => navigate("/consultation")}>
                  View My Bookings
                </Button>
              </div>
            </motion.div>
          )}

          {/* Confirmation for Online */}
          {step === 6 && consultationType === "online" && (
            <motion.div
              key="step6-online"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
                <CardContent className="p-6 text-center">
                  <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-medium mb-2">Booking Confirmed!</h2>
                  <p className="text-muted-foreground">Your payment has been processed successfully</p>
                  {currentUser?.name && (
                    <p className="text-sm text-green-700 mt-2">
                      Thank you, {currentUser.name}! Your online consultation has been scheduled.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Consultation Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Method</p>
                    <Badge className="mt-1">{onlineMethod?.toUpperCase()}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">{selectedDate?.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">{selectedTime}</p>
                    </div>
                  </div>

                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-sm font-medium mb-2">Meeting Link</p>
                    <p className="text-xs text-muted-foreground mb-3">
                      A meeting link will be sent to your email 15 minutes before the consultation
                    </p>
                    <Button variant="outline" className="w-full" disabled>
                      Link will be available soon
                    </Button>
                  </div>

                  {/* Booking Summary */}
                  <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4 mt-4">
                    <p className="text-sm font-medium mb-2">Booking Summary</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Type:</div>
                      <div className="font-medium">Online Consultation</div>
                      
                      <div className="text-muted-foreground">Method:</div>
                      <div className="font-medium">{onlineMethod?.charAt(0).toUpperCase() + onlineMethod?.slice(1)} Call</div>
                      
                      <div className="text-muted-foreground">Payment:</div>
                      <div className="font-medium">
                        {paymentMethod === 'ewallet' ? 'E-Wallet' : 
                         paymentMethod === 'bank' ? 'Bank Transfer' : 
                         'Credit/Debit Card'}
                      </div>
                      
                      <div className="text-muted-foreground">Amount:</div>
                      <div className="font-medium text-primary">$155.00</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={() => navigate("/dashboard")}>
                  Back to Home
                </Button>
                <Button onClick={() => navigate("/consultation")}>
                  View My Bookings
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next Button */}
        {step < 6 && (
          <Button
            className="w-full"
            size="lg"
            onClick={handleNext}
            disabled={!canProceed() || isProcessingPayment}
          >
            {isProcessingPayment ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : step === 5 ? (
              "Process Payment & Book"
            ) : (
              "Continue"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}