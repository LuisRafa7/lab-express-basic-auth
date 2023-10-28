const { isLoggedIn } = require("../middleware/route-guard");

const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", { user: req.session.currentUser });
});

router.get("/main", isLoggedIn, (req, res) => {
  res.render("private/main.hbs");
});

router.get("/private", isLoggedIn, (req, res) => {
  res.render("private/private.hbs");
});

module.exports = router;
