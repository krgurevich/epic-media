const { default: mongoose } = require("mongoose");
const { User, Thought } = require("../models");

// /api/users
module.exports = {
  // -- GET all users --
  getUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  // -- GET a single user by its `_id` and populated thought and friend data
  getUserById(req, res) {
    User.findOne({ _id: req.query.userID })
      .populate({
        path: "thoughts",
        select: "-_v",
      })
      .populate({
        path: "friends",
        select: "-_v",
      })
      .select("-_v")
      .sort({
        _id: -1,
      })
      .then((user) =>
        !user
          ? res.status(404).json({ message: `No user with that ID` })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // -- POST a new user --
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // PUT to update a user by its `_id`
  updateUser(req, res) {
    console.log(req.query);
    User.findByIdAndUpdate(
      { _id: req.query.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: `No user with that ID` })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // DELETE to remove user by its `_id`
  deleteUserById(req, res) {
    User.findByIdAndDelete({ _id: req.query.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json(user)
      )
      .then(() => res.json({ message: "User deleted!" }))
      .catch((err) => res.status(500).json(err));
  },
  // DELETE a user's associated thoughts when deleted
  deleteUser(req, res) {
    User.findByIdAndDelete({ _id: req.query.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() =>
        res.json({ message: "User and associated thoughts deleted!" })
      )
      .catch((err) => res.status(500).json(err));
  },

  //   NEED HELP WITH THIS ----------------------
  // /api/users/:userId/friends/:friendId
  // POST to add a new friend to a user's friend list
  addFriend(req, res) {
    let previousFriends = User.findById(req.params.userId).friends;
    previousFriends = previousFriends || [];
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: [...previousFriends, req.body] } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No student found with that ID" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  //   NEED HELP WITH THIS ----------------------

  // DELETE to remove a friend from a user's friend list
  removeFriend(req, res) {
    let previousFriends = [];
    User.findById(req.params.userId, function (err, docs) {
      if (err) console.log(err);
      else {
        previousFriends = docs.friends;

        previousFriends = previousFriends || [];
        const newFriends = previousFriends.filter(
          (friend) => friend != req.params.friendId
        );
        console.log(newFriends)
        User.updat(
          { _id: req.params.userId },
          { $addToSet: { friends: [] } },
          { Validators: true, new: true }
        )
          .then((user) =>
            !user
              ? res.status(404).json({ message: "No user found with that ID" })
              : res.json(user)
          )
          .catch((err) => res.status(500).json(err));
      }
    });
  },
};
