const router = require("express").Router();

const {
  getThoughts,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction,
} = require("../../controllers/thoughtController");

// --API/
router
  .route("/")
  .get(getThoughts)
  .post(createThought)
  .put(updateThought)
  .delete(deleteThought);

router.route("/:thoughtId").get(getThoughtById);

router.route("/reactions/:thoughtId").post(addReaction).delete(deleteReaction);

module.exports = router;
