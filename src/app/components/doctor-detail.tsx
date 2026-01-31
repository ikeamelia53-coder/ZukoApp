import { motion } from "motion/react";
import { useNavigate, useParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
import { ArrowLeft, Star, Award, Calendar, MapPin, Clock } from "lucide-react";

const doctorData = {
  1: {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialization: "Clinical Psychologist",
    rating: 4.9,
    reviews: 312,
    experience: "6 years",
    image: "https://images.unsplash.com/photo-1659353888906-adb3e0041693?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Dr. Sarah Johnson is a licensed clinical psychologist with over 6 years of experience specializing in cognitive behavioral therapy (CBT) and trauma-informed care. She has helped hundreds of patients overcome anxiety disorders, depression, and PTSD through evidence-based approaches.",
    education: [
      "Ph.D. in Clinical Psychology - Stanford University",
      "M.A. in Psychology - UCLA",
      "B.S. in Psychology - UC Berkeley"
    ],
    certifications: [
      "Licensed Clinical Psychologist (LCP)",
      "Certified Cognitive Behavioral Therapist",
      "Trauma-Focused CBT Specialist",
      "APA Certified Psychologist"
    ],
    languages: ["English", "Spanish", "French"],
    price: "$150 per session",
  },
  2: {
    id: 2,
    name: "Dr. Michael Chen",
    specialization: "Psychiatrist",
    rating: 4.8,
    reviews: 287,
    experience: "10 years",
    image: "https://plus.unsplash.com/premium_photo-1681996359725-06262b082c27?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Dr. Michael Chen is a board-certified psychiatrist with a decade of experience in pharmacological and psychotherapeutic treatments. He specializes in mood disorders, ADHD, and medication management, using a holistic approach to mental health care.",
    education: [
      "M.D. in Psychiatry - Johns Hopkins University",
      "Residency in Psychiatry - Massachusetts General Hospital",
      "B.S. in Neuroscience - MIT"
    ],
    certifications: [
      "Board Certified Psychiatrist",
      "Fellow of American Psychiatric Association",
      "ADHD Specialist Certification",
      "Psychopharmacology Expert"
    ],
    languages: ["English", "Mandarin"],
    price: "$180 per session",
  },
  3: {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialization: "Counseling Psychologist",
    rating: 4.7,
    reviews: 245,
    experience: "8 years",
    image: "https://images.unsplash.com/photo-1734002886107-168181bcd6a1?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Dr. Emily Rodriguez specializes in counseling psychology with a focus on relationship issues, life transitions, and stress management. Her empathetic approach helps clients develop coping strategies and improve their overall quality of life.",
    education: [
      "Ph.D. in Counseling Psychology - University of Texas",
      "M.Ed. in Counseling - Columbia University",
      "B.A. in Psychology - University of Florida"
    ],
    certifications: [
      "Licensed Professional Counselor",
      "Certified Relationship Therapist",
      "Gottman Method Couples Therapy (Level 2)",
      "Mindfulness-Based Stress Reduction Certified"
    ],
    languages: ["English", "Spanish", "Portuguese"],
    price: "$130 per session",
  },
  4: {
    id: 4,
    name: "Dr. David Miller",
    specialization: "Child & Adolescent Psychiatrist",
    rating: 4.8,
    reviews: 421,
    experience: "12 years",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Dr. David Miller has dedicated his career to child and adolescent psychiatry. With extensive experience in developmental disorders, school-related issues, and family therapy, he provides comprehensive care for young patients and their families.",
    education: [
      "M.D. in Child Psychiatry - Harvard Medical School",
      "Fellowship in Child Psychiatry - Boston Children's Hospital",
      "B.S. in Developmental Psychology - University of Michigan"
    ],
    certifications: [
      "Board Certified Child & Adolescent Psychiatrist",
      "Autism Spectrum Disorder Specialist",
      "Play Therapy Certified",
      "Pediatric Psychopharmacology Expert"
    ],
    languages: ["English"],
    price: "$200 per session",
  },
  5: {
    id: 5,
    name: "Dr. Lisa Wong",
    specialization: "Forensic Psychologist",
    rating: 4.9,
    reviews: 189,
    experience: "9 years",
    image: "https://images.unsplash.com/photo-1594824434340-7e7dfc37cabb?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Dr. Lisa Wong specializes in forensic psychology, working at the intersection of psychology and law. She provides expert evaluations, risk assessments, and therapy for individuals involved in legal proceedings.",
    education: [
      "Ph.D. in Forensic Psychology - University of Pennsylvania",
      "J.D. Law Degree - Yale Law School",
      "M.A. in Clinical Psychology - Northwestern University"
    ],
    certifications: [
      "Licensed Forensic Psychologist",
      "Certified Expert Witness",
      "Risk Assessment Specialist",
      "Correctional Psychology Certified"
    ],
    languages: ["English", "Cantonese"],
    price: "$220 per session",
  },
  6: {
    id: 6,
    name: "Dr. Robert Kim",
    specialization: "Geriatric Psychiatrist",
    rating: 4.7,
    reviews: 312,
    experience: "15 years",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Dr. Robert Kim specializes in geriatric psychiatry, focusing on the mental health needs of older adults. He has extensive experience with dementia, late-life depression, and the unique challenges of aging.",
    education: [
      "M.D. in Geriatric Psychiatry - University of California",
      "Fellowship in Geriatric Psychiatry - Mayo Clinic",
      "B.S. in Gerontology - University of Southern California"
    ],
    certifications: [
      "Board Certified Geriatric Psychiatrist",
      "Dementia Care Specialist",
      "Palliative Care Psychiatry Certified",
      "Certified Alzheimer's Disease Expert"
    ],
    languages: ["English", "Korean"],
    price: "$190 per session",
  },
  7: {
    id: 7,
    name: "Dr. Maria Garcia",
    specialization: "Neuropsychologist",
    rating: 4.8,
    reviews: 267,
    experience: "11 years",
    image: "https://images.unsplash.com/photo-1618498082418-5c1c6c1b5a5c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Dr. Maria Garcia is a clinical neuropsychologist specializing in brain-behavior relationships. She conducts comprehensive neuropsychological assessments and provides rehabilitation for patients with brain injuries and neurological conditions.",
    education: [
      "Ph.D. in Neuropsychology - University of Florida",
      "Postdoctoral Fellowship in Clinical Neuropsychology - Cleveland Clinic",
      "M.S. in Neuroscience - University of Chicago"
    ],
    certifications: [
      "Board Certified Neuropsychologist",
      "Certified Brain Injury Specialist",
      "Epilepsy Monitoring Certified",
      "Cognitive Rehabilitation Therapist"
    ],
    languages: ["English", "Spanish"],
    price: "$250 per session",
  },
  8: {
    id: 8,
    name: "Dr. James Wilson",
    specialization: "Addiction Psychiatrist",
    rating: 4.6,
    reviews: 198,
    experience: "7 years",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Dr. James Wilson specializes in addiction psychiatry, providing comprehensive treatment for substance use disorders and behavioral addictions. He combines medication-assisted treatment with psychotherapy for optimal outcomes.",
    education: [
      "M.D. in Psychiatry - University of Washington",
      "Addiction Psychiatry Fellowship - Hazelden Betty Ford",
      "B.S. in Pharmacology - University of Minnesota"
    ],
    certifications: [
      "Board Certified Addiction Psychiatrist",
      "Certified Addiction Specialist",
      "Medication-Assisted Treatment Certified",
      "Substance Abuse Professional"
    ],
    languages: ["English"],
    price: "$170 per session",
  },
  9: {
    id: 9,
    name: "Dr. Amanda Lee",
    specialization: "Health Psychologist",
    rating: 4.9,
    reviews: 356,
    experience: "8 years",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Dr. Amanda Lee focuses on health psychology, helping patients manage chronic illnesses, cope with medical procedures, and adopt healthy behaviors. She works closely with medical teams to provide integrated care.",
    education: [
      "Ph.D. in Health Psychology - University of North Carolina",
      "M.P.H. in Behavioral Health - Johns Hopkins University",
      "B.S. in Health Sciences - University of Virginia"
    ],
    certifications: [
      "Licensed Health Psychologist",
      "Chronic Disease Management Specialist",
      "Pain Management Psychology Certified",
      "Health Behavior Change Expert"
    ],
    languages: ["English", "Korean"],
    price: "$160 per session",
  },
  10: {
    id: 10,
    name: "Dr. Thomas Baker",
    specialization: "Sports Psychologist",
    rating: 4.7,
    reviews: 289,
    experience: "6 years",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Dr. Thomas Baker works with athletes at all levels to enhance performance, overcome mental blocks, and manage competition anxiety. He also helps athletes transition from sports careers.",
    education: [
      "Ph.D. in Sports Psychology - University of Tennessee",
      "M.S. in Kinesiology - University of Michigan",
      "B.A. in Psychology - University of Oregon"
    ],
    certifications: [
      "Certified Sports Psychologist",
      "Mental Performance Consultant",
      "Athlete Career Transition Specialist",
      "Peak Performance Coach"
    ],
    languages: ["English"],
    price: "$180 per session",
  },
  11: {
    id: 11,
    name: "Dr. Sophia Martinez",
    specialization: "Trauma Psychologist",
    rating: 4.9,
    reviews: 312,
    experience: "10 years",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Dr. Sophia Martinez specializes in trauma psychology, providing evidence-based treatments for PTSD, complex trauma, and dissociative disorders. She incorporates EMDR, somatic experiencing, and other trauma-focused modalities.",
    education: [
      "Ph.D. in Trauma Psychology - New York University",
      "EMDR Certification - EMDR Institute",
      "M.A. in Counseling Psychology - University of Denver"
    ],
    certifications: [
      "Certified Trauma Specialist",
      "EMDR Certified Therapist",
      "Complex PTSD Specialist",
      "Somatic Experiencing Practitioner"
    ],
    languages: ["English", "Spanish", "Italian"],
    price: "$200 per session",
  },
  12: {
    id: 12,
    name: "Dr. Kevin Patel",
    specialization: "Sleep Disorder Psychiatrist",
    rating: 4.8,
    reviews: 234,
    experience: "9 years",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Dr. Kevin Patel specializes in sleep medicine psychiatry, treating insomnia, sleep apnea, narcolepsy, and circadian rhythm disorders. He combines sleep studies with behavioral interventions for comprehensive care.",
    education: [
      "M.D. in Sleep Medicine - University of Pennsylvania",
      "Fellowship in Sleep Psychiatry - Stanford University",
      "B.S. in Neuroscience - Duke University"
    ],
    certifications: [
      "Board Certified Sleep Medicine Specialist",
      "Certified in Behavioral Sleep Medicine",
      "Sleep Study Interpretation Certified",
      "Insomnia Treatment Specialist"
    ],
    languages: ["English", "Hindi", "Gujarati"],
    price: "$190 per session",
  },
  13: {
    id: 13,
    name: "Dr. Jennifer Taylor",
    specialization: "Eating Disorder Specialist",
    rating: 4.7,
    reviews: 278,
    experience: "8 years",
    image: "https://images.unsplash.com/photo-1594824434340-7e7dfc37cabb?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Dr. Jennifer Taylor specializes in treating eating disorders including anorexia, bulimia, binge eating disorder, and ARFID. She takes a multidisciplinary approach involving nutrition, therapy, and medical monitoring.",
    education: [
      "Ph.D. in Clinical Psychology - University of Colorado",
      "Specialization in Eating Disorders - Renfrew Center",
      "M.A. in Health Psychology - Boston University"
    ],
    certifications: [
      "Certified Eating Disorder Specialist",
      "Family-Based Treatment Certified",
      "Intuitive Eating Counselor",
      "Body Image Therapy Specialist"
    ],
    languages: ["English"],
    price: "$175 per session",
  },
  14: {
    id: 14,
    name: "Dr. Benjamin Carter",
    specialization: "Occupational Psychologist",
    rating: 4.6,
    reviews: 245,
    experience: "7 years",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Dr. Benjamin Carter focuses on occupational psychology, helping individuals with workplace stress, career transitions, burnout, and improving work-life balance. He also provides organizational consulting.",
    education: [
      "Ph.D. in Industrial-Organizational Psychology - Michigan State",
      "M.S. in Organizational Psychology - University of Maryland",
      "B.A. in Business Psychology - Cornell University"
    ],
    certifications: [
      "Certified Organizational Psychologist",
      "Executive Coaching Certification",
      "Burnout Prevention Specialist",
      "Workplace Stress Management Expert"
    ],
    languages: ["English", "German"],
    price: "$165 per session",
  },
  15: {
    id: 15,
    name: "Dr. Olivia Davis",
    specialization: "Marriage & Family Therapist",
    rating: 4.9,
    reviews: 423,
    experience: "11 years",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Dr. Olivia Davis is a licensed marriage and family therapist specializing in couples counseling, family dynamics, and premarital counseling. She uses evidence-based approaches to strengthen relationships.",
    education: [
      "Ph.D. in Marriage and Family Therapy - University of Southern California",
      "M.S. in Family Studies - University of Illinois",
      "B.A. in Sociology - University of California, Davis"
    ],
    certifications: [
      "Licensed Marriage and Family Therapist",
      "Gottman Method Couples Therapy (Level 3)",
      "Emotionally Focused Therapy Certified",
      "Discernment Counseling Specialist"
    ],
    languages: ["English", "French"],
    price: "$195 per session",
  },
};

// Testimonials yang berbeda untuk setiap dokter
const doctorTestimonials = {
  1: [
    { name: "Emma W.", rating: 5, text: "Dr. Johnson's CBT techniques helped me overcome severe anxiety that I've had for 10 years. Her structured approach gave me tools I use daily.", date: "2 weeks ago" },
    { name: "Michael R.", rating: 4, text: "Very professional. I appreciate her evidence-based approach, though I wish sessions were a bit longer for the price.", date: "1 month ago" },
    { name: "Sarah L.", rating: 5, text: "After trying 3 different therapists, Dr. Johnson was the first who truly understood my PTSD. Her trauma-informed care is exceptional.", date: "3 weeks ago" },
    { name: "David K.", rating: 3, text: "Good therapist but sometimes hard to get appointment times that work with my schedule.", date: "2 months ago" },
    { name: "Jessica M.", rating: 5, text: "Life-changing! I went from multiple panic attacks daily to none in 2 months. Highly recommend for anxiety disorders.", date: "1 week ago" },
  ],
  2: [
    { name: "Brian T.", rating: 5, text: "Dr. Chen's medication management combined with therapy has been perfect for my bipolar disorder. He really listens.", date: "3 weeks ago" },
    { name: "Lisa S.", rating: 4, text: "Excellent psychiatrist. Very knowledgeable about ADHD medications. Helped my son tremendously.", date: "1 month ago" },
    { name: "Robert J.", rating: 5, text: "Finally found a psychiatrist who takes a holistic approach. The combination of meds and therapy works wonders.", date: "2 weeks ago" },
    { name: "Megan P.", rating: 3, text: "Good doctor but the office wait times can be long. Once you're in session though, he's very thorough.", date: "2 months ago" },
    { name: "Alex K.", rating: 5, text: "Dr. Chen helped me find the right medication after years of trial and error. Life is manageable now.", date: "1 week ago" },
  ],
  3: [
    { name: "Olivia R.", rating: 5, text: "Dr. Rodriguez helped me through a difficult divorce. Her counseling gave me strength and clarity.", date: "3 weeks ago" },
    { name: "Daniel L.", rating: 4, text: "Great for relationship counseling. My partner and I communicate much better after just 6 sessions.", date: "1 month ago" },
    { name: "Sophia M.", rating: 5, text: "Her approach to stress management transformed how I handle work pressure. The mindfulness techniques are invaluable.", date: "2 weeks ago" },
    { name: "Thomas W.", rating: 3, text: "Good therapist, but I expected more practical tools for my specific situation.", date: "2 months ago" },
    { name: "Grace H.", rating: 5, text: "Dr. Rodriguez has a warm, empathetic presence that immediately makes you feel comfortable opening up.", date: "1 week ago" },
  ],
  4: [
    { name: "Parent of Alex", rating: 5, text: "Dr. Miller worked wonders with my autistic son. His play therapy approach helped my child express emotions for the first time.", date: "3 weeks ago" },
    { name: "Teen Patient", rating: 4, text: "He actually listens to teenagers! Not like other doctors who just talk to parents.", date: "1 month ago" },
    { name: "Jessica R.", rating: 5, text: "My daughter's anxiety about school has decreased significantly thanks to Dr. Miller's techniques.", date: "2 weeks ago" },
    { name: "Mark T.", rating: 3, text: "Wish he had more weekend appointments for working parents.", date: "2 months ago" },
    { name: "Sarah K.", rating: 5, text: "Dr. Miller helped our family understand and support our child with ADHD. Whole family approach is amazing.", date: "1 week ago" },
  ],
  5: [
    { name: "Legal Client", rating: 5, text: "Dr. Wong's forensic evaluation was thorough and professional. Her expert testimony was crucial for my case.", date: "3 weeks ago" },
    { name: "John D.", rating: 4, text: "As a lawyer, I appreciate Dr. Wong's precise and objective assessments. Highly professional.", date: "1 month ago" },
    { name: "Corrections Officer", rating: 5, text: "Her risk assessment tools have improved our facility's safety protocols significantly.", date: "2 weeks ago" },
    { name: "Michael S.", rating: 3, text: "Very knowledgeable but the reports sometimes take longer than promised.", date: "2 months ago" },
    { name: "Attorney", rating: 5, text: "Dr. Wong is my go-to expert witness. Her credentials and presentation are impeccable.", date: "1 week ago" },
  ],
  6: [
    { name: "Daughter of Patient", rating: 5, text: "Dr. Kim's care for my elderly mother with dementia has been compassionate and effective.", date: "3 weeks ago" },
    { name: "Senior Patient", rating: 4, text: "He understands the unique challenges we face as older adults. Respectful and patient.", date: "1 month ago" },
    { name: "Caregiver", rating: 5, text: "Dr. Kim provides excellent guidance for managing medications in elderly patients with multiple conditions.", date: "2 weeks ago" },
    { name: "Robert L.", rating: 3, text: "Good doctor but limited appointment slots for new patients.", date: "2 months ago" },
    { name: "Family Member", rating: 5, text: "His palliative care approach brought peace to my father's final months. Grateful beyond words.", date: "1 week ago" },
  ],
  7: [
    { name: "Brain Injury Patient", rating: 5, text: "Dr. Garcia's neuropsychological assessment pinpointed issues other doctors missed. Life-changing diagnosis.", date: "3 weeks ago" },
    { name: "Epilepsy Patient", rating: 4, text: "Her comprehensive testing helped optimize my seizure management plan.", date: "1 month ago" },
    { name: "Stroke Survivor", rating: 5, text: "The cognitive rehabilitation program Dr. Garcia designed helped me regain my memory and concentration.", date: "2 weeks ago" },
    { name: "David R.", rating: 3, text: "Testing process is very long but thorough.", date: "2 months ago" },
    { name: "MS Patient", rating: 5, text: "Dr. Garcia understands the cognitive aspects of neurological conditions like no one else. Highly recommended.", date: "1 week ago" },
  ],
  8: [
    { name: "Recovery Patient", rating: 5, text: "Dr. Wilson's combination of medication and therapy saved my life. 2 years sober thanks to his program.", date: "3 weeks ago" },
    { name: "Family Member", rating: 4, text: "He provides excellent support not just for patients but for families dealing with addiction.", date: "1 month ago" },
    { name: "Former Patient", rating: 5, text: "The relapse prevention strategies Dr. Wilson taught me have been invaluable in maintaining my recovery.", date: "2 weeks ago" },
    { name: "Anonymous", rating: 3, text: "Good program but wish there were more group therapy options.", date: "2 months ago" },
    { name: "Gambling Addiction", rating: 5, text: "Dr. Wilson helped me overcome a gambling addiction that was destroying my family and finances.", date: "1 week ago" },
  ],
  9: [
    { name: "Diabetes Patient", rating: 5, text: "Dr. Lee helped me manage the psychological aspects of living with chronic illness. Life-changing support.", date: "3 weeks ago" },
    { name: "Cancer Survivor", rating: 4, text: "Her techniques for coping with medical trauma were exactly what I needed during treatment.", date: "1 month ago" },
    { name: "Chronic Pain", rating: 5, text: "Dr. Lee's pain management psychology techniques reduced my pain medication needs by 50%.", date: "2 weeks ago" },
    { name: "Patient", rating: 3, text: "Wish she had more availability for follow-up appointments.", date: "2 months ago" },
    { name: "Transplant Patient", rating: 5, text: "Her support through my organ transplant process was invaluable. She truly understands medical psychology.", date: "1 week ago" },
  ],
  10: [
    { name: "Professional Athlete", rating: 5, text: "Dr. Baker's mental performance coaching took my game to the next level. Broke my personal records!", date: "3 weeks ago" },
    { name: "College Athlete", rating: 4, text: "Great help with competition anxiety. Wish sessions were more affordable for student athletes.", date: "1 month ago" },
    { name: "Retired Pro", rating: 5, text: "Dr. Baker's career transition program helped me find purpose after retiring from professional sports.", date: "2 weeks ago" },
    { name: "Coach", rating: 3, text: "Good techniques but implementation takes time to see results.", date: "2 months ago" },
    { name: "Weekend Warrior", rating: 5, text: "Even as an amateur athlete, his mental training improved my performance and enjoyment of the sport.", date: "1 week ago" },
  ],
  11: [
    { name: "PTSD Patient", rating: 5, text: "Dr. Martinez's EMDR therapy healed trauma I've carried for 20 years. Truly life-changing work.", date: "3 weeks ago" },
    { name: "Combat Veteran", rating: 4, text: "Finally a therapist who understands military trauma. The somatic experiencing techniques are powerful.", date: "1 month ago" },
    { name: "Accident Survivor", rating: 5, text: "After my car accident, Dr. Martinez helped me process the trauma when nothing else worked.", date: "2 weeks ago" },
    { name: "Patient", rating: 3, text: "Therapy is intense but effective. Need time to process between sessions.", date: "2 months ago" },
    { name: "Complex Trauma", rating: 5, text: "Dr. Martinez is one of the few therapists truly skilled in treating complex PTSD. Grateful for her expertise.", date: "1 week ago" },
  ],
  12: [
    { name: "Insomnia Patient", rating: 5, text: "After 10 years of poor sleep, Dr. Patel's program gave me my nights back. Sleeping naturally for the first time in ages.", date: "3 weeks ago" },
    { name: "Sleep Apnea", rating: 4, text: "His combined approach of CPAP therapy and behavioral interventions worked better than either alone.", date: "1 month ago" },
    { name: "Shift Worker", rating: 5, text: "Dr. Patel helped me manage my circadian rhythm as a nurse working night shifts. Life-saving advice.", date: "2 weeks ago" },
    { name: "Patient", rating: 3, text: "Sleep studies can be expensive but necessary for proper diagnosis.", date: "2 months ago" },
    { name: "Narcolepsy", rating: 5, text: "Finally a proper diagnosis and treatment plan for my narcolepsy. Dr. Patel's expertise is unparalleled.", date: "1 week ago" },
  ],
  13: [
    { name: "Anorexia Recovery", rating: 5, text: "Dr. Taylor saved my life. Her comprehensive approach to eating disorder treatment addresses both mind and body.", date: "3 weeks ago" },
    { name: "Parent", rating: 4, text: "Her family-based treatment approach helped our daughter recover from bulimia. Whole family involvement was key.", date: "1 month ago" },
    { name: "BED Patient", rating: 5, text: "Dr. Taylor's intuitive eating approach helped me break free from binge eating cycles. No more dieting!", date: "2 weeks ago" },
    { name: "Patient", rating: 3, text: "Recovery is a long process but worth it.", date: "2 months ago" },
    { name: "Body Image", rating: 5, text: "Her body image therapy transformed my relationship with my body after years of self-hatred.", date: "1 week ago" },
  ],
  14: [
    { name: "Executive", rating: 5, text: "Dr. Carter's executive coaching helped me overcome burnout and lead more effectively. Worth every penny.", date: "3 weeks ago" },
    { name: "Career Changer", rating: 4, text: "His career transition program gave me clarity and confidence to make a major career change at 45.", date: "1 month ago" },
    { name: "HR Manager", rating: 5, text: "Dr. Carter's workplace stress management workshops transformed our company culture. Absenteeism decreased by 40%.", date: "2 weeks ago" },
    { name: "Employee", rating: 3, text: "Good strategies but implementation requires organizational buy-in.", date: "2 months ago" },
    { name: "Entrepreneur", rating: 5, text: "His work-life balance techniques helped me grow my business without sacrificing my health or family.", date: "1 week ago" },
  ],
  15: [
    { name: "Couple", rating: 5, text: "Dr. Davis saved our marriage. Her Gottman method approach gave us tools to communicate and reconnect.", date: "3 weeks ago" },
    { name: "Family", rating: 4, text: "Her family therapy helped us navigate a difficult blended family situation. Communication has improved dramatically.", date: "1 month ago" },
    { name: "Premarital", rating: 5, text: "Best investment we made before our wedding. Dr. Davis's premarital counseling prepared us for a strong marriage.", date: "2 weeks ago" },
    { name: "Client", rating: 3, text: "Wish she offered more flexible session packages.", date: "2 months ago" },
    { name: "Divorcing Couple", rating: 5, text: "Even though we're divorcing, Dr. Davis helped us communicate respectfully for our children's sake. Priceless.", date: "1 week ago" },
  ],
};

export function DoctorDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const doctorId = Number(id) as keyof typeof doctorData;
  const doctor = doctorData[doctorId] || doctorData[1];
  const testimonials = doctorTestimonials[doctorId] || doctorTestimonials[1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 pb-20 md:pb-6">
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl md:text-3xl">Professional Profile</h1>
        </div>

        {/* Doctor Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <Avatar className="h-32 w-32 mx-auto md:mx-0">
                  <AvatarImage src={doctor.image} alt={doctor.name} />
                  <AvatarFallback>{doctor.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-2xl font-medium">{doctor.name}</h2>
                    <p className="text-muted-foreground">{doctor.specialization}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{doctor.rating}</span>
                      <span className="text-muted-foreground">({doctor.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4 text-primary" />
                      <span>{doctor.experience} experience</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {doctor.languages.map((lang) => (
                      <Badge key={lang} variant="outline">{lang}</Badge>
                    ))}
                  </div>

                  <div className="text-lg font-medium text-primary">{doctor.price}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{doctor.bio}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Education & Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Education & Certifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Education</h3>
                <ul className="space-y-2">
                  {doctor.education.map((edu, index) => (
                    <li key={index} className="text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{edu}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium mb-3">Certifications</h3>
                <ul className="space-y-2">
                  {doctor.certifications.map((cert, index) => (
                    <li key={index} className="text-muted-foreground flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span>{cert}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Patient Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <div key={index}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{testimonial.name}</span>
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{testimonial.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{testimonial.text}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Book Consultation CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="sticky bottom-20 md:bottom-6"
        >
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1">
                  <p className="font-medium">Ready to book a consultation?</p>
                  <p className="text-sm text-muted-foreground">Choose between online or in-person sessions</p>
                </div>
                <Button 
                  size="lg" 
                  className="w-full md:w-auto bg-primary hover:bg-primary/90"
                  onClick={() => navigate(`/booking/${doctor.id}`)}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Consultation
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}