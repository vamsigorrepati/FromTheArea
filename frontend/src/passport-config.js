const passport = require("passport");
const CasStrategy = require("passport-cas").Strategy;

passport.use(
  new CasStrategy(
    {
      // https://secure.its.yale.edu/cas/login
      // https://yale.edu/cas/
      ssoBaseURL: "https://secure.its.yale.edu/cas", // CAS server URL
      version: 'CAS2.0'
      //serverBaseURL: "http://localhost:3000", // Your app's URL
    },
    function (login, done) {
      // Implement your authentication logic here
      // You should call `done(null, user)` if the user is authenticated
      // or `done(null, false)` if authentication fails.
      done(null, true);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

module.exports = passport;
