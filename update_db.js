const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const OrderSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  userEmail: String,
  userName: String,
  items: Array,
  totalAmount: Number,
  paymentStatus: String,
  createdAt: Date
}, { strict: false });

const UserSchema = new mongoose.Schema({
  email: String,
  name: String,
  purchasedContent: [String]
}, { strict: false });

const PracticeTestSchema = new mongoose.Schema({
  title: String
}, { strict: false });

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const PracticeTest = mongoose.models.PracticeTest || mongoose.model('PracticeTest', PracticeTestSchema);

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const test = await PracticeTest.findOne({ title: { $regex: /nppe/i } });
  const testId = test ? test._id.toString() : 'nppe-test-1';

  const patrick = await User.findOne({ email: 'pccvalenzuela@gmail.com' });
  if (patrick) {
    if (!patrick.purchasedContent) patrick.purchasedContent = [];
    if (!patrick.purchasedContent.includes(testId)) {
      patrick.purchasedContent.push(testId);
      await patrick.save();
      console.log('Granted NPPE access to Patrick with ID:', testId);
    }
    
    const existingPOrder = await Order.findOne({ userEmail: 'pccvalenzuela@gmail.com' });
    if (!existingPOrder) {
      await Order.create({
        userId: patrick._id,
        userEmail: patrick.email,
        userName: patrick.name,
        items: [{ title: 'NPPE practise test', price: 40 }],
        totalAmount: 40,
        paymentStatus: 'paid',
        stripeSessionId: 'legacy_patrick',
        createdAt: new Date('2026-04-13T21:59:23Z')
      });
      console.log('Created order for Patrick');
    } else {
        console.log('Patrick order exists');
    }
  } else {
    console.log('Patrick not found in DB');
  }

  const cyrus = await User.findOne({ email: 'cyrus.sk.work@gmail.com' });
  if (cyrus) {
    const existingCOrder = await Order.findOne({ userEmail: 'cyrus.sk.work@gmail.com' });
    if (!existingCOrder) {
      await Order.create({
        userId: cyrus._id,
        userEmail: cyrus.email,
        userName: cyrus.name,
        items: [{ title: 'ICE - Interview Preparation', price: 649 }],
        totalAmount: 649,
        paymentStatus: 'paid',
        stripeSessionId: 'legacy_cyrus',
        createdAt: new Date('2026-05-07T10:49:02Z')
      });
      console.log('Created order for Cyrus');
    } else {
        console.log('Cyrus order exists');
    }
  } else {
    console.log('Cyrus not found in DB');
  }

  process.exit(0);
}

run().catch(console.error);
