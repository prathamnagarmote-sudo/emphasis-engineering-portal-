import connectToDatabase from '../src/lib/mongodb';
import Order from '../src/models/Order';

async function fixPatrickDuplicate() {
  process.env.MONGODB_URI = "mongodb+srv://engineeringemphasis_db_user:EmpEng2014@emphasiscluster01.6a7stxj.mongodb.net/?appName=emphasiscluster01";
  await connectToDatabase();
  
  const email = 'pccvalenzuela@gmail.com';
  
  // Find all orders for Patrick
  const orders = await Order.find({ userEmail: { $regex: new RegExp(email, 'i') } });
  
  console.log(`Found ${orders.length} orders for Patrick.`);
  orders.forEach(o => console.log(`Order ${o._id}: $${o.totalAmount} | Items: ${o.items?.length || 0} | Stripe: ${o.stripeSessionId}`));
  
  if (orders.length > 1) {
    // Keep the one with items, add the Stripe ID if needed, and delete the rest
    const orderWithItems = orders.find(o => o.items && o.items.length > 0);
    const orderWithStripe = orders.find(o => o.stripeSessionId);
    
    if (orderWithItems && orderWithStripe && String(orderWithItems._id) !== String(orderWithStripe._id)) {
      // Merge Stripe ID into the one with items
      await Order.findByIdAndUpdate(orderWithItems._id, {
        stripeSessionId: orderWithStripe.stripeSessionId,
        country: orderWithStripe.country || 'Canada'
      });
      
      // Delete the empty Stripe order to remove the duplicate $40
      await Order.findByIdAndDelete(orderWithStripe._id);
      console.log('Successfully merged and deleted duplicate order. Total is now $40.');
    }
  } else {
    console.log('No duplicates found.');
  }
  
  process.exit(0);
}

fixPatrickDuplicate();
