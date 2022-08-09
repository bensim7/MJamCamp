const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  console.log("auth activated");

  try {
    const token = req.headers["authorization"].replace("Bearer ", "");

    if (token) {
      console.log("token is present");
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
      req.decoded = decoded;
      next();
    } else {
      return res.status(403).send({
        status: "error",
        message: "missing token",
      });
    }
  } catch (error) {
    return res
      .status(401)
      .send({ status: "error", message: "An A error has occured." });
  }
};

module.exports = auth;
