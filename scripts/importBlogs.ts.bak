import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { blogData as localBlogs } from "../src/data/blogData";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI missing from .env.local");
  process.exit(1);
}

// Reuse or define the Blog schema
const BlogSchema = new mongoose.Schema({
  blogId: { type: String, required: true, unique: true },
  service: { type: String, required: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  img: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: String, required: true },
  readTime: { type: String, required: true },
  content: { type: String },
  tags: [String],
}, { timestamps: true });

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

async function migrate() {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI!);
    console.log("✅ Connected.");
    console.log(`⏳ Syncing ${localBlogs.length} blogs to database...`);

    for (const b of localBlogs) {
      await Blog.findOneAndUpdate(
        { blogId: b.id },
        {
          blogId: b.id,
          service: b.service,
          title: b.title,
          desc: b.desc,
          img: b.img,
          author: b.author,
          date: b.date,
          readTime: b.readTime || "5 min read",
          content: (b as any).content || "",
          tags: (b as any).tags || [],
        },
        { upsert: true, new: true }
      );
      console.log(`✔️  Synced: ${b.title}`);
    }

    console.log("✨ ALL BLOGS SYNCED TO DATABASE!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Sync failed:", error);
    process.exit(1);
  }
}

migrate();
