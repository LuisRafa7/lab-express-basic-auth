const router = require("express").Router();
const userModel = require("../models/User.model");
const bcryptjs = require("bcryptjs");

/* GET home page */
router.get("/signup", (req, res) => {
  res.render("auth/signup.hbs");
});

router.get("/login", (req, res) => {
  res.render("auth/login.hbs");
});

router.post("/signup", async (req, res) => {
  try {
    let userSearch = await userModel.findOne({ username: req.body.username });
    if (!userSearch) {
      const salt = bcryptjs.genSaltSync(12);
      const hashedPassword = bcryptjs.hashSync(req.body.password, salt);
      const newUser = await userModel.create({
        ...req.body,
        password: hashedPassword,
      });
      res.redirect("/auth/login");
    } else {
      res.render("auth/signup", { errorMessage: "User already exist!" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    let userSearch = await userModel.findOne({ username: req.body.username });
    if (userSearch) {
      const comparePassword = bcryptjs.compareSync(
        req.body.password,
        userSearch.password
      );
      if (comparePassword) {
        res.redirect("/");
      } else {
        res.render("auth/login", { errorMessage: "User or Password wrong!" });
      }
    } else {
      res.render("auth/login", { errorMessage: "User or Password wrong!" });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
