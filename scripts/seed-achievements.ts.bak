import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI!;

const AchievementSchema = new mongoose.Schema({
  name: String,
  credential: String,
  location: String,
  detail: String,
  photo: String,
  badge: String,
  color: String,
  isActive: Boolean,
  expiresAt: Date,
});

const Achievement = mongoose.models.Achievement || mongoose.model("Achievement", AchievementSchema);

const ACHIEVEMENTS = [
  {
    name: "Adedayo Stephen Osore",
    credential: "IET Membership",
    location: "United Kingdom",
    detail: "A great milestone and an important step towards becoming a Chartered Engineer (CEng).",
    photo: "https://res.cloudinary.com/dwk1cnlw2/image/upload/v1777457986/adedayo_stephen_osore_ykbthf.jpg",
    badge: "MIET",
    color: "#3F9FA3",
    isActive: true,
    expiresAt: null,
  },
  {
    name: "Nicky Wa",
    credential: "CEng (MIET)",
    location: "Hong Kong",
    detail: "Successfully achieved Chartered Engineer status with the support of Emphasis Engineering.",
    photo: "https://res.cloudinary.com/dwk1cnlw2/image/upload/v1777458169/nicky_wha_adwauo.jpg",
    badge: "CEng",
    color: "#2d9b9f",
    isActive: true,
    expiresAt: null,
  },
];

async function seedAchievements() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected!");

  // Delete existing ones to prevent duplicates if ran multiple times
  await Achievement.deleteMany({});
  
  await Achievement.insertMany(ACHIEVEMENTS);
  console.log("Seeded 2 achievements!");

  await mongoose.disconnect();
}

seedAchievements().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
