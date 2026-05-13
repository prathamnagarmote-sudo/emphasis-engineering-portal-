import connectToDatabase from '../src/lib/mongodb';
import User from '../src/models/User';
import Order from '../src/models/Order';
import ServiceBooking from '../src/models/ServiceBooking';
import { services } from '../src/data/services';
import { courses } from '../src/data/courses';

async function fixAshvin() {
  process.env.MONGODB_URI = "mongodb+srv://engineeringemphasis_db_user:EmpEng2014@emphasiscluster01.6a7stxj.mongodb.net/?appName=emphasiscluster01";
  await connectToDatabase();
  
  const email = 'ashvinbhogesara7@gmail.com';
  const user = await User.findOne({ email });
  
  if (!user) {
    console.log('User not found');
    process.exit(1);
  }
  
  console.log('Fixing Ashvin:', user.email);
  console.log('Purchased items:', user.purchasedContent);
  
  const itemIds = user.purchasedContent;
  const itemDetails = [];
  let totalAmount = 0;
  
  for (const id of itemIds) {
    // Check services
    const serviceMatch = services.find(s => s.id === id || (s.packages && s.packages.some(p => p.id === id)));
    if (serviceMatch) {
      const pkgMatch = serviceMatch.packages?.find(p => p.id === id);
      const title = pkgMatch ? `${serviceMatch.title} - ${pkgMatch.title}` : serviceMatch.title;
      const price = pkgMatch ? pkgMatch.price : 0;
      itemDetails.push({ id, title, type: 'service', price });
      totalAmount += price;
      
      // Ensure ServiceBooking exists
      const existingBooking = await ServiceBooking.findOne({ userId: user._id, serviceId: id });
      if (!existingBooking) {
        await ServiceBooking.create({
          userId: user._id,
          serviceId: id,
          serviceTitle: title,
          status: 'pending'
        });
        console.log('Created booking for:', title);
      }
    }
    
    // Check courses
    const courseMatch = courses.find(c => c.id === id);
    if (courseMatch) {
      itemDetails.push({ id, title: courseMatch.title, type: 'course', price: courseMatch.price });
      totalAmount += courseMatch.price;
    }
  }
  
  // Check if an order already exists for this user and items
  const existingOrder = await Order.findOne({ userId: user._id });
  if (!existingOrder && itemDetails.length > 0) {
    await Order.create({
      userId: user._id,
      userEmail: user.email,
      userName: user.name,
      items: itemDetails,
      totalAmount: totalAmount,
      currency: 'cad',
      paymentStatus: 'paid',
      createdAt: user.createdAt // Use user creation time as fallback
    });
    console.log('Created Order record with total:', totalAmount);
  } else {
    console.log('Order already exists or no items to add.');
  }
  
  process.exit(0);
}

fixAshvin();
