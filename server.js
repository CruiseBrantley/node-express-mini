const express = require("express");

// import db from './data/db';
const db = require("./data/db");

const server = express();

server.get("/", (req, res) => {
  res.send("Api running");
});

server.get("/api/users", (req, res) => {
  //get the users
  db
    .find()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.status(500).json({ error: err });
      // do something with the error
    });
});

// /api/users/123
server.get("/api/users/:id", (req, res) => {
  // grab the id from URL parameters
  const id = req.params.id;

  db
    .findById(id)
    .then(users => {
      if (users.length === 0) {
        res.status(404).json({ message: "user not found" });
      } else {
        res.json(users[0]);
      }
    })
    .catch(err => {
      // do something with the error
      res.status(500).json({ error: err });
    });
});

server.listen(5000, () => console.log("\n== API Running on port 5000 ==\n"));
