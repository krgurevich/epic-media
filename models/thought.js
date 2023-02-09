const { Schema, model, Types } = require("mongoose");

//  -- Schema to create Thought Model
//  -- Define the shape for Reaction subdocument
const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new DataTypes.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
      trim: true,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // get: (timestamp) => dateFormat(timestamp),
    },
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

//  -- Define the shape of parent document
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
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
const Thought = model("Thought", thoughtSchema);

// -- Export Thought Model --
module.exports = Thought;
