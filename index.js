// index.js
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import dbConnection from './eduroam-portal/database/dbConnection.js';
import authRoutes from './eduroam-portal/routes/authRoutes.js';
import userRoutes from './eduroam-portal/routes/userRoutes.js';


const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

const db = dbConnection();

const userSchema = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  password VARCHAR(255),
  college_code VARCHAR(255),
  user_type VARCHAR(255),
  student_id VARCHAR(255),
  department VARCHAR(255)
)`;

db.query(userSchema, (err) => {
  if (err) {
    console.error('Error creating user table:', err);
  } else {
    console.log('User table created or already exists');
  }
});

app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.listen(8002, () => {
  console.log('BE started at port 8002');
});
