import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  console.log(req);
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    req.userId = decoded.userId;
    next();
  });
};

export { verifyToken };
