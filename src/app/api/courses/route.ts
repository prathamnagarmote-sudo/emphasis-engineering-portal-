import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Course from "@/models/Course";

export async function GET() {
  try {
    await connectToDatabase();
    const courses = await Course.find({}).sort({ createdAt: 1 }).lean();
    
    const transformed = courses.map((c: any) => ({
      id: c.courseId,
      title: c.title,
      description: c.description,
      price: c.price,
      originalPrice: c.originalPrice,
      rating: c.rating,
      reviews: c.reviews,
      students: c.students,
      instructor: c.instructor,
      instructorImage: c.instructorImage,
      thumbnail: c.thumbnail,
      category: c.category,
      level: c.level,
      duration: c.duration,
      lessons: c.lessonsCount,
      curriculum: c.curriculum,
      downloadableResources: c.downloadableResources,
    }));

    return NextResponse.json(transformed, { status: 200 });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
