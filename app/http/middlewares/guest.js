const guest = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }

  return res.redirect("/");
};

const auth = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role !== "admin") {
    return next();
  }

  return res.redirect("/");
};

const admin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === "admin") {
      return next();
    }
  console.log(req.user)
    return res.redirect("/login");
  };

exports.guest = guest;
exports.auth = auth;
exports.admin = admin;
