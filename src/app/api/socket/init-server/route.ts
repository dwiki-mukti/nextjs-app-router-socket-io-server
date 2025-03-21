import { Server as SocketIOServer } from "socket.io";
import { createServer } from "http";

const globalAny = global as any;

export async function GET() {
  if (!globalAny.io) {
    const httpServer = createServer();
    const io = new SocketIOServer(httpServer);

    io.on("connection", (socket) => {
      socket.on('c_SubscribeNotif', (data) => {
        if (!data.user_id) return 0;
        console.log(data, data.user_id);
        socket.join(String(data?.user_id));
        console.log(`Socket id ${socket.id} joined room: ${data?.user_id}`)
      })
    });

    globalAny.io = io;
  }

  return new Response("Socket.IO server initialized", { status: 200 });
}
