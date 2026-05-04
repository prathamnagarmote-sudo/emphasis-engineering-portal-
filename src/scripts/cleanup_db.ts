import dbConnect from '../lib/dbConnect';
import ServicePage from '../models/ServicePage';

async function cleanup() {
  try {
    await dbConnect();
    console.log('Connected to DB');

    const pages = await ServicePage.find({});
    console.log(`Found ${pages.length} service pages`);

    for (const page of pages) {
      let updated = false;
      if (page.services && Array.isArray(page.services)) {
        page.services.forEach((service: any) => {
          if (service.features && Array.isArray(service.features)) {
            const initialCount = service.features.length;
            service.features = service.features.filter((f: string) => 
              f.toLowerCase() !== 'ai response' && 
              f.toLowerCase() !== 'ai feedback' &&
              f.toLowerCase() !== 'instant ai feedback'
            );
            if (service.features.length !== initialCount) {
              updated = true;
            }
          }
        });
      }

      if (updated) {
        await page.save();
        console.log(`Updated page: ${page.pageId}`);
      }
    }

    console.log('Cleanup complete');
    process.exit(0);
  } catch (error) {
    console.error('Cleanup failed:', error);
    process.exit(1);
  }
}

cleanup();
