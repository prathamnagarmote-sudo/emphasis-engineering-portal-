import connectToDatabase from "../src/lib/mongodb";
import PracticeTest from "../src/models/PracticeTest";

async function listTests() {
  await connectToDatabase();
  const tests = await PracticeTest.find({}).select('testId title');
  console.log("Existing Tests in DB:", JSON.stringify(tests, null, 2));
  process.exit(0);
}

listTests();
