import express from 'express';
import {
  getAllUsers,
  updateUser,
  deleteUser,
  getAllDoctors,
  updateDoctor,
  deleteDoctor,
} from '../Controllers/adminController.js';
import { authenticate, restrict } from '../auth/verifyToken.js';

const router = express.Router();

router.use(authenticate);
router.use(restrict(['admin']));

router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/doctors', getAllDoctors);
router.put('/doctors/:id', updateDoctor);
router.delete('/doctors/:id', deleteDoctor);

export default router;
