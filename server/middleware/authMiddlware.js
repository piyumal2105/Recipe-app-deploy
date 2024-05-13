import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "Authorization token not found" });
  }

  // Grab the token from headers (taking the "Bearer " string away)
  const token = authorization.split(" ")[1];

  try {
    // Decode and extract the user id from token
    const { id } = jwt.verify(token, process.env.SECRET_KEY);

    // Save the user in request
    req.user = await User.findById(id).select("_id");

    // Go to the next function/middleware
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export default authMiddleware;
