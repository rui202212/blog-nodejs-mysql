const jwt = require("jsonwebtoken");

//-------------------middleware de verification ------
function authenticateToken(req, res, next) {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    return res.status(401).send({ message: "Unauthorized: No token provided" });
  }

  const token = req.headers.authorization.split(" ")[1];
  console.log("TOKEN:", token);

  if (!token) {
    return res.status(401).send({ message: "Unauthorized: No token provided" });
  }

  // Verification du token
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ message: "Forbidden: Invalid token" });
  }
  
  /* jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      return res.status(403).send({ message: "Forbidden: Invalid token" });
    }

    // Attach the user payload to the request object
    req.user = user;
    next();
  }); */
}

module.exports = authenticateToken;
