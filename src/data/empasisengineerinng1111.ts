"use client";

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  students: number;
  instructor: string;
  instructorImage: string;
  thumbnail: string;
  category: string;
  level: string;
  duration: string;
  lessons: number;
  isPurchased: boolean;
  videos: { title: string; duration: string; vimeoId: string }[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  packages: {
    id: string;
    title: string;
    price: number;
    features: string[];
  }[];
}

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

export const courses: Course[] = [
  {
    id: "ds-101",
    title: "Introduction and IMechE Professional Registration Interview Presentation",
    description: "Master Data Science, Machine Learning, Python, SQL, Tableau, and Statistical Analysis from scratch. Build real-world projects and become job-ready.",
    price: 70,
    originalPrice: 90.99,
    rating: 4.8,
    reviews: 2847,
    students: 15420,
    instructor: "Dr. Maxwell Oyom",
    instructorImage: "https://res.cloudinary.com/dwk1cnlw2/image/upload/f_auto,q_auto/1753446721798_vdltqd",
    thumbnail: "https://res.cloudinary.com/dwk1cnlw2/image/upload/v1775497372/IMECH-IMAGE-1_aft8g7.webp",
    category: "Chartered Engineer Masterclass",
    level: "Beginner to Advanced",
    duration: "3 hours 12 minute",
    lessons: 320,
    isPurchased: false,
    videos: [
      { title: "Introduction to Data Science", duration: "15:30", vimeoId: "76979871" },
      { title: "Python Fundamentals", duration: "22:45", vimeoId: "76979871" },
      { title: "Data Manipulation with Pandas", duration: "28:10", vimeoId: "76979871" },
    ]
  },
  {
    id: "ai-201",
    title: "AI & Machine Learning Masterclass",
    description: "Deep dive into Artificial Intelligence, Neural Networks, Deep Learning, TensorFlow, and PyTorch. Build AI-powered applications from scratch.",
    price: 94.99,
    originalPrice: 249.99,
    rating: 4.9,
    reviews: 1923,
    students: 12350,
    instructor: "Prof. Michael Rodriguez",
    instructorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=225&fit=crop",
    category: "AI/ML",
    level: "Intermediate",
    duration: "56 hours",
    lessons: 280,
    isPurchased: false,
    videos: [
      { title: "What is Machine Learning?", duration: "18:20", vimeoId: "76979871" },
      { title: "Supervised vs Unsupervised Learning", duration: "25:15", vimeoId: "76979871" },
      { title: "Building Your First Neural Network", duration: "35:40", vimeoId: "76979871" },
    ]
  },
  {
    id: "mern-301",
    title: "MERN Stack Development - Complete Guide",
    description: "Build full-stack web applications with MongoDB, Express.js, React, and Node.js. Deploy production-ready apps with modern best practices.",
    price: 79.99,
    originalPrice: 179.99,
    rating: 4.7,
    reviews: 3156,
    students: 18900,
    instructor: "Alex Thompson",
    instructorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=225&fit=crop",
    category: "MERN Stack",
    level: "Beginner to Advanced",
    duration: "62 hours",
    lessons: 410,
    isPurchased: false,
    videos: [
      { title: "Introduction to MERN Stack", duration: "12:15", vimeoId: "76979871" },
      { title: "Setting Up Your Development Environment", duration: "20:30", vimeoId: "76979871" },
      { title: "MongoDB Fundamentals", duration: "32:45", vimeoId: "76979871" },
    ]
  },
  {
    id: "cyber-401",
    title: "Cybersecurity Professional Certificate",
    description: "Become a certified cybersecurity professional. Learn ethical hacking, penetration testing, network security, and incident response.",
    price: 99.99,
    originalPrice: 299.99,
    rating: 4.9,
    reviews: 1456,
    students: 8920,
    instructor: "James Wilson",
    instructorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=225&fit=crop",
    category: "Cybersecurity",
    level: "Intermediate to Advanced",
    duration: "72 hours",
    lessons: 350,
    isPurchased: false,
    videos: [
      { title: "Introduction to Cybersecurity", duration: "16:45", vimeoId: "76979871" },
      { title: "Network Security Fundamentals", duration: "28:20", vimeoId: "76979871" },
      { title: "Ethical Hacking Basics", duration: "35:10", vimeoId: "76979871" },
    ]
  },
  {
    id: "ds-102",
    title: "Advanced Python for Data Analysis",
    description: "Take your Python skills to the next level with advanced data manipulation, visualization, and analysis techniques using modern libraries.",
    price: 69.99,
    originalPrice: 149.99,
    rating: 4.6,
    reviews: 987,
    students: 6540,
    instructor: "Dr. Emily Zhang",
    instructorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=225&fit=crop",
    category: "Data Science",
    level: "Advanced",
    duration: "38 hours",
    lessons: 180,
    isPurchased: false,
    videos: [
      { title: "Advanced NumPy Techniques", duration: "22:30", vimeoId: "76979871" },
      { title: "Data Visualization Mastery", duration: "30:15", vimeoId: "76979871" },
      { title: "Statistical Analysis with SciPy", duration: "28:45", vimeoId: "76979871" },
    ]
  },
  {
    id: "ai-202",
    title: "Natural Language Processing with Python",
    description: "Master NLP techniques including text processing, sentiment analysis, chatbots, and transformers. Build real-world NLP applications.",
    price: 84.99,
    originalPrice: 189.99,
    rating: 4.8,
    reviews: 756,
    students: 5230,
    instructor: "Dr. Priya Sharma",
    instructorImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=400&h=225&fit=crop",
    category: "AI/ML",
    level: "Intermediate",
    duration: "42 hours",
    lessons: 220,
    isPurchased: false,
    videos: [
      { title: "Introduction to NLP", duration: "18:40", vimeoId: "76979871" },
      { title: "Text Preprocessing Techniques", duration: "25:30", vimeoId: "76979871" },
      { title: "Building a Sentiment Analyzer", duration: "32:15", vimeoId: "76979871" },
    ]
  },
];

export const services: Service[] = [
  {
    id: "career-coaching",
    title: "Career Coaching",
    description: "Get personalized career guidance from industry experts to accelerate your professional growth and land your dream job.",
    icon: "Briefcase",
    features: [
      "1-on-1 mentorship sessions",
      "Resume & portfolio review",
      "Interview preparation",
      "Salary negotiation tips",
      "Career roadmap planning"
    ],
    packages: [
      {
        id: "cc-basic",
        title: "Starter Package",
        price: 199,
        features: ["2 coaching sessions", "Resume review", "LinkedIn optimization", "Email support"]
      },
      {
        id: "cc-pro",
        title: "Professional Package",
        price: 499,
        features: ["6 coaching sessions", "Complete portfolio review", "Mock interviews", "Priority support", "Job referrals"]
      }
    ]
  },
  {
    id: "corporate-training",
    title: "Corporate Training",
    description: "Upskill your entire team with customized training programs designed to meet your organization's specific needs.",
    icon: "Building2",
    features: [
      "Customized curriculum",
      "On-site or remote training",
      "Progress tracking dashboard",
      "Certification programs",
      "Dedicated account manager"
    ],
    packages: [
      {
        id: "ct-team",
        title: "Team Package",
        price: 2999,
        features: ["Up to 10 employees", "4-week program", "Custom curriculum", "Progress reports"]
      },
      {
        id: "ct-enterprise",
        title: "Enterprise Package",
        price: 9999,
        features: ["Unlimited employees", "12-week program", "Dedicated trainer", "24/7 support", "Certification"]
      }
    ]
  },
  {
    id: "project-mentorship",
    title: "Project Mentorship",
    description: "Get hands-on guidance for your personal or professional projects from experienced developers and data scientists.",
    icon: "Code2",
    features: [
      "Weekly code reviews",
      "Architecture guidance",
      "Best practices training",
      "Deployment assistance",
      "Performance optimization"
    ],
    packages: [
      {
        id: "pm-basic",
        title: "Basic Mentorship",
        price: 299,
        features: ["4 sessions/month", "Code review", "Slack support", "Resource library"]
      },
      {
        id: "pm-intensive",
        title: "Intensive Mentorship",
        price: 799,
        features: ["8 sessions/month", "Pair programming", "24/7 Slack access", "Project deployment", "Portfolio showcase"]
      }
    ]
  },
  {
    id: "interview-prep",
    title: "Interview Preparation",
    description: "Crack technical interviews at top tech companies with our comprehensive interview preparation program.",
    icon: "Target",
    features: [
      "DSA problem solving",
      "System design sessions",
      "Behavioral interview prep",
      "Company-specific prep",
      "Feedback & improvement"
    ],
    packages: [
      {
        id: "ip-standard",
        title: "Standard Prep",
        price: 349,
        features: ["10 mock interviews", "DSA practice", "Feedback reports", "Resource access"]
      },
      {
        id: "ip-premium",
        title: "Premium Prep",
        price: 899,
        features: ["25 mock interviews", "System design deep dive", "Unlimited practice", "Interview guarantee", "Negotiation coaching"]
      }
    ]
  },
  {
    id: "certification-prep",
    title: "Certification Preparation",
    description: "Prepare for industry-recognized certifications with expert-led courses and practice exams.",
    icon: "Award",
    features: [
      "Comprehensive study materials",
      "Practice exams",
      "Expert Q&A sessions",
      "Exam tips & strategies",
      "Money-back guarantee"
    ],
    packages: [
      {
        id: "cert-self",
        title: "Self-Paced",
        price: 149,
        features: ["Full course access", "Practice exams", "Study guides", "Community forum"]
      },
      {
        id: "cert-guided",
        title: "Instructor-Led",
        price: 449,
        features: ["Live sessions", "Personal mentor", "Unlimited practice exams", "Exam voucher", "100% pass guarantee"]
      }
    ]
  }
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Jennifer Martinez",
    role: "Data Scientist",
    company: "Google",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    review: "EduPro Academy transformed my career completely. The Data Science course was incredibly comprehensive and practical. Within 6 months of completing the course, I landed my dream job at Google!",
    rating: 5,
    linkedIn: "https://linkedin.com"
  },
  {
    id: "t2",
    name: "David Kim",
    role: "Senior Software Engineer",
    company: "Microsoft",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    review: "The MERN Stack course exceeded all my expectations. The instructor's teaching style and the hands-on projects helped me gain real-world skills. Highly recommended for anyone looking to become a full-stack developer.",
    rating: 5,
    linkedIn: "https://linkedin.com"
  },
  {
    id: "t3",
    name: "Sarah Thompson",
    role: "ML Engineer",
    company: "Amazon",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    review: "The AI/ML Masterclass is the best investment I've made in my education. The curriculum is up-to-date, and the practical projects gave me the confidence to apply for ML positions at top companies.",
    rating: 5,
    linkedIn: "https://linkedin.com"
  },
  {
    id: "t4",
    name: "Michael Chen",
    role: "Cybersecurity Analyst",
    company: "Tesla",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    review: "The Cybersecurity Professional Certificate program is exceptionally well-structured. The hands-on labs and real-world scenarios prepared me perfectly for my current role. The instructors are truly experts in their field.",
    rating: 5,
    linkedIn: "https://linkedin.com"
  },
  {
    id: "t5",
    name: "Emily Rodriguez",
    role: "Full Stack Developer",
    company: "Netflix",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    review: "I was skeptical at first, but EduPro Academy delivered beyond my expectations. The career coaching service helped me land a job at Netflix. The mentors truly care about your success!",
    rating: 5,
    linkedIn: "https://linkedin.com"
  },
  {
    id: "t6",
    name: "James Wilson",
    role: "Data Engineer",
    company: "Meta",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    review: "The quality of content and teaching at EduPro Academy is unmatched. I've tried other platforms, but nothing comes close. The community support and instructor availability make all the difference.",
    rating: 5,
    linkedIn: "https://linkedin.com"
  }
];
export const practiceTests = [
  {
    id: '1',
    title: 'Full Stack Developer Test',
    description: 'Test your knowledge of MERN, DSA, and core CS concepts.',
    questions: 10,
    duration: 10,
    price: 49,
    originalPrice: 99,
    rating: 4.8,
    reviews: 2847,
    students: 1200,
    category: 'MERN Stack',
    instructor: 'Alex Thompson',
    level: 'Beginner to Advanced',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c'
  },
 
];
export const practiceQuestions: Question[] = [
  {
    id: 1,
    question: "What is the time complexity of binary search algorithm?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "Which of the following is NOT a JavaScript data type?",
    options: ["String", "Boolean", "Float", "Symbol"],
    correctAnswer: 2
  },
  {
    id: 3,
    question: "What does CSS stand for?",
    options: ["Computer Style Sheets", "Creative Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets"],
    correctAnswer: 2
  },
  {
    id: 4,
    question: "Which HTTP method is used to update an existing resource?",
    options: ["GET", "POST", "PUT", "DELETE"],
    correctAnswer: 2
  },
  {
    id: 5,
    question: "What is the purpose of the 'useEffect' hook in React?",
    options: ["State management", "Side effects", "Routing", "Styling"],
    correctAnswer: 1
  },
  {
    id: 6,
    question: "Which sorting algorithm has the best average-case time complexity?",
    options: ["Bubble Sort", "Selection Sort", "Quick Sort", "Insertion Sort"],
    correctAnswer: 2
  },
  {
    id: 7,
    question: "What is a closure in JavaScript?",
    options: [
      "A function that returns another function",
      "A function that has access to variables from its outer scope",
      "A way to close the browser window",
      "A method to end a loop"
    ],
    correctAnswer: 1
  },
  {
    id: 8,
    question: "Which database is a NoSQL database?",
    options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"],
    correctAnswer: 2
  },
  {
    id: 9,
    question: "What does API stand for?",
    options: [
      "Application Programming Interface",
      "Advanced Programming Integration",
      "Application Process Integration",
      "Advanced Process Interface"
    ],
    correctAnswer: 0
  },
  {
    id: 10,
    question: "Which of the following is a Python web framework?",
    options: ["React", "Angular", "Django", "Vue"],
    correctAnswer: 2
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
  name: "Dr. Robert Anderson",
  title: "Founder & CEO",
  image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
  bio: "Dr. Robert Anderson is a visionary educator and tech entrepreneur with over 20 years of experience in the education industry. After receiving his Ph.D. in Computer Science from MIT and working at leading tech companies including Google and Amazon, he founded EduPro Academy with a mission to make quality tech education accessible to everyone. Under his leadership, EduPro Academy has grown to become one of the most trusted online learning platforms, helping over 50,000 students achieve their career goals.",
  linkedIn: "https://linkedin.com",
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
