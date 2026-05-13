import connectToDatabase from '../src/lib/mongodb';
import Order from '../src/models/Order';
import User from '../src/models/User';

async function debugAshvin() {
  process.env.MONGODB_URI = "mongodb+srv://engineeringemphasis_db_user:EmpEng2014@emphasiscluster01.6a7stxj.mongodb.net/?appName=emphasiscluster01";
  await connectToDatabase();
  
  const email = 'ashvinbhogesara7@gmail.com';
  console.log('Searching for email:', email);
  
  const user = await User.findOne({ email: { $regex: new RegExp(email, 'i') } });
  if (!user) {
    console.log('User NOT found in DB');
    process.exit(1);
  }
  
  console.log('User found:', {
    id: user._id,
    email: user.email,
    purchasedContent: user.purchasedContent
  });
  
  const orders = await Order.find({ 
    $or: [
      { userId: user._id },
      { userEmail: { $regex: new RegExp(email, 'i') } }
    ]
  });
  
  console.log(`Found ${orders.length} orders for this user.`);
  orders.forEach((o, i) => {
    console.log(`Order ${i + 1}:`, {
      id: o._id,
      totalAmount: o.totalAmount,
      userEmail: o.userEmail,
      userId: o.userId,
      items: o.items?.map((item: any) => item.title)
    });
  });
  
  process.exit(0);
}

debugAshvin();
