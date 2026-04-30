

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  review: string;
  rating: number;
  linkedIn?: string;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Thomas Anderson",
    role: "Chartered Engineer",
    company: "Arup",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    review: "The US PE pathway support was exceptional. The guidance on NCEES record setup saved me weeks of confusion. Highly recommended for any UK engineer looking to expand to the US.",
    rating: 5,
    linkedIn: "https://linkedin.com"
  },
  {
    id: "t2",
    name: "Sarah Jenkins",
    role: "Mechanical Engineer",
    company: "Rolls-Royce",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    review: "The IMechE registration support was structured and professional. The mock interviews were a game-changer for my confidence during the professional review.",
    rating: 5,
    linkedIn: "https://linkedin.com"
  },
  {
    id: "t3",
    name: "David Chen",
    role: "Civil Engineer",
    company: "Mott MacDonald",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    review: "I finally achieved my CEng status with ICE thanks to the attribute mapping guidance provided by Emphasis. The mentorship was world-class.",
    rating: 5,
    linkedIn: "https://linkedin.com"
  },
  {
    id: "t4",
    name: "Elena Rodriguez",
    role: "P.Eng.",
    company: "SNC-Lavalin",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    review: "Navigating Canadian licensure (P.Eng.) as an international engineer seemed impossible until I found this platform. The CBA guidance was spot on.",
    rating: 5,
    linkedIn: "https://linkedin.com"
  },
  {
    id: "t5",
    name: "Marcus Thorne",
    role: "Structural Engineer",
    company: "WSP",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    review: "The technical report writing workshops are a must for anyone pursuing their professional registration. It turned my experience into a compelling narrative.",
    rating: 5,
    linkedIn: "https://linkedin.com"
  },
  {
    id: "t6",
    name: "Priya Sharma",
    role: "IET Member",
    company: "National Grid",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    review: "Emphasis Engineering is the only platform that truly understands the nuances of IET registration. Their feedback was incredibly detailed and helpful.",
    rating: 5,
    linkedIn: "https://linkedin.com"
  }
];


export const blogs = [
  {
    id: '1',
    title: 'How to Become a Full Stack Developer',
    description: 'A complete roadmap to become a modern full stack developer.',
    category: 'Development',
    author: 'John Doe',
    date: 'March 2025',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
    content: 'Full blog content here...'
  },
  {
    id: '2',
    title: 'Top 10 DSA Questions for Interviews',
    description: 'Most asked DSA questions in FAANG interviews.',
    category: 'DSA',
    author: 'Alex Smith',
    date: 'April 2025',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4',
    content: 'Full blog content here...'
  }
];
export const companyStats = [
  { label: "Students Enrolled", value: "50,000+", icon: "Users" },
  { label: "Courses Available", value: "200+", icon: "BookOpen" },
  { label: "Expert Instructors", value: "50+", icon: "GraduationCap" },
  { label: "Job Placements", value: "95%", icon: "TrendingUp" }
];

export const founderInfo = {
  name: "Maxwell Oyom",
  title: "Founder & CEO",
  image: "https://res.cloudinary.com/dwk1cnlw2/image/upload/v1775497245/1753446721798_vdltqd.jpg",
  bio: "Maxwell Oyom is an experienced engineering professional and industry leader with a strong background in construction management and large-scale projects. Passionate about empowering the next generation of engineers, he founded Emphasis Engineering to bridge the gap between academic learning and real-world industry needs.Through this platform, he aims to provide practical courses, hands-on practice tests, and career-focused guidance, helping students build confidence and succeed in competitive technical careers.",
  linkedIn: "https://www.linkedin.com/in/maxwell-oyom?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  twitter: "https://twitter.com"
};

export const timeline = [
  {
    year: "2019",
    title: "The Beginning",
    description: "EduPro Academy was founded with a vision to democratize tech education."
  },
  {
    year: "2020",
    title: "Rapid Growth",
    description: "Expanded to 50+ courses and reached 10,000 students during the pandemic."
  },
  {
    year: "2021",
    title: "Corporate Partnerships",
    description: "Launched corporate training programs with Fortune 500 companies."
  },
  {
    year: "2022",
    title: "Global Expansion",
    description: "Extended operations to 30+ countries with localized content."
  },
  {
    year: "2023",
    title: "AI Integration",
    description: "Introduced AI-powered personalized learning paths and recommendations."
  },
  {
    year: "2024",
    title: "Industry Leader",
    description: "Recognized as a top online learning platform with 50,000+ students."
  }
];
