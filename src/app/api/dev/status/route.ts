import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import { verifyDevAuth, unauthorized } from '@/lib/devAuth';

export async function GET(request: Request) {
  if (!verifyDevAuth(request)) return unauthorized();
  
  try {
    await connectDB();
    const state = mongoose.connection.readyState;
    const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
    
    return NextResponse.json({ 
      status: states[state] || 'Unknown',
      database: mongoose.connection.name,
      host: mongoose.connection.host
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'Error', error: error.message }, { status: 500 });
  }
}
