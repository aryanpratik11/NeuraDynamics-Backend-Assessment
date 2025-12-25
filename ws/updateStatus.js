// WebSocket server for upload status updates

import { WebSocketServer } from "ws";

let wss;

export const initWebSocket = (server) => {
  wss = new WebSocketServer({ server, path: "/ws/upload-status" });

  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
    });
  });
};

// Broadcast message
export const sendUploadStatus = (message) => {
  if (!wss) return;

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
};
