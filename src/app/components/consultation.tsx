import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { ArrowLeft, Search, Star, Video, Phone, MessageSquare } from "lucide-react";

const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialization: "Clinical Psychologist",
    rating: 4.9,
    reviews: 127,
    experience: "6 years",
    image: "https://images.unsplash.com/photo-1659353888906-adb3e0041693?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    available: true,
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialization: "Psychiatrist",
    rating: 4.8,
    reviews: 94,
    experience: "10 years",
    image: "https://plus.unsplash.com/premium_photo-1681996359725-06262b082c27?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    available: true,
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialization: "Counseling Psychologist",
    rating: 4.7,
    reviews: 82,
    experience: "8 years",
    image: "https://images.unsplash.com/photo-1734002886107-168181bcd6a1?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    available: false,
  },
  {
    id: 4,
    name: "Dr. David Miller",
    specialization: "Child & Adolescent Psychiatrist",
    rating: 4.8,
    reviews: 156,
    experience: "12 years",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    available: true,
  },
  {
    id: 5,
    name: "Dr. Lisa Wong",
    specialization: "Forensic Psychologist",
    rating: 4.9,
    reviews: 89,
    experience: "9 years",
    image: "https://images.unsplash.com/photo-1594824434340-7e7dfc37cabb?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    available: true,
  },
  {
    id: 6,
    name: "Dr. Robert Kim",
    specialization: "Geriatric Psychiatrist",
    rating: 4.7,
    reviews: 67,
    experience: "15 years",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    available: true,
  },
  {
    id: 7,
    name: "Dr. Maria Garcia",
    specialization: "Neuropsychologist",
    rating: 4.8,
    reviews: 112,
    experience: "11 years",
    image: "https://images.unsplash.com/photo-1618498082418-5c1c6c1b5a5c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    available: false,
  },
  {
    id: 8,
    name: "Dr. James Wilson",
    specialization: "Addiction Psychiatrist",
    rating: 4.6,
    reviews: 78,
    experience: "7 years",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    available: true,
  },
  {
    id: 9,
    name: "Dr. Amanda Lee",
    specialization: "Health Psychologist",
    rating: 4.9,
    reviews: 143,
    experience: "8 years",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    available: true,
  },
  {
    id: 10,
    name: "Dr. Thomas Baker",
    specialization: "Sports Psychologist",
    rating: 4.7,
    reviews: 95,
    experience: "6 years",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    available: true,
  },
  {
    id: 11,
    name: "Dr. Sophia Martinez",
    specialization: "Trauma Psychologist",
    rating: 4.9,
    reviews: 121,
    experience: "10 years",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    available: true,
  },
  {
    id: 12,
    name: "Dr. Kevin Patel",
    specialization: "Sleep Disorder Psychiatrist",
    rating: 4.8,
    reviews: 84,
    experience: "9 years",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    available: false,
  },
  {
    id: 13,
    name: "Dr. Jennifer Taylor",
    specialization: "Eating Disorder Specialist",
    rating: 4.7,
    reviews: 76,
    experience: "8 years",
    image: "https://images.unsplash.com/photo-1594824434340-7e7dfc37cabb?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    available: true,
  },
  {
    id: 14,
    name: "Dr. Benjamin Carter",
    specialization: "Occupational Psychologist",
    rating: 4.6,
    reviews: 68,
    experience: "7 years",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    available: true,
  },
  {
    id: 15,
    name: "Dr. Olivia Davis",
    specialization: "Marriage & Family Therapist",
    rating: 4.9,
    reviews: 134,
    experience: "11 years",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    available: true,
  },
];

export function Consultation() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 pb-20 md:pb-6">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="flex-shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl">Mental Health Consultation</h1>
            <p className="text-sm md:text-base text-muted-foreground">Connect with expert professionals</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by name or specialization..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Consultation Types - Responsive Grid */}
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-3 md:p-4 lg:p-6 text-center space-y-2">
              <div className="mx-auto w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Video className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <p className="text-xs md:text-sm font-medium">Video Call</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-3 md:p-4 lg:p-6 text-center space-y-2">
              <div className="mx-auto w-10 h-10 md:w-12 md:h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Phone className="h-5 w-5 md:h-6 md:w-6 text-secondary" />
              </div>
              <p className="text-xs md:text-sm font-medium">Voice Call</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-3 md:p-4 lg:p-6 text-center space-y-2">
              <div className="mx-auto w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 md:h-6 md:w-6 text-accent" />
              </div>
              <p className="text-xs md:text-sm font-medium">Chat</p>
            </CardContent>
          </Card>
        </div>

        {/* Doctors List - Responsive */}
        <div className="space-y-4">
          <h2 className="text-xl md:text-2xl">Available Professionals</h2>
          <div className="grid gap-4 md:gap-6">
            {filteredDoctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/doctor/${doctor.id}`}>
                  <Card className="hover:shadow-lg transition-all cursor-pointer">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex gap-3 md:gap-4">
                        <Avatar className="h-16 w-16 md:h-20 md:w-20 flex-shrink-0">
                          <AvatarImage src={doctor.image} alt={doctor.name} />
                          <AvatarFallback>{doctor.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="font-medium text-base md:text-lg truncate">{doctor.name}</h3>
                              <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">{doctor.specialization}</p>
                            </div>
                            {doctor.available && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs self-start flex-shrink-0">
                                Available
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{doctor.rating}</span>
                              <span className="text-muted-foreground">({doctor.reviews})</span>
                            </div>
                            <span className="text-muted-foreground">• {doctor.experience} exp</span>
                          </div>

                          <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 mt-2" size="sm">
                            Book Consultation
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}