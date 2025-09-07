const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log("🔑 Received header:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.replace("Bearer ", "")
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded contains {_id, email, ...}
    next();
  } catch (err) {
    console.error("❌ JWT Error:", err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
