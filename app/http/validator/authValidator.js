const UserModel = require("../../models/user");

const authValidator = {
  register: async (user) => {
    try {
      const doc = await UserModel.findOne({ email: user.email });

      if (doc) {
        console.log(doc);
        return {
          error: "E-mail is already in use.",
        };
      } else {
        return {
          success: "OK",
        };
      }
    } catch (err) {
      return {
        error: "Something went wrong",
      };
    }
  },
};

module.exports = authValidator;
