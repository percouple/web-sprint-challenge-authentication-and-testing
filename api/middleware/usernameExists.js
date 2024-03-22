const { findUsers } = require("../DataOps");

// 4- On FAILED registration due to the `username` being taken,
//       the response body should include a string exactly as follows: "username taken".

module.exports = async (req, res, next) => {
  console.log("CHECKING USERNAME EXISTS");
  const userArray = await findUsers();
  if (
    userArray.filter((user) => {
      return user.username === req.body.username;
    }).length
  ) {
    req.usernameExists = true;
  } else {
    req.usernameExists = false;
  }
  next();
};
