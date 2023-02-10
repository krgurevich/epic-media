const { default: mongoose } = require("mongoose");
const { User, Thought } = require("../models");

// /api/user
module.exports = {
  // -- GET all users -- 
  getUsers(req, res) {
    User.find()
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // -- GET a single user by its `_id` and populated thought and friend data -- 
  getUserById(req, res) {
    User.findOne({ _id: req.params.userId })
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

  // -- POST a new user -- +
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // -- PUT to update a user by its `_id` -- 
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
  // -- DELETE to remove user by its `_id` and associated thoughts
  deleteUserById(req, res) {
    User.findByIdAndDelete(req.params.userId)
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

  // /api/users/:userId/friends/:friendId
  // -- POST to add a new friend to a user's friend list --
  addFriend({ params, body }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $addToSet: { friends: body } },
      { new: true }
    )
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: "No user with this id" });
          return;
        }
        res.json(user);
      })
      .catch((err) => res.json(err));
  },

  // -- DELETE to remove a friend from a user's friend list --
  removeFriend({params}, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends:  params.friendId } },
      { new: true }
    )
      .then((user) => res.json(user))
      .catch((err) => res.json(err));
  },
};
