const validateRegisterer = require("../middleware/validateRegisterer");
const usernameExists = require("../middleware/usernameExists");
const router = require("express").Router();
const DataOps = require("../DataOps");
const bcrypt = require('bcrypt');

router.post(
  "/register",
  validateRegisterer,
  usernameExists,
  async (req, res, next) => {

    // Check for existing username
    if (req.usernameExists) {
      return next({ status: 400, message: "username taken" });
    }

    await DataOps.createUser(req.body)
    .then((result) => {
      // bcrypt password - 6 rotations
      req.body.password = bcrypt.hashSync(req.body.password, 6);
      const [id] = result;

      const response = {
        id: id,
        username: req.body.username,
        password: req.body.password
      }

      res.status(200).json(response);
    })
    .catch(next)

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
  res.status(200).json({ message: "logged in successfully" });

  // IMPLEMENT
  // You are welcome to build additional middlewares to help with the endpoint's functionality.

  // 1- In order to log into an existing account the client must provide `username` and `password`:
  //   {
  //     "username": "Captain Marvel",
  //     "password": "foobar"
  //   }

  // 2- On SUCCESSFUL login,
  //   the response body should have `message` and `token`:
  //   {
  //     "message": "welcome, Captain Marvel",
  //     "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
  //   }

  // 3- On FAILED login due to `username` or `password` missing from the request body,
  //   the response body should include a string exactly as follows: "username and password required".

  // 4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
  //   the response body should include a string exactly as follows: "invalid credentials".
  if (req.usernameExists) {
    return next({ status: 400, message: "username taken" });
  }
});

module.exports = router;
