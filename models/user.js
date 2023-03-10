const { Schema, model } = require('mongoose');
const Thought = require('./Thought');

//  -- Schema to create User Model
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
        "Please enter a valid email address",
      ],
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

//   -- Create a virtual called friendCount that retrieves the length of the thought's reactions array --
userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

//  -- Initialize User Model
const User = model("User", userSchema);

// -- Export User Model --
module.exports = User;
