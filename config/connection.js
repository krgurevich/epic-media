const mongoose = require("mongoose");

// -- Local Connection to MongoDB  --
mongoose.connect("mongoose://127.0.0.1:27017/epicmediaDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// -- Export Connection --
module.export = mongoose.connection;
