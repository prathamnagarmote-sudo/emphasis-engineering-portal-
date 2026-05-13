import connectToDatabase from '../src/lib/mongodb';
import Order from '../src/models/Order';

async function checkFirstOrder() {
  process.env.MONGODB_URI = "mongodb+srv://engineeringemphasis_db_user:EmpEng2014@emphasiscluster01.6a7stxj.mongodb.net/?appName=emphasiscluster01";
  await connectToDatabase();
  
  const order = await Order.findOne({});
  if (order) {
    console.log('Sample Order Items:', JSON.stringify(order.items, null, 2));
    console.log('Order Model Schema for items:', Order.schema.path('items'));
  } else {
    console.log('No orders found in DB.');
  }
  
  process.exit(0);
}

checkFirstOrder();
