import User from "../users.model.js";

export const verifyUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).populate("tenants.tenantId").select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
