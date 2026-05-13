import connectToDatabase from '../src/lib/mongodb';
import User from '../src/models/User';

async function checkPurchases() {
  process.env.MONGODB_URI = "mongodb+srv://engineeringemphasis_db_user:EmpEng2014@emphasiscluster01.6a7stxj.mongodb.net/?appName=emphasiscluster01";
  await connectToDatabase();
  
  const users = await User.find({ purchasedContent: { $exists: true, $not: { $size: 0 } } });
  
  console.log(`Found ${users.length} users with purchases:`);
  users.forEach(u => {
    console.log(`- ${u.name} (${u.email}): ${u.purchasedContent.join(', ')} (${u.purchasedContent.length} items)`);
  });
  
  process.exit(0);
}

checkPurchases();
