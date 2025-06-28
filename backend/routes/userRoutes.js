import express from 'express';
import {getProfile,updateProfile,getAllUsers,matchUsers} from '../controllers/userController.js';

import { auth } from '../middleware/auth.js';

const router=express.Router();

router.get('/profile',auth,getProfile);
router.put('/profile', auth, updateProfile);
router.get('/', getAllUsers);
router.get('/match', auth, matchUsers);

export default router;