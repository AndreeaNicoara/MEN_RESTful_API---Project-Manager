const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { registerValidation, loginValidation } = require("../validation");
const { isError } = require("joi");

// /registration
router.post("/register", async (req, res) => {
  //validate user input (name, email, pw)
  const { error } = registerValidation(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  //check if email is already registered
  const emailExists = await User.findOne({ email: req.body.email });

  if (emailExists) {
    return res.status(400).json({ error: "Email already exists" });
  }

  //hash the password
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  //create a user object and save in the DB
  const userObject = new User({
    name: req.body.name,
    email: req.body.email,
    password,
  });

  try {
    const savedUser = await userObject.save();
    res.json({ error: null, data: savedUser._id });
  } catch (error) {
    res.status(400).json({ error });
  }
});

// /login
router.post("/login", async (req, res) => {
  //validate user login info
  const { error } = loginValidation(req.body);

  //If login info is valid...
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  //...then we find user
  const user = await User.findOne({ email: req.body.email });

  //if email is wrong, display error (user doesnt exist in DB)
  if (!user) {
    return res.status(400).json({ error: "Email is wrong!" });
  }

  //If user exists, check for password accuracy
  const validPassword = await bcrypt.compare(req.body.password, user.password);

  //Is password is wrong, display error
  if (!validPassword) {
    return res.status(400).json({ error: "Password is wrong!" });
  }

  //Generate auth token with username and ID
  const token = jwt.sign(
    //payload
    {
      name: user.name,
      id: user._id,
    },
    //TOKEN_SECRET
    process.env.TOKEN_SECRET,
    {
      //EXPIRATION TIME
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
  //Attach auth token to header
  res.header("auth-token", token).json({
    error: null,
    data: { token },
  });
});

module.exports = router;
