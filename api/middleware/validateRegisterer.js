
// 1- In order to register a new account the client must provide `username` and `password`:
//       {
//         "username": "Captain Marvel", // must not exist already in the `users` table
//         "password": "foobar"          // needs to be hashed before it's saved
//       }
// 3- On FAILED registration due to `username` or `password` missing from the request body,
//       the response body should include a string exactly as follows: "username and password required".

module.exports = (req, res, next) => {
  const user = req.body;
  if (!user.username || !user.password) {
    return next({ status: 400, message:"username and password required" });
  }
  console.log("SUBMISSION VALIDATED SUCCESSFULLY")
  next();
};
