const { Thought, User } = require("../models");

module.exports = {
  // -- GET to get all thoughts -- +
  getThoughts(req, res) {
    Thought.find()
      .then((thought) => res.json(thought))
      .catch((err) => res.status(500).json(err));
  },
  // GET to get a single thought by its _id -- +
  getThoughtById(req, res) {
    console.log(req.params.thoughtId);
    Thought.findById({ _id: req.params.thoughtId })
      .select("-_v")
      .then((thought) =>
        thought
          ? res.status(200).json(thought)
          : res.status(404).json({ message: `No thought with that ID` })
      )
      .catch((err) => res.status(500).json({ error: err }));
  },
  // -- POST to create a new thought (to push the created thought's _id to the associated user's thoughts array field) -- +
  createThought({ body }, res) {
    Thought.create(body)
      .then((thought) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: thought._id } },
          { new: true }
        );
      })
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: "No User with this ID" });
          return;
        }
        res.json(user);
      })
      .catch((err) => res.json(err));
  },
  // PUT to update a thought by its _id -- +
  updateThought(req, res) {
    Thought.findByIdAndUpdate(
      { _id: req.query.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: `No thought with that ID` })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // -- DELETE to remove a thought by its _id --
  removeThought({ params, query }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: "No thoughts found with that id!" });
          return;
        }
        return User.findOneAndUpdate(
          { _id: query.userId },
          { $pull: { thoughts: params.thoughtId } },
          { new: true }
        );
      })
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: "No User found with this id!" });
          return;
        }
        res.json(user);
      })
      .catch((err) => res.json(err));
  },
  // /api/thoughts/:thoughtId/reactions

  // POST to create a reaction stored in a single thought's reactions array field
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $addToSet: { reactions: body } },
      { new: true }
    )
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: "No thought with this id" });
          return;
        }
        res.json(thought);
      })
      .catch((err) => res.json(err));
  },
  // DELETE to pull and remove a reaction by the reaction's reactionId value
  deleteReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { _id: params.reactionId } } },
      { new: true }
    )
      .then((thought) => res.json(thought))
      .catch((err) => res.json(err));
  },
};
