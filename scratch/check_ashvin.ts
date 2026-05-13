import connectToDatabase from '../src/lib/mongodb';
import Order from '../src/models/Order';
import User from '../src/models/User';

async function checkAshvin() {
  process.env.MONGODB_URI = "mongodb+srv://engineeringemphasis_db_user:EmpEng2014@emphasiscluster01.6a7stxj.mongodb.net/?appName=emphasiscluster01";
  await connectToDatabase();
  const email = 'ashvinbhogesara7@gmail.com';
  const user = await User.findOne({ email });
  console.log('User found:', user ? 'Yes' : 'No');
  if (user) {
    console.log('Purchased Content:', user.purchasedContent);
  }
  
  const orders = await Order.find({ userEmail: email });
  console.log('Orders found:', orders.length);
  console.log('Orders:', JSON.stringify(orders, null, 2));
  
  process.exit(0);
}

checkAshvin();
