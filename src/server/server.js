const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const mqtt = require("mqtt");
const socket = require("socket.io");
const port = 3000;
const server = http.Server(app);
let bodyparser = require("body-parser");
let Users = require("./users");
const mongoose = require("mongoose");
const axios = require("axios");

server.listen(port);
const io = socket(server);

//MQTT SETUP
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
//END MQTT SETUP

//SOCKET SETUP
io.on("connection", function(socket) {
  console.log("Somone just connected: " + socket.id);

  socket.on("disconnect", () => {
    console.log("disconnecting");
  });
  console.log("Made a socket connection");
  client.on("message", (topic, message) => {
    if (topic === "inTopic/message") {
      socket.emit("msgFromServer", message.toString());
    }

    if (topic === "inTopic/request") {
      let obj = JSON.parse(message.toString());
      axios.post("http://localhost:3000/api/v1/user", obj).then(() => {
        console.log("Axios made a post...");
      });
    }
  });
});
//END SOCKET SETUP

//DATABASE SETUP
app.use(bodyparser.json());
app.use(
  bodyparser.urlencoded({
    extended: true
  })
);

let mongoURI =
  "mongodb://admin:admin1705@ds123796.mlab.com:23796/m2m_real-time_chart";
mongoose.set("useCreateIndex", true);
mongoose.connect(
  mongoURI,
  {
    useNewUrlParser: true
  }
);

app.post("/api/v1/user", (req, res) => {
  let user = req.body;
  console.log(user);
  Users.addUsers(user, (err, callback) => {
    if (err) throw err;
    console.log("JSON pushed to DB...");
    res.json(user);
  });
});

app.get("/api/v1/user", (req, res) => {
  Users.getUsers((err, user) => {
    if (err) throw err;
    res.json(user);
  });
});
//END DATABASE SETUP

//STATIC FILES
app.use(express.static("public")).use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, "..", "..", "public", "index.html"));
});
