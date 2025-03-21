import { NextRequest, NextResponse } from 'next/server';

const globalAny = global as any;

export async function GET(req: NextRequest) {
  // const data = await req.json();
  const data = { user_id: 1, description: 'okok' }

  if (!data?.user_id) {
    return NextResponse.json({ error: 'userId and message are required' }, { status: 400 });
  }

  const io = globalAny.io;
  if (!io) {
    return NextResponse.json({ error: 'Socket.IO server is not initialized' }, { status: 500 });
  }

  io.to(String(data?.user_id)).emit('s_SendNotif', data);
  return NextResponse.json({ message: 'Notification sent to user' });
}
