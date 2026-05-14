import Courses from "@/components/pages/Courses";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Engineering Certification Courses & Exam Prep",
  description: "Master your engineering exams with our comprehensive prep courses. Expert-led training for NPPE, FE Exam, and professional practice exams.",
};

export default function Page() { return <Courses />; }
