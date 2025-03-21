import { NextRequest, NextResponse } from 'next/server';
import { Server as IOServer } from "socket.io";

const globalForSockets = global as unknown as {
    io?: IOServer,
    users: Map<string, string>
};

export async function GET(req: NextRequest) {
    // const data = await req.json();
    const data = {
        toUserId: req.nextUrl.searchParams.get('user_id'),
        message: req.nextUrl.searchParams.get('message')
    }

    if (!data?.toUserId) {
        return NextResponse.json({ error: 'userId and message are required' }, { status: 400 });
    }

    const io = globalForSockets.io;
    if (!io) {
        return NextResponse.json({ error: 'io.IO server is not initialized' }, { status: 500 });
    }

    const recipientSocketId = globalForSockets.users.get(data.toUserId);

    if (recipientSocketId) {
        console.log(`📩 Message to ${data.toUserId}: ${data.message}`);
        io.to(recipientSocketId).emit("private-message", { from: 'defri', message: data.message });
    } else {
        console.log(`❌ User ${data.toUserId} is not connected.`);
    }
    return NextResponse.json({ message: 'Notification sent to user' });
}
