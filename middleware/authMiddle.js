const jwt = require('jsonwebtoken');
const JWT_SECRET = "cghgedkejg";

const verifyToken = (req, res, next) => {
  const htoken = req.header('Authorization');
  if (!htoken) return res.status(401).json({ message: 'Access denied' });
  const token = htoken.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: err.message  });
  }
};

module.exports = verifyToken;