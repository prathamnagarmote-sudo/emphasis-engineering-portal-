import CourseDetail from "@/components/pages/CourseDetail";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/courses/${decodedId}`);
    if (!res.ok) return { title: "Course Details" };
    const course = await res.json();

    return {
      title: `${course.title} Exam Prep`,
      description: course.description || `Master your engineering certification with the ${course.title} course at Emphasis Engineering. Expert-led training and comprehensive study materials.`,
      openGraph: {
        title: `${course.title} | Engineering Certification`,
        description: course.description,
        images: [course.thumbnail || "https://res.cloudinary.com/dwk1cnlw2/image/upload/v1775721626/logo-nobackground-500_prbht7.png"],
      },
    };
  } catch (error) {
    return { title: "Course Details" };
  }
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  return <CourseDetail id={resolvedParams.id} />;
}

