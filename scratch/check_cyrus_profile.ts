import connectToDatabase from '../src/lib/mongodb';
import User from '../src/models/User';

async function checkCyrus() {
  process.env.MONGODB_URI = "mongodb+srv://engineeringemphasis_db_user:EmpEng2014@emphasiscluster01.6a7stxj.mongodb.net/?appName=emphasiscluster01";
  await connectToDatabase();
  
  const email = 'cyrus.sk.work@gmail.com';
  const user = await User.findOne({ email: { $regex: new RegExp(email, 'i') } });
  
  if (user) {
    console.log('Cyrus User found:', {
      email: user.email,
      purchasedContent: user.purchasedContent
    });
  } else {
    console.log('Cyrus NOT found.');
  }
  
  process.exit(0);
}

checkCyrus();
