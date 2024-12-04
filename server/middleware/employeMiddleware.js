const jwt = require("jsonwebtoken");
const Employe = require("../models/Employe");
const SECRET = "employesecret";
exports.isLoggedIn = async (req, res, next) => {
  // token could be found in request cookies or in reqest headers
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Login first to access this page",
    });
  }
  try {
    const decoded = jwt.verify(token, SECRET);
    req.employe = await Employe.findById(decoded.id);
    next();
  } catch (error) {
    // Handle JWT verification error
    return res.status(401).json({
      success: false,
      message: "token authorization error! Please login first",
    });
  }
};
