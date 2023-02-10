const router = require("express").Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUserById,
  addFriend,
  removeFriend,
} = require("../../controllers/userController");

// --API/Users
router.route("/").get(getUsers).post(createUser).put(updateUser);

// --API/user/:userId
router.route("/:userId").get(getUserById).delete(deleteUserById);

router.route("/:userId/friends").post(addFriend);

router.route("/:userId/friends/:friendId").delete(removeFriend);
module.exports = router;
