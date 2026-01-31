const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token'); // Header se token nikalo
  if (!token) return res.status(401).json({ msg: "No token, entry denied! 🛑" });

  try {
    const decoded = jwt.verify(token, 'mindbridge_secret_key');
    req.user = decoded.id; // User ki ID request mein daal do
    next(); // Agle step par jao
  } catch (err) {
    res.status(401).json({ msg: "Token valid nahi hai! ❌" });
  }
};