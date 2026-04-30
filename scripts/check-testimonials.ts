import mongoose from 'mongoose';
import connectDB from '../src/lib/mongodb';
import Testimonial from '../src/models/Testimonial';

async function check() {
  await connectDB();
  const count = await Testimonial.countDocuments();
  console.log('Total testimonials in DB:', count);
  const all = await Testimonial.find({});
  console.log('Testimonials IDs:', all.map(t => t.testimonialId || t._id));
  process.exit(0);
}

check();
