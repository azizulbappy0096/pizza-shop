const router = require("express").Router();
const multer = require("multer");
const MenuModel = require("../app/models/menu");

// menu image storage
var menuDest = multer.diskStorage({
  destination: function (req, file, cb) {
  
    cb(null, "./public/img/menu");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + getExtention(file.mimetype));
  },
});

getExtention = (mimeType) => {
  switch (mimeType) {
    case "image/png":
      return ".png";
    case "image/jpg":
      return ".jpg";
    case "image/jpeg":
      return ".jpeg";
    case "image/svg":
      return ".svg";
  }
};

var upload = multer({ storage: menuDest });

// menu route
router.post("/menu", upload.single("menu"), async (req, res) => {
  try {
    const newItem = new MenuModel({
      name: req.body.name,
      image: req.file.filename,
      price: req.body.price,
      size: req.body.size,
    });

    const saved = await newItem.save();
    res.send(saved);
  } catch (err) {
      console.log("err", err)
    throw new Error(err);
  }
});



module.exports = router;
