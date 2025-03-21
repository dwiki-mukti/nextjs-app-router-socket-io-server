/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import io from "socket.io-client";

export default function Home() {
    const params = useParams(); // ✅ Correct way to access params
    const id = params?.id; // Extract user ID

    const [_socket, setSocket] = useState<any>(null);
    const [messages, setMessages] = useState<any>([]);


    useEffect(() => {
        const initializeSocket = async () => {
            await fetch("/api/socket/init"); // Ensure API route initializes

            const socketInstance = io("http://localhost:4000", {
                path: "/api/socket/init",
                // transports: ["websocket"], // 🚀 Force WebSocket
            });

            socketInstance.on("connect", () => {
                console.log("✅ Connected:", socketInstance.id);

                socketInstance.emit("register-user", id);
            });

            socketInstance.on("private-message", ({ from, message }) => {
                setMessages((prevMessages: any) => [...prevMessages, `${from} says: ${message}`]);
            });


            socketInstance.on("disconnect", () => {
                console.log("❌ Disconnected:", socketInstance.id);
            });

            socketInstance.on("connect_error", async err => {
                console.log(`connect_error due to ${err.message}`)
                const res = await fetch("/api/socket/init")
                if (!res.ok) {
                    throw new Error(`Error initializing socket: ${res.statusText}`);
                }
                console.log(res)

            })

            // error connection
            socketInstance.on("error", (err) => {
                console.error("��️ Error:", err);
            });

            setSocket(socketInstance);

            return () => {
                socketInstance.disconnect();
            };
        };

        initializeSocket();
    }, []);

    return (
        <div>
            <h1>WebSocket Chat</h1>
            {messages.map((msg: any, index: any) => (
                <p key={index}>{msg}</p>
            ))}
        </div>
    );
}
