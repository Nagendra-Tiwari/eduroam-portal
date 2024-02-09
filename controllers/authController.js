import dbConnection from '../database/dbConnection.js';
const db = dbConnection();
import jwt from 'jsonwebtoken';


export const loginuser = (req, res) => {
    const { email, password, collegeCode } = req.body;
    const query = 'SELECT * FROM collegeadmin WHERE email = ? AND password = ? AND college_code = ?';
  
    db.query(query, [email, password, collegeCode], (err, results) => {
      if (err) {
        res.status(500).send({ message: 'Internal Server Error' });
      } else {
        const user = results[0];
        if (user) {
          const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
          res.send({ message: 'Login Successful', user: user, token: token });
        } else {
          res.send({ message: 'Invalid credentials' });
        }
      }
    });
};

export const superadminlogin = (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM ernetadmin WHERE email = ? AND password = ? ';
  
    db.query(query, [email, password], (err, results) => {
      if (err) {
        res.status(500).send({ message: 'Internal Server Error' });
      } else {
        const user = results[0];
        if (user) {
          const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
          res.send({ message: 'Login Successful', user: user, token: token });
        } else {
          res.send({ message: 'Invalid credentials' });
        }
      }
    });
};

export const protectedRoute = (req, res) => {
    res.json({ message: 'You have access to this protected route!', userId: req.userId });
};

