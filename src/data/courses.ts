import { Course } from "@/types";

export const courses: Course[] = [
  {
    id: "imech-101",
    title: "Chartered Engineer Masterclass – Achieve CEng IMechE",
    description:
      "A structured, expert-led program guiding mechanical engineers through the IMechE Chartered Engineer registration process. Covers competency frameworks, report writing, and the Professional Review Interview.",
    price: 70,
    originalPrice: 90.99,
    rating: 4.8,
    reviews: 2847,
    students: 15420,
    instructor: "Dr. Maxwell Oyom",
    instructorImage:
      "https://res.cloudinary.com/dwk1cnlw2/image/upload/f_auto,q_auto/1753446721798_vdltqd",
    thumbnail:
      "https://res.cloudinary.com/dwk1cnlw2/image/upload/v1775497372/IMECH-IMAGE-1_aft8g7.webp",
    category: "Chartered Engineer Masterclass-IMECH",
    level: "Beginner to Advanced",
    duration: "3 hours 12 minutes",
    lessons: 14,
    isPurchased: false,
    curriculum: [
      {
        section: "Introduction to IMechE Chartered Engineer Pathway",
        lessons: [
          { id: "imech-101-l1", title: "Introduction and IMechE Presentation", duration: "03:39", vimeoId: "1166966274", free: true },
        ],
      },
      {
        section: "CEng Process with The IMechE",
        lessons: [
          { id: "imech-101-l2", title: "IMechE CEng Process – Step-by-Step Guide", duration: "10:22", free: false },
          { id: "imech-101-l3", title: "Route to IMechE CEng – Navigating the Process", duration: "20:28", free: false },
        ],
      },
      {
        section: "Work Experience and IMechE Professional Report",
        lessons: [
          { id: "imech-101-l4", title: "IMechE Professional Report – Expert Tips", duration: "04:39", free: false },
          { id: "imech-101-l5", title: "Writing Your Competency Report (Part 2)", duration: "27:14", free: false },
          { id: "imech-101-l6", title: "IMechE Scoring Matrix", duration: "02:30", free: false },
        ],
      },
      {
        section: "Preparing for IMechE Professional Review Interview",
        lessons: [
          { id: "imech-101-l7", title: "Interview Preparation", duration: "17:47", free: false },
          { id: "imech-101-l8", title: "Competence A and B Deep Dive", duration: "34:16", free: false },
          { id: "imech-101-l9", title: "Competence C Deep Dive", duration: "33:47", free: false },
          { id: "imech-101-l10", title: "Competence D Deep Dive", duration: "03:22", free: false },
          { id: "imech-101-l11", title: "Competence E Deep Dive", duration: "34:01", free: false },
        ],
      },
      {
        section: "IMechE Course Resources",
        lessons: [
          { id: "imech-101-l12", title: "Downloadable Materials", duration: "00:15", free: false },
        ],
      },
    ],
    // legacy flat list kept for compatibility
    videos: [
      { title: "Introduction & IMechE Overview", duration: "03:39", vimeoId: "76979871" },
      { title: "IMechE CEng Process – Step-by-Step Guide", duration: "10:22", vimeoId: "76979871" },
      { title: "Route to IMechE CEng – Navigating the Process", duration: "20:28", vimeoId: "76979871" },
      { title: "IMechE Professional Report – Expert Tips and Strategies", duration: "04:39", vimeoId: "76979871" },
      { title: "Writing Your Competency Report (Part 2)", duration: "27:14", vimeoId: "76979871" },
      { title: "IMechE Scoring Matrix", duration: "02:30", vimeoId: "76979871" },
      { title: "Professional Review Interview Preparation", duration: "17:47", vimeoId: "76979871" },
    ],
    downloadableResources: [
      {
        title: "IMechE Competency Mapping Template",
        description: "Editable template to map your experience to UK-SPEC competencies.",
        type: "DOCX",
        fileSize: "1.2 MB",
        url: "#",
      },
      {
        title: "Professional Review Interview Checklist",
        description: "Step-by-step checklist for interview readiness and evidence packaging.",
        type: "PDF",
        fileSize: "680 KB",
        url: "#",
      },
      {
        title: "Sample Professional Report Structure",
        description: "Example structure and formatting guide for high-scoring submissions.",
        type: "PDF",
        fileSize: "940 KB",
        url: "#",
      },
    ],
  },

  {
    id: "iet-101",
    title: "Chartered Engineer Masterclass – IET Registration",
    description:
      "A complete coaching program for engineers pursuing CEng registration through the IET. Covers the IET Career Manager platform, competency mapping, supporter strategy, and interview preparation.",
    price: 70,
    originalPrice: 90.99,
    rating: 4.8,
    reviews: 2314,
    students: 12800,
    instructor: "Dr. Maxwell Oyom",
    instructorImage:
      "https://res.cloudinary.com/dwk1cnlw2/image/upload/f_auto,q_auto/1753446721798_vdltqd",
    thumbnail:
      "https://res.cloudinary.com/dwk1cnlw2/image/upload/v1775733358/IET-IMGGE-1_wozwpx.jpg",
    category: "Chartered Engineer Masterclass-IET",
    level: "Beginner to Advanced",
    duration: "3 hours 20 minutes",
    lessons: 13,
    isPurchased: false,
    curriculum: [
      {
        section: "Introduction to IET Chartered Engineer Pathway",
        lessons: [
          { id: "iet-101-l1", title: "IET Chartered Engineer Overview – Introduction and Expectations", duration: "00:00", vimeoId: "1166937140", free: true },
        ],
      },
      {
        section: "CEng Process with The IET",
        lessons: [
          { id: "iet-101-l2", title: "IET CEng Process – Step-by-Step Guide", duration: "10:17", free: false },
          { id: "iet-101-l3", title: "Route to IET CEng– Navigating the Process", duration: "20:02", free: false },
        ],
      },
      {
        section: "Work Experience and IET Professional Report",
        lessons: [
          { id: "iet-101-l4", title: "Engineering CV – Tailored for IET CEng", duration: "04:39", free: false },
          { id: "iet-101-l5", title: "IET Professional Report – Expert Tips and Strategies", duration: "22:14", free: false },
          { id: "iet-101-l6", title: "Assessment Summary", duration: "04:36", free: false },
          { id: "iet-101-l7", title: "IET Scoring Matrix - Achieving Top Scores for UK-SPEC Competence", duration: "02:52", free: false },
        ],
      },
      {
        section: "Preparing for IET Professional Registration Interview",
        lessons: [
          { id: "iet-101-l8", title: "IET Professional Registration Interview Preparation", duration: "17:52", free: false },
          { id: "iet-101-l9", title: "IET Professional Registration Interview - UK-SPEC Competence A and B", duration: "34:16", free: false },
          { id: "iet-101-l10", title: "IET Professional Registration Interview - UK-SPEC Competence C", duration: "33:47", free: false },
          { id: "iet-101-l11", title: "IET Professional Registration Interview - UK-SPEC Competence D", duration: "03:22", free: false },
          { id: "iet-101-l12", title: "IET Professional Registration Interview - UK-SPEC Competence E", duration: "34:53", free: false },
        ],
      },
      {
        section: "IET Course Resources",
        lessons: [
          { id: "iet-101-l13", title: "IET CEng Downloadable Course Materials – Essential Resources for Preparation", duration: "00:15", free: false },
        ],
      },
    ],
    videos: [
      { title: "Introduction to IET Registration", duration: "05:12", vimeoId: "76979871" },
      { title: "Understanding IET Career Manager", duration: "18:40", vimeoId: "76979871" },
      { title: "Competency Mapping & Documentation", duration: "22:10", vimeoId: "76979871" },
      { title: "Interview Preparation & Presentation", duration: "16:48", vimeoId: "76979871" },
    ],
    downloadableResources: [
      {
        title: "IET Career Manager Writing Guide",
        description: "Practical framework for writing concise and compelling competency statements.",
        type: "PDF",
        fileSize: "780 KB",
        url: "#",
      },
      {
        title: "Supporter Briefing Pack",
        description: "A clear guide to help supporters provide strong and relevant endorsements.",
        type: "DOCX",
        fileSize: "1.0 MB",
        url: "#",
      },
      {
        title: "IET Interview Practice Questions",
        description: "Question bank for UK-SPEC competence A-E interview preparation.",
        type: "PDF",
        fileSize: "560 KB",
        url: "#",
      },
    ],
  },

  {
    id: "ice-101",
    title: "MICE – ICE Chartered Engineer Registration Masterclass",
    description:
      "Expert-led guidance for civil engineers pursuing Member of ICE (MICE) and Chartered Engineer status. Covers ICE attribute mapping, professional review report writing, and sustainability frameworks.",
    price: 75,
    originalPrice: 99.99,
    rating: 4.9,
    reviews: 1876,
    students: 9640,
    instructor: "Dr. Maxwell Oyom",
    instructorImage:
      "https://res.cloudinary.com/dwk1cnlw2/image/upload/f_auto,q_auto/1753446721798_vdltqd",
    thumbnail:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80",
    category: "MICE",
    level: "Intermediate to Advanced",
    duration: "3 hours 45 minutes",
    lessons: 13,
    isPurchased: false,
    curriculum: [
      {
        section: "Introduction to ICE Chartered Civil Engineer Pathway",
        lessons: [
          { id: "ice-101-l1", title: "ICE Chartered Civil Engineer Overview – Introduction and Expectations", duration: "04:05", vimeoId: "1166966969", free: true },
        ],
      },
      {
        section: "CEng Certification Process with ICE",
        lessons: [
          { id: "ice-101-l2", title: "ICE Certification Process – Step-by-Step Guide", duration: "13:03", free: false },
          { id: "ice-101-l3", title: "Route to CEng – Navigating the Process", duration: "23:22", free: false },
        ],
      },
      {
        section: "ICE Academic Assessment Requirements",
        lessons: [
          { id: "ice-101-l4", title: "ICE Academic Requirements – Key Criteria for Certification", duration: "06:05", free: false },
        ],
      },
      {
        section: "Work Experience for ICE Membership",
        lessons: [
          { id: "ice-101-l5", title: "ICE Civil Engineering CV for Membership – Tailoring Your Application", duration: "04:39", free: false },
          { id: "ice-101-l6", title: "ICE Attributes – Explanation and Examples", duration: "05:59", free: false },
          { id: "ice-101-l7", title: "ICE attributes – Scoring Matrix", duration: "03:22", free: false },
        ],
      },
      {
        section: "Preparing for ICE Professional Review Interview",
        lessons: [
          { id: "ice-101-l8", title: "ICE Professional Review Interview Preparation", duration: "20:34", free: false },
          { id: "ice-101-l9", title: "ICE Professional Registration Interview - Attribute 1", duration: "34:16", free: false },
          { id: "ice-101-l10", title: "ICE Professional Registration Interview - Attribute 2", duration: "22:03", free: false },
          { id: "ice-101-l11", title: "ICE Professional Registration Interview - Attribute 3", duration: "11:50", free: false },
          { id: "ice-101-l12", title: "ICE Professional Registration Interview - Attribute 4", duration: "10:06", free: false },
          { id: "ice-101-l13", title: "ICE Professional Registration Interview - Attribute 5", duration: "06:48", free: false },
          { id: "ice-101-l14", title: "ICE Professional Registration Interview - Attribute 6", duration: "03:23", free: false },
          { id: "ice-101-l15", title: "ICE Professional Registration Interview - Attribute 7", duration: "18:53", free: false },
          { id: "ice-101-l16", title: "Reviewers Feedback on Candidates Report and Interview Performance", duration: "08:05", free: false },
        ],
      },
      {
        section: "ICE Course Resources for Certification",
        lessons: [
          { id: "ice-101-l17", title: "ICE Downloadable Course Materials – Essential Resources for Preparation", duration: "00:15", free: false },
        ],
      },
    ],
    videos: [
      { title: "ICE Registration Overview", duration: "06:15", vimeoId: "76979871" },
      { title: "ICE Attribute Framework", duration: "14:30", vimeoId: "76979871" },
      { title: "Writing the Professional Review Report", duration: "33:20", vimeoId: "76979871" },
      { title: "Sustainability & Health & Safety", duration: "18:10", vimeoId: "76979871" },
    ],
    downloadableResources: [
      {
        title: "ICE Attribute Evidence Matrix",
        description: "Worksheet for mapping project evidence to ICE attributes.",
        type: "XLSX",
        fileSize: "420 KB",
        url: "#",
      },
      {
        title: "Professional Review Report Blueprint",
        description: "Report blueprint with section-by-section writing prompts.",
        type: "DOCX",
        fileSize: "1.4 MB",
        url: "#",
      },
      {
        title: "Sustainability Statement Examples",
        description: "Realistic examples to improve sustainability and H&S narratives.",
        type: "PDF",
        fileSize: "710 KB",
        url: "#",
      },
    ],
  },

  {
    id: "peng-101",
    title: "Canadian P.Eng – Professional Engineer Licensing Masterclass",
    description:
      "A comprehensive program for engineers pursuing P.Eng licensure in Canada. Covers Competency-Based Assessment (CBA), the NPPE exam, validator strategy, and provincial application processes.",
    price: 75,
    originalPrice: 99.99,
    rating: 4.7,
    reviews: 1542,
    students: 8320,
    instructor: "Dr. Maxwell Oyom",
    instructorImage:
      "https://res.cloudinary.com/dwk1cnlw2/image/upload/f_auto,q_auto/1753446721798_vdltqd",
    thumbnail:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    category: "Canadian PEng",
    level: "Beginner to Advanced",
    duration: "4 hours 10 minutes",
    lessons: 13,
    isPurchased: false,
    curriculum: [
      {
        section: "Introduction",
        lessons: [
          { id: "peng-101-l1", title: "PEO Professional Engineer Overview – Introduction and Expectations", duration: "01:16", vimeoId: "1166968035", free: true },
        ],
      },
      {
        section: "P. Eng Process with Professional Engineers Ontario",
        lessons: [
          { id: "peng-101-l2", title: "P. Eng Process with Professional Engineers Ontario", duration: "26:53", free: false },
        ],
      },
      {
        section: "Competency Based Assessment",
        lessons: [
          { id: "peng-101-l3", title: "Competency Based Assessment", duration: "12:17", free: false },
        ],
      },
      {
        section: "NPPE Mindset",
        lessons: [
          { id: "peng-101-l4", title: "NPPE Mindset", duration: "00:39", free: false },
        ],
      },
      {
        section: "Downloadable Resources",
        lessons: [
          { id: "peng-101-l5", title: "Downloadable Resources", duration: "00:19", free: false },
        ],
      },
    ],
    videos: [
      { title: "Canadian P.Eng Licensing Overview", duration: "08:22", vimeoId: "76979871" },
      { title: "Competency-Based Assessment (CBA)", duration: "24:15", vimeoId: "76979871" },
      { title: "NPPE Exam Preparation", duration: "18:30", vimeoId: "76979871" },
      { title: "Validator Strategy & Submission", duration: "14:20", vimeoId: "76979871" },
    ],
    downloadableResources: [
      {
        title: "CBA Narrative Writing Workbook",
        description: "Guided workbook to craft strong Canadian CBA competency examples.",
        type: "DOCX",
        fileSize: "1.6 MB",
        url: "#",
      },
      {
        title: "NPPE Study Planner",
        description: "6-week revision planner with topic and practice checkpoints.",
        type: "PDF",
        fileSize: "520 KB",
        url: "#",
      },
      {
        title: "Validator Outreach Email Templates",
        description: "Ready-to-use templates for contacting and briefing validators.",
        type: "DOCX",
        fileSize: "390 KB",
        url: "#",
      },
    ],
  },
];