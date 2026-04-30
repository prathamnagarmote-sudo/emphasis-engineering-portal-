import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Course from "@/models/Course";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const resolvedParams = await params;
    
    const c = await Course.findOne({ courseId: resolvedParams.id }).lean();

    if (!c) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    const transformed = {
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
    };

    return NextResponse.json(transformed, { status: 200 });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
