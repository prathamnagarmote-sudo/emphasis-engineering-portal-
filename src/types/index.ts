export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image?: string;
  calendlyLink?: string;
  features: string[];
  packages: {
    id: string;
    title: string;
    price: number;
    popular?: boolean; // Highlight popular packages
    features: string[];
  }[];
  faqs?: {
    question: string;
    answer: string;
  }[];
  steps?: { // Standardized name for process cards
    step: number;
    title: string;
    description: string;
    content?: string;
    icon?: string;
  }[];
  phases?: { // Keep for backward compatibility if needed, but prefer 'steps'
    step: number;
    title: string;
    description: string;
    content: string;
  }[];
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface PracticeTest {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  duration: number;
  questions: number;
  instructor: string;
  level: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice: number;
  isFree?: boolean;
}

export interface Video {
  title: string;
  duration: string;
  vimeoId: string;
}

export interface CurriculumLesson {
  id?: string; // Secure lesson identifier (matched in MongoDB)
  title: string;
  duration: string;
  vimeoId?: string; // Optional — if provided, it's public. If missing, we fetch from API.
  /** true = watchable as a free preview */
  free?: boolean;
}

export interface CurriculumSection {
  section: string;
  lessons: CurriculumLesson[];
}

export interface DownloadableResource {
  title: string;
  description: string;
  type: string;
  fileSize: string;
  url: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  duration: string;
  level: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  students: number;
  instructor: string;
  instructorImage: string;
  lessons: number;
  isPurchased: boolean;
  videos: Video[];
  /** Sectioned curriculum — powers the accordion curriculum view */
  curriculum?: CurriculumSection[];
  downloadableResources?: DownloadableResource[];
}