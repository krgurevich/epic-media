const { Schema, model, Types } = require("mongoose");

//  -- Schema to create Thought Model
//  -- Define the shape for Reaction subdocument
//  -- Format Date --
function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

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
      type: String,
      default: Date.now,
      set: date => formatDate(date)
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
      type: String,
      default: Date.now,
      set: date => formatDate(date)
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
