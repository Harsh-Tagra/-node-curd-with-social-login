const passport = require("passport");

const { requireLogin } = require("../middleware/requireLogin");
const {
  getinfo,
  updateinfo,
  changepassword,
  delaccount,
} = require("../Controllers/info");
const {
  reg,
  login,
  verfiy,
  logout,
  forgetpassword,
  genrate,
  check,
} = require("../Controllers/auth");
exports.auth = (app) => {
  app.post("/reg", reg);
  app.get("/user/info", requireLogin, getinfo);
  app.post("/del", requireLogin, delaccount);
  app.post("/changepass", requireLogin, changepassword);
  app.post("/:id/forget/:token", forgetpassword);
  app.get("/:id/check/:token", check);
  app.post("/genrate/forgetpassword", genrate);
  app.post("/user/info", requireLogin, updateinfo);
  app.get("/:id/verfiy/:token", verfiy);
  app.post("/login", passport.authenticate("local"), login);
  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/login",
      successRedirect: process.env.Success,
    }),
    function (req, res) {
      res.redirect("/");
    }
  );
  app.get("/auth/github", passport.authenticate("github"));

  app.get(
    "/auth/github/callback",
    passport.authenticate("github", {
      failureRedirect: "/login",
      successRedirect: process.env.Success,
    })
  );
  app.get(
    "/auth/facebook",
    passport.authenticate("facebook", { scope: ["email"] })
  );
  app.get("/auth/logout", logout);
  app.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
      failureRedirect: "/login",
      successRedirect: process.env.Success,
    }),
    function (req, res) {
      // Successful authentication, redirect home.
      res.redirect("/");
    }
  );
};
