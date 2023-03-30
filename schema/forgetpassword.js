const { default: mongoose } = require("mongoose");
const schema = require("./user");

const forgetpassword = new mongoose.Schema({
  userid: {
    type: mongoose.Types.ObjectId,
    require: true,
    ref: "schema",
  },
  token: {
    type: String,
    require: true,
  },
});

const forgetpassword_schema = mongoose.model("forgetpassword", forgetpassword);

module.exports = forgetpassword_schema;
