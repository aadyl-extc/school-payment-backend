const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization; 
  if (!authHeader) return res.status(401).json({ error: "NO TOKEN PROVIDED" });

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
    return res.status(401).json({ error: "INVALID AUTH HEADER" });
  }
  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email }; 
    next(); 
    
  } catch (err) {
    return res.status(401).json({ error: "INVALID OR EXPIRED TOKEN" });
  }
};

module.exports = authMiddleware;
