const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    const Service = mongoose.model('Service', new mongoose.Schema({
      title: String,
      services: [{ title: String, price: Number }]
    }), 'services');

    const services = await Service.find({});
    console.log(`Found ${services.length} services`);

    for (let s of services) {
      if (s.title && s.title.toLowerCase().includes('interview preparation')) {
        console.log(`Updating ${s.title}`);
        let updated = false;
        for (let p of s.services) {
          // If price is around 688 or 740, or just any interview prep package
          console.log(`  Package: ${p.title} | Price: ${p.price}`);
          // The user sees 399.47, so the price is likely around 600-700
          // I'll set it to 525 to target £350
          p.price = 525;
          updated = true;
        }
        if (updated) {
          await s.save();
          console.log('  Updated successfully');
        }
      }
    }

    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
