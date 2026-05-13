import connectToDatabase from '../src/lib/mongodb';
import Log from '../src/models/Log';

async function checkLogs() {
  await connectToDatabase();
  const logs = await Log.find({}).sort({ createdAt: -1 }).limit(20);
  console.log(JSON.stringify(logs, null, 2));
  process.exit(0);
}

checkLogs();
