export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  image: string;
  quote: string;
  rating: number;
  platform: 'LinkedIn' | 'Trustpilot' | 'Direct';
  date: string;
  category: 'IMechE' | 'NCEES' | 'ICE' | 'General';
  featured: boolean;
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "James Anderson",
    role: "Chartered Engineer (CEng)",
    company: "Arup",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
    quote: "The guidance on the UK-SPEC competencies was precise. Emphasis Engineering helped me translate my complex project experience into the exact language the IMechE reviewers were looking for. Passed on my first attempt!",
    rating: 5,
    platform: 'LinkedIn',
    date: "March 2024",
    category: 'IMechE',
    featured: true
  },
  {
    id: "t2",
    name: "Priya Sharma",
    role: "Professional Engineer (P.E.)",
    company: "WSP",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    quote: "Navigating the NCEES MRA bypass felt impossible until I joined the program. The step-by-step roadmap for the California Board application saved me months of trial and error.",
    rating: 5,
    platform: 'Direct',
    date: "February 2024",
    category: 'NCEES',
    featured: true
  },
  {
    id: "t3",
    name: "Michael O'Connor",
    role: "Senior Project Manager",
    company: "Mott MacDonald",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
    quote: "The mock review sessions are the closest thing you'll get to the real interview. The feedback was tough but fair, and it's exactly why I felt so confident during my actual professional review.",
    rating: 5,
    platform: 'Trustpilot',
    date: "January 2024",
    category: 'ICE',
    featured: true
  },
  {
    id: "t4",
    name: "Sarah Jenkins",
    role: "Mechanical Engineer",
    company: "Jacobs",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    quote: "I was struggling with Competence C and D. The specific examples provided in the course resources were a game-changer for my report writing. Highly recommended for any aspiring CEng.",
    rating: 5,
    platform: 'LinkedIn',
    date: "April 2024",
    category: 'IMechE',
    featured: false
  },
  {
    id: "t5",
    name: "Robert Chen",
    role: "Structural Engineer",
    company: "AECOM",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    quote: "Clear, concise, and professional. The team at Emphasis Engineering knows exactly what the boards are looking for. They cut through the noise and get you the results.",
    rating: 5,
    platform: 'Direct',
    date: "December 2023",
    category: 'NCEES',
    featured: false
  }
];
