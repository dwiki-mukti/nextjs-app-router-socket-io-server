import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server as SocketIOServer } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const server = createServer((req, res) => {
  const parsedUrl = parse(req.url!, true);
  handle(req, res, parsedUrl);
});

const io = new SocketIOServer(server);
(global as any).io = io; 

io.on("connection", (socket) => {
  socket.on("c_SubscribeNotif", (data) => {
    if (!data.user_id) return;
    socket.join(String(data.user_id));
    console.log(`Socket ${socket.id} joined room: ${data.user_id}`);
  });
});

const PORT = process.env.PORT || 3000;
app.prepare().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
  });
});
