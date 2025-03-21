/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { Server as IOServer } from "socket.io";

const globalForSockets = global as unknown as {
    io?: IOServer,
    users: Map<string, string>
};

export async function GET() {
    if (!globalForSockets.io) {
        console.log("✅ Initializing WebSocket server...");

        const io = new IOServer({
            path: "/api/socket/init",
            addTrailingSlash: false,
            cors: { origin: "*" },
            transports: ["websocket", "polling"],
        }).listen(4000);

        // Store userId -> socketId mapping
        globalForSockets.users = new Map<string, string>();

        io.on("connect", (socket) => {
            console.log("🔗 Client connected:", socket.id);

            // Handle user authentication and store their ID
            socket.on("register-user", (userId) => {
                console.log(`✅ User ${userId} registered with socket ID: ${socket.id}`);
                globalForSockets.users.set(userId, socket.id);
            });

            // Handle disconnection
            socket.on("disconnect", () => {
                const userId = [...globalForSockets.users.entries()].find(([_item, id]) => id === socket.id)?.[0];
                if (userId) {
                    globalForSockets.users.delete(userId);
                    console.log(`❌ User ${userId} disconnected.`);
                }
            });
        });

        globalForSockets.io = io; // Store globally to prevent reinitialization

    } else {
        console.log("⚡ WebSocket server already running.");
    }

    return NextResponse.json({ message: "WebSocket initialized" });
}
