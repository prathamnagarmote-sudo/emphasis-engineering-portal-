import connectToDatabase from "../src/lib/mongodb";
import ServicePage from "../src/models/Service";

async function checkServices() {
  await connectToDatabase();
  const services = await ServicePage.find({}, { pageId: 1, title: 1 }).lean();
  console.log("Services in DB:", JSON.stringify(services, null, 2));
  process.exit(0);
}

checkServices();
