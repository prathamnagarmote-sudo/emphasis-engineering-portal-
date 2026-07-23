import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';

const MIME_TYPES: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.doc': 'application/msword',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ filepath: string[] }> }
) {
  try {
    const { filepath } = await params;

    // Sanitize — prevent directory traversal
    const sanitized = filepath.map((segment) =>
      segment.replace(/\.\./g, '').replace(/[^a-zA-Z0-9_\-\.]/g, '_')
    );

    const fileName = sanitized[sanitized.length - 1];
    const ext = path.extname(fileName).toLowerCase();

    // Build the absolute file path inside public/downloads/
    const filePath = path.join(
      process.cwd(),
      'public',
      'downloads',
      ...sanitized
    );

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': String(fileBuffer.length),
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err) {
    console.error('Download API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
