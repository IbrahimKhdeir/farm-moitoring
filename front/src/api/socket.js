import { io } from "socket.io-client";
import Cookies from "js-cookie";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const socket = io(API_BASE_URL, {
    autoConnect: true,
    transports: ["websocket", "polling"],
});

// Authenticate socket connection with user token
export function authenticateSocket() {
    const token = Cookies.get("token") || localStorage.getItem("token");
    if (token) {
        socket.emit('authenticate', token);
    }
}

// Re-authenticate when socket reconnects
socket.on('connect', () => {
    console.log('Socket connected');
    authenticateSocket();
});

// Initial authentication if already connected
if (socket.connected) {
    authenticateSocket();
}
