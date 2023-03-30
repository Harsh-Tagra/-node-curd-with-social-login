const schema = require("../schema/user");
const passport = require("passport");
const { providertos3 } = require("../aws/s3");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
var GitHubStrategy = require("passport-github2").Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;
var LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      return done(null, {});
    } catch (error) {
      return done(error, null);
    }
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_clientID,
      clientSecret: process.env.GOOGLE_clientSecret,
      callbackURL: `${process.env.Backend}/auth/google/callback`,
    },
    async function (accessToken, refreshToken, profile, cb) {
      if (profile._json.email) {
        const profile_picture = await providertos3(profile._json.picture);
        const res = await schema.findOne({ email: profile._json.email });
        if (res == null) {
          schema.create({
            email: profile._json.email,
            name: profile._json.name,
            profile_picture,
            verfied: true,
          });
        }
      }

      return cb(null, profile);
    }
  )
);
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.Github_clientID,
      clientSecret: process.env.Github_clientSecret,
      scope: "user:email",
      callbackURL: `${process.env.Backend}/auth/github/callback`,
    },
    async function (accessToken, refreshToken, profile, done) {
      if (profile.emails[0].value) {
        const profile_picture = await providertos3(profile._json.avatar_url);

        const res = await schema.findOne({ email: profile.emails[0].value });
        if (res == null) {
          schema.create({
            email: profile.emails[0].value,
            name: profile._json.name,
            profile_picture,
            verfied: true,
          });
        }
      }
      done(null, profile);
    }
  )
);
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.Facboook_clientID,
      clientSecret: process.env.Facboook_clientSecret,
      profileFields: ["emails", "photos", "displayName"],
      callbackURL: `${process.env.Backend}/auth/facebook/callback`,
    },
    async function (accessToken, refreshToken, profile, cb) {
      if (profile._json.email) {
        const profile_picture = await providertos3(
          profile._json.picture.data.url
        );
        const res = await schema.findOne({ email: profile._json.email });
        if (res == null) {
          await schema.create({
            email: profile._json.email,
            name: profile._json.name,
            profile_picture,
            verfied: true,
          });
        }
      }
      cb(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
