const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const mqtt = require("mqtt");
const socket = require("socket.io");
const port = 3000;
const server = http.Server(app);

server.listen(port);
const io = socket(server);

//Static files
app.use(express.static("public")).use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, "..", "..", "public", "index.html"));
});

//MQTT setup
const client = mqtt.connect(
  "mqtt://m23.cloudmqtt.com",
  {
    port: 11606,
    username: "vfgjumqu",
    password: "CRwyJCQayGaU"
  }
);

let msgFromMQTT;

client.on("connect", () => {
  console.log("Connecting to CloudMQTT...");
  client.subscribe("listener");
  client.subscribe("#");
});

//Socket setup
io.on("connection", function(socket) {
  console.log("somone just connected: " + socket.id);

  socket.on("disconnect", () => {
    console.log("disconnecting");
  });
  console.log("Made a socket connection");
  client.on("message", (topic, message) => {
    socket.emit("msgFromServer", message.toString());
  });
});
