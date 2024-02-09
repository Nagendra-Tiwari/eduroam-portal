// src/routes/userRoutes.js
import express from 'express';
import {
  registerUser,
  getUserData,
  getUserDataforernet,
  updateUserStatus,
  deleteUser,
  editUser,
  updateRadcheck,
  deleteRadcheck,
  getColleges,
  addCollege,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.get('/getUserData', getUserData);
router.get('/getUserDataforernet', getUserDataforernet);
router.get('/getColleges', getColleges);
router.put('/updateUserStatus/:userId', updateUserStatus);
router.delete('/deleteUser/:userId', deleteUser);
router.put('/editUser/:userId', editUser);
router.put('/updateRadcheck/:userId', updateRadcheck);
router.delete('/deleteRadcheck/:userEmail', deleteRadcheck);
router.post('/college/add', addCollege);



export default router;
