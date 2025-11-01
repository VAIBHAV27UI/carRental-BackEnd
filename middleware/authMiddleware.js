const authMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Please log in before making a booking." });
  }
  next();
};