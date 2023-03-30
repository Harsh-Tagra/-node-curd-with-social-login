const { default: mongoose } = require("mongoose");
const schema = require("./user");

const verification = new mongoose.Schema({
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

const verification_schema = mongoose.model("verification_tokens", verification);

module.exports = verification_schema;
