import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

async function check() {
  await mongoose.connect(MONGODB_URI!);
  const schema = new mongoose.Schema({}, { strict: false });
  const ServicePage = mongoose.model("ServicePage", schema, "servicepages");
  const data = await ServicePage.find({}).lean();
  console.log(JSON.stringify(data, null, 2));
  process.exit(0);
}

check();
