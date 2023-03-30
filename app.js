const express = require("express");
const cors = require("cors");
const expresssesion = require("express-session");

const app = express();
var jwt = require("jsonwebtoken");
const { auth } = require("./routes/auth");
const env = require("dotenv");

env.config();
require("./connection/mongodb");
require("./Passport/Config");

const passport = require("passport");
const schema = require("./schema/user");
const { providertos3 } = require("./aws/s3");

app.use(
  expresssesion({
    secret: "harshtagra",
    resave: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
// app.use(cors())
app.use(
  cors({
    origin: process.env.Orgin,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.get("/", async (req, res) => {
  console.log(req.user);
  try {
    const data = await schema.findOne({ email: req.user.emails[0].value });

    if (data == null) {
      res.status(400).json({ msg: "error user not found " });
    }
    var token = jwt.sign({ email: data.email }, process.env.Privat_key);
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json("");
  }
});

auth(app);

app.listen(3001, () => {
  console.log("Server started on port 3001");
});
