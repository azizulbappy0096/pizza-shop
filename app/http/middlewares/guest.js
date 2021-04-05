const guest = (req, res, next) => {
    if(!req.isAuthenticated()) {

        return next()
    }


    return res.redirect("/")
}

const auth = (req, res, next) => {
    if(req.isAuthenticated()) {

        return next()
    }


    return res.redirect("/")
}

exports.guest = guest
exports.auth = auth