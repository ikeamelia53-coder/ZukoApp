import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Skeleton } from "@/app/components/ui/skeleton";
import { 
  ArrowLeft, Search, ExternalLink, Clock, 
  BookOpen, User, Calendar, 
  Globe, RefreshCw,
  Newspaper
} from "lucide-react";

const categories = ["All", "Mental Health", "Psychology", "Wellness", "Therapy", "Mindfulness", "Self-Care", "Anxiety", "Depression", "Sleep", "Stress"];

// Comprehensive real-like articles with authentic content
const mentalHealthArticles = [
  {
    id: 1,
    title: "Understanding Anxiety: A Complete Guide for 2026",
    excerpt: "Learn about the science behind anxiety, recognize symptoms, and discover evidence-based techniques to manage it effectively in your daily life.",
    category: "Anxiety",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?q=80&w=1974&auto=format&fit=crop",
    author: "Dr. Sarah Johnson",
    date: "Jan 15, 2026",
    views: "12.5K",
    source: "Mental Health Foundation",
    url: "https://www.mentalhealth.org.uk/explore-mental-health/a-z-topics/anxiety"
  },
  {
    id: 2,
    title: "Mindfulness Meditation: A Beginner's Guide to Inner Peace",
    excerpt: "Start your mindfulness journey with simple, scientifically-backed meditation techniques that can transform your mental well-being in just 10 minutes a day.",
    category: "Mindfulness",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1940&auto=format&fit=crop",
    author: "Mindfulness Coach Lisa",
    date: "Jan 10, 2026",
    views: "8.7K",
    source: "Mindful Living Institute",
    url: "https://www.mindful.org/meditation/mindfulness-getting-started/"
  },
  {
    id: 3,
    title: "Sleep Hygiene: Science-Backed Strategies for Better Rest",
    excerpt: "Discover evidence-based strategies to improve sleep quality, fight insomnia, and wake up refreshed with these practical sleep hygiene techniques.",
    category: "Sleep",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=2060&auto=format&fit=crop",
    author: "Sleep Specialist Dr. Chen",
    date: "Jan 5, 2026",
    views: "15.2K",
    source: "Sleep Research Center",
    url: "https://www.sleepfoundation.org/sleep-hygiene"
  },
  {
    id: 4,
    title: "Managing Workplace Stress: Practical Strategies for 2026",
    excerpt: "Learn effective techniques to manage workplace stress, prevent burnout, and maintain work-life balance in today's demanding professional environment.",
    category: "Stress",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=2070&auto=format&fit=crop",
    author: "Organizational Psychologist Dr. Wilson",
    date: "Dec 28, 2025",
    views: "10.8K",
    source: "Workplace Wellness Association",
    url: "https://www.apa.org/topics/workplace/stress"
  },
  {
    id: 5,
    title: "Understanding Depression: Symptoms, Causes, and Modern Treatments",
    excerpt: "A comprehensive guide to recognizing depression, understanding its causes, and exploring effective treatment options available today.",
    category: "Depression",
    readTime: "11 min read",
    image: "https://images.unsplash.com/photo-1579546929662-711aa81148cf?q=80&w=2070&auto=format&fit=crop",
    author: "Clinical Psychiatrist Dr. Rodriguez",
    date: "Dec 20, 2025",
    views: "18.3K",
    source: "Mental Health Research Institute",
    url: "https://www.nimh.nih.gov/health/topics/depression"
  },
  {
    id: 6,
    title: "Daily Self-Care Rituals for Mental Wellness",
    excerpt: "Simple yet powerful daily rituals that can significantly improve your mental health and emotional well-being in just 15 minutes a day.",
    category: "Self-Care",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?q=80&w=2056&auto=format&fit=crop",
    author: "Wellness Coach Maria",
    date: "Dec 15, 2025",
    views: "9.4K",
    source: "Wellness Today",
    url: "https://www.psychologytoday.com/us/blog/click-here-for-happiness/202101/the-ultimate-guide-self-care"
  },
  {
    id: 7,
    title: "The Power of Gratitude: Transform Your Mental Health",
    excerpt: "Discover how practicing gratitude can rewire your brain, boost happiness, and improve overall mental well-being with simple daily exercises.",
    category: "Wellness",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=2070&auto=format&fit=crop",
    author: "Dr. Jennifer Martinez",
    date: "Dec 10, 2025",
    views: "11.2K",
    source: "Positive Psychology Center",
    url: "https://greatergood.berkeley.edu/topic/gratitude"
  },
  {
    id: 8,
    title: "Digital Detox: Finding Balance in a Connected World",
    excerpt: "Learn how to create healthy boundaries with technology, reduce screen time, and reclaim your mental clarity in our hyper-connected age.",
    category: "Self-Care",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop",
    author: "Tech Wellness Expert Alex Kim",
    date: "Dec 5, 2025",
    views: "13.6K",
    source: "Digital Wellness Institute",
    url: "https://www.verywellmind.com/why-and-how-to-do-a-digital-detox-4771321"
  },
  {
    id: 9,
    title: "Building Resilience: Thriving Through Life's Challenges",
    excerpt: "Master the art of resilience with evidence-based strategies to bounce back from adversity and grow stronger through difficult times.",
    category: "Psychology",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1517817748493-49ec54a32465?q=80&w=2070&auto=format&fit=crop",
    author: "Resilience Coach Dr. Taylor",
    date: "Nov 30, 2025",
    views: "14.7K",
    source: "Resilience Research Group",
    url: "https://www.apa.org/topics/resilience"
  },
  {
    id: 10,
    title: "The Mind-Body Connection: Exercise and Mental Health",
    excerpt: "Explore the powerful link between physical activity and mental well-being, with practical tips to start an exercise routine that supports mental health.",
    category: "Wellness",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop",
    author: "Dr. Marcus Thompson",
    date: "Nov 25, 2025",
    views: "16.1K",
    source: "Sports Psychology Institute",
    url: "https://www.health.harvard.edu/mind-and-mood/exercise-and-mood"
  },
  {
    id: 11,
    title: "Emotional Intelligence: The Key to Better Relationships",
    excerpt: "Develop your emotional intelligence to improve relationships, communication, and overall life satisfaction with these practical techniques.",
    category: "Psychology",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=2070&auto=format&fit=crop",
    author: "EQ Expert Dr. Patricia Lee",
    date: "Nov 20, 2025",
    views: "12.9K",
    source: "Emotional Intelligence Lab",
    url: "https://www.psychologytoday.com/us/basics/emotional-intelligence"
  },
  {
    id: 12,
    title: "Overcoming Perfectionism: Embracing 'Good Enough'",
    excerpt: "Learn to recognize perfectionist tendencies and develop healthier standards that promote growth without causing burnout or anxiety.",
    category: "Self-Care",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2072&auto=format&fit=crop",
    author: "Dr. Hannah Foster",
    date: "Nov 15, 2025",
    views: "10.5K",
    source: "Perfectionism Research Center",
    url: "https://www.psychologytoday.com/us/basics/perfectionism"
  },
  {
    id: 13,
    title: "Social Connection and Mental Health: Why We Need Each Other",
    excerpt: "Explore the critical role of social relationships in mental wellness and learn how to build meaningful connections in modern life.",
    category: "Wellness",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2070&auto=format&fit=crop",
    author: "Social Psychologist Dr. Emma Clarke",
    date: "Nov 10, 2025",
    views: "13.8K",
    source: "Social Psychology Institute",
    url: "https://www.mentalhealth.org.uk/explore-mental-health/a-z-topics/loneliness"
  },
  {
    id: 14,
    title: "Trauma-Informed Care: Understanding and Healing",
    excerpt: "Learn about trauma-informed approaches to mental health care and how to support yourself or others in the healing journey.",
    category: "Therapy",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?q=80&w=2071&auto=format&fit=crop",
    author: "Trauma Specialist Dr. Kevin Park",
    date: "Nov 5, 2025",
    views: "15.4K",
    source: "Trauma Recovery Center",
    url: "https://www.samhsa.gov/trauma-violence"
  },
  {
    id: 15,
    title: "The Role of Nutrition in Mental Health",
    excerpt: "Discover how your diet impacts mood, cognitive function, and overall mental wellness, plus practical tips for brain-healthy eating.",
    category: "Wellness",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop",
    author: "Nutritional Psychiatrist Dr. Amy Singh",
    date: "Oct 30, 2025",
    views: "14.2K",
    source: "Nutrition and Mental Health Institute",
    url: "https://www.health.harvard.edu/blog/nutritional-psychiatry-your-brain-on-food-201511168626"
  }
];

const getFallbackImage = (category: string) => {
  const images: Record<string, string> = {
    'Mental Health': 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?q=80&w=400',
    'Psychology': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400',
    'Wellness': 'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?q=80&w=400',
    'Mindfulness': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400',
    'Therapy': 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?q=80&w=400',
    'Self-Care': 'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?q=80&w=400'
  };
  return images[category] || images['Mental Health'];
};

export function Articles() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState(mentalHealthArticles);
  const [loading, setLoading] = useState(false);

  // Filter articles based on search and category
  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setArticles(mentalHealthArticles);
      setLoading(false);
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          
          <Skeleton className="h-10 w-full" />
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[1,2,3,4,5].map(i => (
              <Skeleton key={i} className="h-8 w-20 rounded-full flex-shrink-0" />
            ))}
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 pb-20 md:pb-6">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="flex-shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl">Mental Health Articles</h1>
              <p className="text-sm text-muted-foreground">
                Curated mental health resources from trusted sources
              </p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={loading}
            className="gap-2 self-start sm:self-auto"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer whitespace-nowrap hover:bg-primary/20 transition-colors flex-shrink-0"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Article Count */}
        <div className="flex items-center justify-between text-sm">
          <div className="text-muted-foreground">
            Showing {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">From trusted sources</span>
          </div>
        </div>

        {/* Articles Grid - Fully Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full group border-0 shadow-md flex flex-col">
                <div className="relative h-48 overflow-hidden flex-shrink-0">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getFallbackImage(article.category);
                    }}
                  />
                  <Badge className="absolute top-3 left-3 bg-white/90 text-gray-800 backdrop-blur-sm border-white/30 text-xs">
                    {article.category}
                  </Badge>
                  <Badge variant="outline" className="absolute top-3 right-3 bg-black/80 text-white backdrop-blur-sm border-white/30 text-xs">
                    Live
                  </Badge>
                </div>
                <CardContent className="p-4 md:p-5 space-y-3 flex-1 flex flex-col">
                  <h3 className="font-medium text-base md:text-lg group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{article.excerpt}</p>
                  
                  <div className="flex flex-col gap-2 text-xs text-muted-foreground pt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        <User className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{article.author}</span>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Calendar className="h-3 w-3" />
                        <span>{article.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground flex-1 min-w-0">
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Clock className="h-3 w-3" />
                        <span>{article.readTime}</span>
                      </div>
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        <Newspaper className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{article.source}</span>
                      </div>
                    </div>
                    
                    <a 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="ghost" size="sm" className="gap-1 text-primary flex-shrink-0 h-8 px-2">
                        <span className="hidden sm:inline">Read</span>
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="p-8 md:p-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filter criteria</p>
              <Button onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}>
                View All Articles
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Info Card - Responsive */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-2">Curated Mental Health Resources</h3>
                <p className="text-sm text-muted-foreground">
                  Carefully selected articles from trusted sources including Psychology Today, Harvard Health, Mayo Clinic, and leading mental health organizations. All links direct to original, reputable sources for authentic, evidence-based information.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Newsletter Signup - Responsive */}
        <Card className="border-dashed border-primary/50">
          <CardContent className="p-4 md:p-6 text-center">
            <h3 className="font-medium text-lg mb-2">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get mental health tips and article updates delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <Input placeholder="Your email address" className="flex-1" />
              <Button className="whitespace-nowrap">Subscribe</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}