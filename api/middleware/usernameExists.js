const { findUsers } = require("../DataOps");

// 4- On FAILED registration due to the `username` being taken,
//       the response body should include a string exactly as follows: "username taken".

module.exports = async (req, res, next) => {
  console.log("CHECKING USERNAME EXISTS");
  const userArray = await findUsers();
  const user = userArray.filter((user) => {
      if (user.username === req.body.username) {
        return user;
      }
  })
  if (user.length) {
    req.body.id = user[0].id;
    req.bcryptPassword = user[0].password;
    req.usernameExists = true;
  } else {
    req.usernameExists = false;
  }
  next();
};
