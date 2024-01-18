const { findUsers, findUserByUsername } = require("../models/users.model");

exports.getUsers = (req, res, next) => {
  findUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  findUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
