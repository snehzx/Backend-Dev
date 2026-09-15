import http from "http";
import express from "express";
import { WebSocketServer } from "ws";

const app = express();

app.get("/health", (req, res) => res.status(200).json({ ok: true }));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws, req) => {
  console.log(`client connected , total: ${wss.clients.size}`);

  //server speaks first - impossible with plain http
  ws.send(JSON.stringify({ type: "welcome", text: "connected to server" }));

  ws.on("message", (raw) => {
    // {event , listener}
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch (err) {
      console.log(err);
      return;
    }
    console.log("received", msg);

    if (msg.type === "ping") {
      ws.send(JSON.stringify({ type: "pong", time: Date.now() }));
    }
  });

  ws.on("close", (code) =>
    console.log("closed", code, "remaining", wss.clients.size),
  );
  ws.on("error", (err) => console.log("socket error", err.message));
});

server.listen(4000, () => console.log("server started"));
