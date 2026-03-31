module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  if (req.user.isAdmin !== true) {
    return res.status(403).json({ message: "Admin only" });
  }

  next();
};
