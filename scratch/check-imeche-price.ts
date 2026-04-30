import mongoose from "mongoose";
import dotenv from "dotenv";
import ServicePage from "../src/models/Service";

dotenv.config({ path: ".env.local" });

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected to MongoDB");
    
    const page = await ServicePage.findOne({ pageId: "imeche" });
    if (!page) {
      console.log("Page 'imeche' not found");
      const all = await ServicePage.find({}, 'pageId');
      console.log("Available pageIds:", all.map(p => p.pageId));
    } else {
      console.log("Page found:", page.title);
      page.services.forEach((s: any) => {
        console.log(`- Service: ${s.title}, Price: ${s.price}`);
      });
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
check();
