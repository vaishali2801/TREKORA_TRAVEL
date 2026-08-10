import jwt from "jsonwebtoken";

/**
 * Signs a JWT for the user and sets it as an httpOnly cookie.
 * Returns the token so it can also be returned in the response body.
 */
const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
  });

  return token;
};

export default generateToken;
