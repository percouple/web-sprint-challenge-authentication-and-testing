const jwt = require("jsonwebtoken");
const ENV_JWT_SECRET = process.env.ENV_JWT_SECRET || "openSesame";

module.exports = (req, res, next) => {

  // 2- On missing token in the Authorization header,
  // the response body should include a string exactly as follows: "token required".
  if (!req.headers.authorization) {
    next({ status: 401, message: "token required" });
  }
  console.log(req.headers.authorization)

  const [userToken] = req.headers.authorization.split(" ")
  .filter((element) => {
    if (element !== "Bearer") {
      return element;
    }
  })

  console.log(userToken)
  
  try {
    // 1- On valid token in the Authorization header, call next.
    const validatedUser = jwt.verify(userToken, ENV_JWT_SECRET);
    req.user = validatedUser;
    return next();
  } catch (err) {
    // 3- On invalid or expired token in the Authorization header,
    // the response body should include a string exactly as follows: "token invalid".
    return next({ status: 401, message: "token invalid" });
  }
};
