const { connect, connection } = require("mongoose");

// -- Local Connection to MongoDB  --
connect("mongodb://127.0.0.1:27017/epicmediaDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// -- Export Connection --
module.exports = connection;
