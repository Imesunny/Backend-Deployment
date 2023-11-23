const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  //Bearer token

  if (!token) {
    return res.json({ message: "Please Login first" });
  }

  jwt.verify(token, "shhhhh", function (err, decoded) {
    if (err) {
      return res.json({ message: "Invalid token" });
    } else {
      console.log(decoded);
      const { userID } = decoded;
      req.userID = userID;
      next();
    }
  });
};


module.exports= {authentication};