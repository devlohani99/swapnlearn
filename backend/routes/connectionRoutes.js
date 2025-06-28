import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  sendConnectionRequest,
  getConnectionRequests,
  acceptConnectionRequest,
  rejectConnectionRequest,
  getUserConnections
} from '../controllers/connectionController.js';

const router = express.Router();

router.post('/request', auth, sendConnectionRequest);

router.get('/requests', auth, getConnectionRequests);

router.put('/accept/:connectionId', auth, acceptConnectionRequest);

router.put('/reject/:connectionId', auth, rejectConnectionRequest);

router.get('/connections', auth, getUserConnections);

export default router; 