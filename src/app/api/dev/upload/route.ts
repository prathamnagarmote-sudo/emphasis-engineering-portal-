import { NextResponse } from 'next/server';
import { verifyDevAuth, unauthorized } from '@/lib/devAuth';

// Cloudinary upload endpoint for the Dev Panel
// Uses the Cloudinary Upload API with unsigned preset or API key
export async function POST(request: Request) {
  if (!verifyDevAuth(request)) return unauthorized();

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName) {
      return NextResponse.json({ error: 'Cloudinary not configured. Set CLOUDINARY_CLOUD_NAME in .env.local' }, { status: 500 });
    }

    // Build the upload form
    const uploadData = new FormData();
    uploadData.append('file', file);
    
    if (uploadPreset) {
      // Unsigned upload with preset
      uploadData.append('upload_preset', uploadPreset);
    }

    if (apiKey) {
      uploadData.append('api_key', apiKey);
      // For signed uploads, we'd need to generate a signature
      // For simplicity, using unsigned preset is recommended
    }

    uploadData.append('folder', 'emphasis-engineering');

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
    const response = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: uploadData,
    });

    if (!response.ok) {
      const err = await response.json();
      return NextResponse.json({ error: err.error?.message || 'Upload failed' }, { status: 400 });
    }

    const result = await response.json();
    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
