import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const Connections = () => {
  const token = useAuthStore((state) => state.token);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/connections/connections`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setConnections(data.connections || []);
      } else {
        setError(data.error || 'Failed to fetch connections');
      }
    } catch (err) {
      setError('Failed to fetch connections');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (connectionId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/messages/${connectionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConnection) return;

    try {
      setSendingMessage(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/messages/send`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            connectionId: selectedConnection._id,
            content: newMessage.trim(),
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, data.message]);
        setNewMessage('');
        await fetchMessages(selectedConnection._id);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSendingMessage(false);
    }
  };

  const selectConnection = async (connection) => {
    setSelectedConnection(connection);
    await fetchMessages(connection._id);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading connections...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Connections</h1>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/connection-requests')}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Connection Requests
          </button>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Back to Home
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {connections.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-xl mb-4">No connections yet</div>
          <p className="text-gray-400 mb-4">Start connecting with people to exchange skills!</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Browse Users
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Connections List */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Connections</h2>
            <div className="space-y-3">
              {connections.map((connection) => (
                <div
                  key={connection._id}
                  onClick={() => selectConnection(connection)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedConnection?._id === connection._id
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {connection.otherUser.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-medium">{connection.otherUser.username}</h3>
                      <p className="text-sm text-gray-500">
                        Connected {new Date(connection.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="lg:col-span-2">
            {selectedConnection ? (
              <div className="bg-white border rounded-lg h-96 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {selectedConnection.otherUser.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-medium">{selectedConnection.otherUser.username}</h3>
                      <p className="text-sm text-gray-500">Connected</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            message.sender === 'me'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={sendMessage} className="p-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={sendingMessage}
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sendingMessage}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {sendingMessage ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white border rounded-lg h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-xl mb-2">Select a connection</div>
                  <p>Choose a connection from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Connections; 