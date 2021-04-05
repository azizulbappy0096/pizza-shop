const LocalStrategy = require("passport-local").Strategy;
const UserModel = require("../models/user");
const bcrypt = require("bcryptjs") 

const passportInit = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await UserModel.findOne({ email: email });
          if (!user) {
            return done(null, false, {message: "username or password is incorrect"})
          }

          const res = await bcrypt.compare(password, user.password)
          if(!res) {
            return done(null, false, {message: "username or password is incorrect"})
          }
          return done(null, user, {message: "Logged in successfully"})

        } catch (err) {
          return done(err)
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
      done(null, user._id)
  })

  passport.deserializeUser(async (id, done) => {
    try{
        const user = await UserModel.findById(id)
        if(user) {
            done(null, user)
        }else {
            done(null, false)
        }
    }catch(err) {
        done(err)
    }
  })
};

module.exports = passportInit;
