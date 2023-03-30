const user = require("../schema/user");
const verification_schema = require("../schema/verify");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const delfile = require("../aws/s3");
const sendemail = require("../nodemailer/config");
exports.getinfo = async (req, res) => {
  try {
    const data = await user
      .findOne({ email: req.user.email })
      .select({ name: 1, _id: 0, profile_picture: 1, email: 1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};
exports.updateinfo = async (req, res) => {
  try {
    const dublicateemail = await user.find({ email: req.body.email });

    if (dublicateemail.length == 1 && req.user.email == req.body.email) {
      if (
        dublicateemail[0].profile_picture != "" &&
        req.body.profile_picture != dublicateemail[0].profile_picture
      ) {
        delfile(dublicateemail[0].profile_picture);
      }
      const update = await user.findOneAndUpdate(
        { email: req.user.email },
        {
          name: req.body.name,
          profile_picture: req.body.profile_picture,
        }
      );
      res.status(201).json("");
      if (!update) {
        return res.status(400).json({ msg: "nothing is update" });
      }
    } else if (dublicateemail.length == 0) {
      const update = await user.findOneAndUpdate(
        { email: req.user.email },
        {
          email: req.body.email,
          name: req.body.name,
          verfied: "false",
          profile_picture: req.body.profile_picture,
        }
      );

      if (update) {
        const genratetoken = await verification_schema.create({
          userid: update._id,
          token: crypto.randomBytes(32).toString("hex"),
        });
        if (
          req.body.profile_picture != update.profile_picture &&
          req.body.profile_picture == ""
        ) {
          delfile(update.profile_picture);
        }
        await sendemail(
          req.body.email,
          update.name,
          update._id,
          genratetoken.token,
          "verfication"
        );
        res.status(201).json({
          msg: "verfiction email send on new email your account are logout in 10 sec ",
        });
      } else {
        res.status(400).json({ msg: "nothing is update" });
      }
    } else {
      res.status(401).json({ msg: "Email already exist " });
    }
  } catch (error) {
    res.json(500).json(error);
  }
};
exports.changepassword = async (req, res) => {
  try {
    if (req.body.confirm_password != req.body.password) {
      res
        .status(209)
        .json({ msg: "password not matched with confirm password" });
    }
    const password = await bcrypt.hash(req.body.password, 12);
    await user.findOneAndUpdate({ email: req.user.email }, { password });
    res.status(200).json();
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.delaccount = async (req, res) => {
  try {
    const data = await user.findOneAndDelete({ email: req.user.email });
    if (data.profile_picture != "") {
      delfile(data.profile_picture);
    }
    req.status(200).json("");
  } catch (error) {
    res.status(500).json(error);
  }
};
