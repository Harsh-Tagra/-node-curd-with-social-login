const user = require("../schema/user");
const crypto = require("crypto");
var jwt = require("jsonwebtoken");
const sendemail = require("../nodemailer/config");
const verification_schema = require("../schema/verify");
const bcrypt = require("bcrypt");
const forgetpassword_schema = require("../schema/forgetpassword");
exports.reg = async (req, res) => {
  const { email, password, name, confirm_password } = req.body;
  try {
    const check = await user.findOne({ email: email });

    if (check == null) {
      if (email && password && name) {
        if (confirm_password == password) {
          const passwordhash = await bcrypt.hash(password, 12);

          const reg = await user.create({
            email: email,
            password: passwordhash,
            name: name,
            profile_picture: "",
          });
          const save = await reg.save();
          const genratetoken = await verification_schema.create({
            userid: reg._id,
            token: crypto.randomBytes(32).toString("hex"),
          });

          await sendemail(
            save.email,
            save.name,
            save._id,
            genratetoken.token,

            "verfication"
          );

          res.status(200).json({
            msg: "Email verification link are send  to your email ",
          });
        } else {
          res.status(400).json({ msg: "Confirm password are not matched " });
        }
      } else {
        res.status(400).json({ msg: "Please enter all fields" });
      }
    } else {
      res.status(409).json({ msg: "Email already exist" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
exports.login = async (req, res) => {
  try {
    const data = await user.findOne({ email: req.body.username });
    console.log(data.password, data.password == undefined);
    if (data.password == undefined) {
      return res.status(400).json({
        msg: "incorrect username or password",
      });
    }
    const check = await bcrypt.compare(req.body.password, data.password);

    if (data == null || !check) {
      return res.status(400).json({ msg: "incorrect username or password" });
    }
    if (data.verfied == false) {
      return res.status(400).json({ msg: "email is not verfied" });
    }

    var token = jwt.sign({ email: data.email }, process.env.Privat_key);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.verfiy = async (req, res) => {
  try {
    const finduser = await user.findById(req.params.id);

    if (!finduser) {
      res.status(400).json("invalid link");
    }
    const token = await verification_schema.findOne({
      userid: req.params.id,
      token: req.params.token,
    });

    if (!token) {
      res.status(400).json("invalid link");
    }

    console.log(await user.findByIdAndUpdate(finduser._id, { verfied: true }));
    await verification_schema.findByIdAndDelete(token._id);

    res.status(200).json({ msg: "verfication sucesss" });
  } catch (error) {
    res.status(500).json({ msg: "verfication failed ", error: error });
  }
};
exports.logout = (req, res) => {
  req.logout();

  res.redirect(process.env.Orgin);
};
exports.forgetpassword = async (req, res) => {
  try {
    const finduser = await user.findById(req.params.id);

    if (!finduser) {
      res.status(400).json("invalid link");
    }
    const token = await forgetpassword_schema.findOne({
      userid: req.params.id,
      token: req.params.token,
    });

    if (!token) {
      res.status(400).json("invalid link");
    }

    if (req.body.password != req.body.confirm_password) {
      res.status(401).json("confirm_password are not matched with password");
    }
    const password = await bcrypt.hash(req.body.password, 12);
    await user.updateOne({ id: finduser._id, password });
    await forgetpassword_schema.findByIdAndDelete(token._id);
    res.status(200).json("");
  } catch (error) {
    res.status(500).json(error);
  }
};
exports.genrate = async (req, res) => {
  try {
    const finduser = await user.findOne({ email: req.body.email });

    if (finduser) {
      const genratetoken = await forgetpassword_schema.create({
        userid: finduser._id,
        token: crypto.randomBytes(32).toString("hex"),
      });

      await sendemail(
        finduser.email,
        finduser.name,
        finduser._id,

        genratetoken.token,
        "Forget"
      );
      res.status(200).json("");
    } else {
      res.status(400).json({ msg: "Email ID does not exist" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.check = async (req, res) => {
  try {
    const finduser = await user.findById(req.params.id);
    if (!finduser) {
      res.status(400).json("invalid link");
    }
    const token = await forgetpassword_schema.findOne({
      userid: req.params.id,
      token: req.params.token,
    });

    if (!token) {
      res.status(400).json("invalid link");
    }

    res.status(200).json("");
  } catch (error) {
    res.status(500).json(error);
  }
};
