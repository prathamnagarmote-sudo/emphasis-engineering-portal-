import { MongoClient, ObjectId } from 'mongodb';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

async function updatePricing() {
  const client = new MongoClient(MONGODB_URI!);
  try {
    await client.connect();
    const db = client.db();
    const servicesCollection = db.collection('services');

    // Find the Interview Preparation service
    const service = await servicesCollection.findOne({ title: /Interview Preparation/i });
    if (!service) {
      console.log('Service not found');
      return;
    }

    console.log('Found service:', service.title);

    // Update the price of the package(s)
    // Target: £350 GBP
    // Current Rate in context is approx 0.58 relative to CAD base.
    // 350 / 0.58 = 603.44. User wants it rounded.
    // Let's set it to 600 CAD.
    
    const updatedServices = service.services.map((pkg: any) => {
      if (pkg.title.toLowerCase().includes('interview')) {
        console.log('Updating package:', pkg.title, 'from', pkg.price, 'to 600');
        return { ...pkg, price: 600, originalPrice: 750 };
      }
      return pkg;
    });

    await servicesCollection.updateOne(
      { _id: service._id },
      { $set: { services: updatedServices } }
    );

    console.log('Successfully updated Interview Preparation pricing to 600 CAD (~£350 GBP)');

  } catch (error) {
    console.error('Error updating pricing:', error);
  } finally {
    await client.close();
  }
}

updatePricing();
