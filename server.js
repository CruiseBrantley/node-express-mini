const express = require("express");
const helmet = require("helmet"); // 1 yarn add helment || npm i helmet // 2

// import db from './data/db';
const db = require("./data/db");

const server = express();

// add middleware
server.use(helmet()); // 3
server.use(express.json());

// route handlers
server.post("/api/users", (req, res) => {
  const userInformation = req.body;
  console.log("user information", userInformation);

  db
    .insert(userInformation)
    .then(response => {
      res.status(201).json(response);
    })
    .catch(err => {
      if (err.errno === 19) {
        res.status(400).json({ msg: "Please provide all required fields" });
      } else {
        res.status(500).json({ erro: err });
      }
    });
});

// http://foo.com?search=bar&sort=asc
// req.query === { search: 'bar', sort: 'asc' }

// http://localhost:5000/api/users?id=1 // just to use req.query
// write it using an URL parameter instead /api/users/:id

server.delete("/api/users", function(req, res) {
  const { id } = req.query;
  let user;
  db
    .findById(id)
    .then(foundUser => {
      user = { ...foundUser[0] };

      db.remove(id).then(response => {
        res.status(200).json(user);
      });
    })
    .catch(err => {
      res.status(500).json({ erro: err });
    });
});

server.put("/api/users/:id", function(req, res) {
  const { id } = req.params;
  const update = req.body;

  db
    .update(id, update)
    .then(count => {
      if (count > 0) {
        db.findById(id).then(users => {
          res.status(200).json(users[0]);
        });
      } else {
        res.status(404).json({ msg: "user not found" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

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
