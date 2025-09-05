const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log("🔑 Received header:", authHeader); // Debug log

  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.startsWith("Bearer ") 
    ? authHeader.replace("Bearer ", "") 
    : authHeader;

  if (!token) {
    return res.status(401).json({ message: 'Token missing, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded user:", decoded); // Debug log
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ JWT Error:", err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
