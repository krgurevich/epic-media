const router = require("express").Router();

const {
  getThoughts,
  getThoughtById,
  createThought,
  updateThought,
  deleteThoughtById,
  addReaction,
  deleteReaction,
} = require("../../controllers/thoughtController");

// --API/
router.route("/").get(getThoughts).post(createThought).put(updateThought);

router.route("/:thoughtId").get(getThoughtById).delete(deleteThoughtById);

router.route("/reactions/:thoughtId").post(addReaction);
router.route("/reactions/:thoughtId/:reactionId").delete(deleteReaction)

module.exports = router;
