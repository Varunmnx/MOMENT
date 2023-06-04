import passport from "passport";
import { Strategy as GoogleStatergy } from 'passport-google-oauth20';
import { Strategy as FacebookStatergy } from 'passport-facebook';

export function setUpGoogleAndFacebookPassportAuthSetup() {
  console.log("Setting up passport js");

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  passport.use(
    new GoogleStatergy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
      function(accessToken, refreshToken, profile, done) {
        // Verify callback implementation for Google login
        // Verify the user's credentials and call the `done` callback when finished
        // You can access user information in the `profile` object
      }
    )
  );

  passport.use(
    new FacebookStatergy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        profileFields: ['id', 'displayName', 'email'],
      },
      function(accessToken, refreshToken, profile, done) {
        // Verify callback implementation for Facebook login
        // Verify the user's credentials and call the `done` callback when finished
        // You can access user information in the `profile` object
      }
    )
  );
}
