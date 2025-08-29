const jwt = require("jsonwebtoken");

const authenticateAdmin = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    console.log("Authentication error: No token provided");
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      console.log(
        `Authentication error: User role ${decoded.role} is not admin`
      );
      return res.status(403).json({ error: "Access denied. Admin only." });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.log("Authentication error: Invalid token", error.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { authenticateAdmin };
