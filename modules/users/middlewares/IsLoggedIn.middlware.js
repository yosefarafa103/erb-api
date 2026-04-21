import jwt from "jsonwebtoken";

export const isLoggedIn = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err.message);
    next("errr");
  }
};
