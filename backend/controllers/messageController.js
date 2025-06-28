import Message from '../models/Message.js';
import Connection from '../models/Connection.js';
import User from '../models/User.js';

const sendMessage = async (req, res) => {
  try {
    const { connectionId, content } = req.body;
    const senderId = req.user.id;

    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' });
    }

    if (connection.status !== 'accepted') {
      return res.status(400).json({ error: 'Connection must be accepted to send messages' });
    }

    if (connection.requester.toString() !== senderId && connection.recipient.toString() !== senderId) {
      return res.status(403).json({ error: 'Not authorized to send message in this connection' });
    }

    const message = new Message({
      connection: connectionId,
      sender: senderId,
      content: content.trim()
    });

    await message.save();

    await message.populate('sender', 'username');

    res.status(201).json({ 
      message: 'Message sent successfully',
      message: {
        _id: message._id,
        content: message.content,
        sender: message.sender.username,
        createdAt: message.createdAt
      }
    });

  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

const getMessages = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const userId = req.user.id;

    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' });
    }

    if (connection.status !== 'accepted') {
      return res.status(400).json({ error: 'Connection must be accepted to view messages' });
    }

    if (connection.requester.toString() !== userId && connection.recipient.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to view messages in this connection' });
    }

    const messages = await Message.find({ connection: connectionId })
      .populate('sender', 'username')
      .sort({ createdAt: 1 });

    const formattedMessages = messages.map(message => ({
      _id: message._id,
      content: message.content,
      sender: message.sender._id.toString() === userId ? 'me' : 'other',
      senderName: message.sender.username,
      createdAt: message.createdAt
    }));

    res.json({ messages: formattedMessages });

  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
};

export {
  sendMessage,
  getMessages
}; 