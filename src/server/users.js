const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
  ID: {
    type: String,
    required: true
  },
  Time: {
    type: String,
    required: true
  },
  BPM: {
    type: String,
    required: true
  },
  Moving: {
    type: String,
    required: true
  }
});

let Users = mongoose.model("Users", usersSchema);

module.exports.addUsers = (user, callback) => {
  Users.create(user, callback);
};

module.exports.getUsers = (callback, limit) => {
  Users.find(callback).limit(limit);
};
