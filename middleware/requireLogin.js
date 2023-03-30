const jwt = require("jsonwebtoken");

exports.requireLogin = (req, res, next) => {
  try {
    console.log(req.headers.authorization);
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];

      const decode = jwt.verify(token, process.env.Privat_key);
      req.user = decode;
      console.log(decode);
      next();
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.log("Something went wrong" + err);
  }
};
