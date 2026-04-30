import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema(
  {
    blogId: { type: String, required: true, unique: true }, // e.g. '1', '2'
    service: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    img: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: String, required: true },
    readTime: { type: String, required: true },
    tags: [{ type: String }],
    content: { type: String, required: true }, // Store HTML content
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
