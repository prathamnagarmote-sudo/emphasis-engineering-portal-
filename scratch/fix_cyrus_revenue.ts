import connectToDatabase from '../src/lib/mongodb';
import Order from '../src/models/Order';
import User from '../src/models/User';

async function fixCyrus() {
  process.env.MONGODB_URI = "mongodb+srv://engineeringemphasis_db_user:EmpEng2014@emphasiscluster01.6a7stxj.mongodb.net/?appName=emphasiscluster01";
  await connectToDatabase();
  
  const email = 'cyrus.sk.work@gmail.com';
  const user = await User.findOne({ email: { $regex: new RegExp(email, 'i') } });
  
  if (user) {
    await Order.findOneAndUpdate(
      { userId: user._id },
      { 
        totalAmount: 649, 
        currency: 'cad',
        country: 'HK' 
      },
      { sort: { createdAt: -1 } }
    );
    console.log('Successfully updated Cyrus to $649 CAD and Hong Kong.');
  } else {
    console.log('Cyrus not found.');
  }
  
  process.exit(0);
}

fixCyrus();
