const router = require("express").Router();
const userModel = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const { isLoggedOut } = require("../middleware/route-guard");

/* GET home page */
router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup.hbs");
});

router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login.hbs");
});

router.post("/signup", async (req, res) => {
  if (req.body.username === "" || req.body.password === "") {
    res.render("auth/signup", { errorMessage: "The fields can't be empty." });
  }
  try {
    let userSearch = await userModel.findOne({ username: req.body.username });
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(req.body.password)) {
      res.status(500).render("auth/signup", {
        errorMessage:
          "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
      });
    } else if (!userSearch) {
      const salt = bcryptjs.genSaltSync(12);
      const hashedPassword = bcryptjs.hashSync(req.body.password, salt);
      const newUser = await userModel.create({
        ...req.body,
        password: hashedPassword,
      });
      res.redirect("/auth/login");
    } else {
      res.render("auth/signup", {
        errorMessage: "The username can't be repeated.",
      });
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
        req.session.currentUser = userSearch;
        res.redirect("/main");
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

router.post("/logout", async (req, res, next) => {
  try {
    let destroy = await req.session.destroy((err) => {
      if (err) {
        next(err);
      } else {
        res.redirect("/");
      }
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
