const jwt = require("jsonwebtoken");
require("dotenv").config();

const validateToken = (req, res, next) => {
  const publicRoutes = ["/users/login", "/users/register"];

  if (publicRoutes.includes(req.path)) {
    next();
  } else {
    const bearer = req.headers["authorization"];

    if (!bearer) {
      res.json({
        status: false,
        message: "Unauthorized Access 0",
      });
    } else {
      const tokenSet = bearer.split(" ");
      const token = tokenSet[1];
      try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        if (verified) {
          req.user = {
            id: verified.id,
            name: verified.name,
            email: verified.email,
            roles: verified.roles,
          };
          next();
        } else {
          res.json({
            status: false,
            message: "Unauthorized Access -1",
          });
        }
      } catch (error) {
        res.json({
          status: false,
          message: "Unauthorized Access -2", //this is done when some one modify jwt token and attempt to use
        });
      }
    }
  }
};

module.exports = validateToken;
