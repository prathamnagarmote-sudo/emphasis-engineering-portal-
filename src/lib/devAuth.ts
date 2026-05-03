import { NextResponse } from 'next/server';

const DEV_USERNAME = process.env.DEV_PANEL_USERNAME;

export function verifyDevAuth(request: Request): boolean {
  const authHeader = request.headers.get('x-dev-token');
  if (!authHeader) return false;
  try {
    const decoded = Buffer.from(authHeader, 'base64').toString('utf-8');
    const [username] = decoded.split(':');
    return username === DEV_USERNAME;
  } catch {
    return false;
  }
}

export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized - invalid dev token' }, { status: 401 });
}
