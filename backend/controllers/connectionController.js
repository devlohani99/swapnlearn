import Connection from '../models/Connection.js';
import User from '../models/User.js';

const sendConnectionRequest = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const requesterId = req.user.id;

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (requesterId === targetUserId) {
      return res.status(400).json({ error: 'Cannot connect with yourself' });
    }

    const existingConnection = await Connection.findOne({
      $or: [
        { requester: requesterId, recipient: targetUserId },
        { requester: targetUserId, recipient: requesterId }
      ]
    });

    if (existingConnection) {
      if (existingConnection.status === 'pending') {
        return res.status(400).json({ error: 'Connection request already pending' });
      } else if (existingConnection.status === 'accepted') {
        return res.status(400).json({ error: 'Already connected' });
      }
    }

    const connection = new Connection({
      requester: requesterId,
      recipient: targetUserId
    });

    await connection.save();

    res.status(201).json({ 
      message: 'Connection request sent successfully',
      connection 
    });

  } catch (error) {
    console.error('Error sending connection request:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Connection request already exists' });
    }
    res.status(500).json({ error: 'Failed to send connection request' });
  }
};

const getConnectionRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const pendingRequests = await Connection.find({
      recipient: userId,
      status: 'pending'
    }).populate('requester', 'username email bio skillsToTeach skillstoLearn');

    res.json({ pendingRequests });

  } catch (error) {
    console.error('Error getting connection requests:', error);
    res.status(500).json({ error: 'Failed to get connection requests' });
  }
};

const acceptConnectionRequest = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const userId = req.user.id;

    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({ error: 'Connection request not found' });
    }

    if (connection.recipient.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to accept this request' });
    }

    if (connection.status !== 'pending') {
      return res.status(400).json({ error: 'Connection request is not pending' });
    }

    connection.status = 'accepted';
    await connection.save();

    res.json({ 
      message: 'Connection request accepted',
      connection 
    });

  } catch (error) {
    console.error('Error accepting connection request:', error);
    res.status(500).json({ error: 'Failed to accept connection request' });
  }
};

const rejectConnectionRequest = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const userId = req.user.id;

    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({ error: 'Connection request not found' });
    }

    if (connection.recipient.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to reject this request' });
    }

    if (connection.status !== 'pending') {
      return res.status(400).json({ error: 'Connection request is not pending' });
    }

    connection.status = 'rejected';
    await connection.save();

    res.json({ 
      message: 'Connection request rejected',
      connection 
    });

  } catch (error) {
    console.error('Error rejecting connection request:', error);
    res.status(500).json({ error: 'Failed to reject connection request' });
  }
};

const getUserConnections = async (req, res) => {
  try {
    const userId = req.user.id;

    const connections = await Connection.find({
      $or: [
        { requester: userId, status: 'accepted' },
        { recipient: userId, status: 'accepted' }
      ]
    }).populate('requester', 'username email bio skillsToTeach skillstoLearn')
      .populate('recipient', 'username email bio skillsToTeach skillstoLearn');

    const formattedConnections = connections.map(connection => {
      const otherUser = connection.requester._id.toString() === userId 
        ? connection.recipient 
        : connection.requester;
      
      return {
        _id: connection._id,
        otherUser,
        createdAt: connection.createdAt
      };
    });

    res.json({ connections: formattedConnections });

  } catch (error) {
    console.error('Error getting user connections:', error);
    res.status(500).json({ error: 'Failed to get connections' });
  }
};

export {
  sendConnectionRequest,
  getConnectionRequests,
  acceptConnectionRequest,
  rejectConnectionRequest,
  getUserConnections
}; 