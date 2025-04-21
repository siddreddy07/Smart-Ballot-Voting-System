import jwt from "jsonwebtoken";

export const generateToken = (userInput, res, purpose = null) => {
  let payload = {};

  if (/^\d{10}$/.test(userInput)) {
    payload.PHN_NO = userInput;
  } else if (/\S+@\S+\.\S+/.test(userInput)) {
    payload.EMAIL = userInput;
  } else {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  if (purpose) {
    payload.purpose = purpose; // "verification" or "vote"
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'Lax',
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
  });

  return token; // return the token string if you want to send it in response too
};
