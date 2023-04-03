const Mongoose = require("mongoose");
Mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
module.exports = async () => {
  const db = Mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", () => {
    console.log("Connected to MongoDB");
  });
  db.once("close", () => {
    console.log("Disconnected from MongoDB");
  });
  return db;
};
