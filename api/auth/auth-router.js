const validateRegisterer = require("../middleware/validateRegisterer");
const usernameExists = require("../middleware/usernameExists");
const router = require("express").Router();
const DataOps = require("../DataOps");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ENV_JWT_SECRET = process.env.ENV_JWT_SECRET || 'openplz';

// Create web token
const generateToken = (user) => {
  const payload = {
    sub: user.id,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
  };

  const options = {};

  return jwt.sign(payload, ENV_JWT_SECRET, options);
};

router.post(
  "/register",
  validateRegisterer,
  usernameExists,
  async (req, res, next) => {
    // Check for existing username
    if (req.usernameExists) {
      return next({ status: 400, message: "username taken" });
    }

    // bcrypt password - 6 rotations
    req.body.password = bcrypt.hashSync(req.body.password, 6);

    await DataOps.createUser(req.body)
      .then((result) => {
        // Constructing response object
        const [id] = result;
        const response = {
          id: id,
          username: req.body.username,
          password: req.body.password,
        };

        res.status(200).json(response);
      })
      .catch(next);

    /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

  */
  }
);

router.post("/login", validateRegisterer, usernameExists, (req, res, next) => {

  // 4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
  //   the response body should include a string exactly as follows: "invalid credentials".
  if (
    !req.usernameExists ||
    !bcrypt.compareSync(req.body.password, req.bcryptPassword)
  ) {
    return next({ status: 400, message: "invalid credentials" });
  }

  // 2- On SUCCESSFUL login,
  //   the response body should have `message` and `token`:
  //   {
  //     "message": "welcome, Captain Marvel",
  //     "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
  //   }
  const token = generateToken(req.body)
  res.header('Authorization', `Bearer ${token}`);

  res.status(200).json({
    message: `welcome, ${req.body.username}`,
    token: token,
  });

  // IMPLEMENT
  // You are welcome to build additional middlewares to help with the endpoint's functionality.

  // 1- In order to log into an existing account the client must provide `username` and `password`:
  //   {
  //     "username": "Captain Marvel",
  //     "password": "foobar"
  //   }
});

module.exports = router, generateToken;
