import mongoose from 'mongoose';

async function checkOrders() {
  const uri = "mongodb+srv://engineeringemphasis_db_user:EmpEng2014@emphasiscluster01.6a7stxj.mongodb.net/?appName=emphasiscluster01";
  await mongoose.connect(uri);
  
  const OrderSchema = new mongoose.Schema({}, { strict: false, collection: 'orders' });
  const Order = mongoose.models.OrderCheck || mongoose.model('OrderCheck', OrderSchema);
  
  const count = await Order.countDocuments();
  console.log(`Total Orders in Database: ${count}`);
  
  if (count > 0) {
    const samples = await Order.find().limit(5);
    samples.forEach((s: any) => {
      console.log(`Order: ${s._id} | User: ${s.userEmail} | Items: ${Array.isArray(s.items) ? s.items.length : 0}`);
    });
  }
  
  process.exit(0);
}

checkOrders();
