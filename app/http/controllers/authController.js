const authValidator = require("../validator/authValidator");
const bcrypt = require("bcryptjs");
const UserModel = require("../../models/user");
const passport = require("passport");
const axios = require("axios");

const authController = {
  register: async (req, res, next) => {
    const { username, email, password } = req.body;
    const { error, success } = await authValidator.register(req.body);

    if (error) {
      req.flash("error", error);
      req.flash("email", email);
      req.flash("username", username);
      return res.redirect("/register");
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
      });
      const savedUser = await newUser.save();
      req.login(savedUser, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/customer/orders");
      });
    } catch (err) {
      req.flash("error", "Something went wrong!");
      req.flash("email", email);
      req.flash("username", username);
      res.redirect("/register");
      // throw new Error(err);  development
    }
  },
  login: (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        req.flash("error", info.message);
        return next(err);
      } else if (!user) {
        req.flash("error", info.message);
        return res.redirect("/login");
      }

      req.login(user, (err) => {
        if (err) {
          req.flash("error", info.message);
          return next(err);
        }

        if (req.user.role === "admin") {
          return res.redirect("/admin/orders");
        }
        res.redirect("/customer/orders");
      });
    })(req, res, next);
    // passport.authenticate("local", {
    //   successRedirect: req.user ? "/admin/orders" : "/customer/orders",
    //   failureRedirect: "/login",
    //   failureFlash: true,
    // })(req, res, next);
  },

  logout: (req, res) => {
    req.logout();
    res.redirect("/login");
  },
};

module.exports = authController;
