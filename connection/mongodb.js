const mongoose = require("mongoose");

mongoose
  .connect(process.env.mogodb)
  .then(console.log("connected to mongo"))
  .catch((err) => console.log(" failed to connected mongo", err));
