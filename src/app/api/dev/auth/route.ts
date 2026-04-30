import { NextResponse } from 'next/server';

// Dev credentials from environment
const DEV_USERNAME = process.env.DEV_PANEL_USERNAME;
const DEV_PASSWORD = process.env.DEV_PANEL_PASSWORD;

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (username === DEV_USERNAME && password === DEV_PASSWORD) {
      // Generate a simple session token
      const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
      return NextResponse.json({ success: true, token });
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
