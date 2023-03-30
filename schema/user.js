const mongoose = require("mongoose");
const valditoer = require("validator");

const regschema = mongoose.Schema({
  name: {
    type: "String",
  },
  email: {
    type: "String",
    unique: true,
    valditor(value) {
      if (valditoer.isEmail(value)) {
        throw new err("email is not valid ");
      }
    },
  },
  password: {
    type: "String",
  },
  profile_picture: {
    type: "String",
  },
  verfied: {
    type: Boolean,
    default: false,
  },
});

const schema = mongoose.model("curd", regschema);
module.exports = schema;
