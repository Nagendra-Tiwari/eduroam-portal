// src/routes/authRoutes.js
import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { loginuser, protectedRoute,superadminlogin } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginuser);
router.post('/superadminlogin', superadminlogin);
router.get('/protected-route', verifyToken,protectedRoute);

export default router;
