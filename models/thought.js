const mongoose = require("mongoose");

//  -- Schema to create Thought Model
//  -- Define the shape for Reaction subdocument
const reactionSchema = new mongoose.Schema({
  reactionId: {
    type: mongoose.ObjectId,
    default: () => new DataTypes.ObjectId(),
  },
  reactionBody: {
    type: String,
    required: true,
    max: [280, "280 Character Maximum"],
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => dateFormat(timestamp),
  },
  toJSON: {
    getters: true,
  },
  id: false,
});

//  -- Define the shape of parent document
const thoughtSchema = new mongoose.Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      min: [1, "Must be between 1 and 280 characters"],
      max: [280, "Must be between 1 and 280 characters"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    username: {
      type: String,
      required: true,
    },
    // -- Array of nested documents created with the reactionSchema
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

//   -- Create a virtual called reactionCount that retrieves the length of the thought's reactions array --
thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

//  -- Initialize Thought Model
const Thought = mongoose.model("Thought", thoughtSchema);

// -- Export Thought Model --
module.exports = Thought;
