const authValidator = require("../validator/authValidator");
const bcrypt = require("bcryptjs");
const UserModel = require("../../models/user");

const authController = {
  register: async (req, res) => {
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
      await newUser.save();
      res.redirect("/");
    } catch (err) {
        req.flash("error", "Something went wrong!");
        req.flash("email", email);
        req.flash("username", username);
        res.redirect("/register");
        // throw new Error(err);  development
    }
  },
};

module.exports = authController;
