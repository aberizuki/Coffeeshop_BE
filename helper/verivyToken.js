const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = process.env;
const verifyToken = (req, res, next) => {
  const token = req.header("token");
  if (!req.header("token")) {
    return res.status(400).send({
      message: "token is required",
    });
  } else {
    // console.log(req.header.authorization)

    jwt.verify(token, JWT_PRIVATE_KEY, function (err, decoded) {
      if (!err) {
        //authorization
        if (decoded.role === "admin") {
          next();
        } else if (decoded.role === "user") {
          return res.status(403).send({
            message: "access denied",
          });
        } else {
          return res.status(403).send({
            message: "access denied",
          });
        }
      } else {
        return res.status(400).send({
          message: "invalid token",
        });
      }
    });
  }
};

module.exports = verifyToken;
