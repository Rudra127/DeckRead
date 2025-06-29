import { validateSignature } from "../utils/index.js";

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token is missing or invalid" });
    }
    console.log("object", { authHeader });

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer "
    const isAuthorized = await validateSignature(req, token);

    if (isAuthorized) {
      return next();
    }

    return res.status(403).json({ message: "Not Authorized" });
  } catch (error) {
    // console.error("Authorization error:", error); // Log the error for debugging
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default protect;
