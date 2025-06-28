import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const ConnectionRequests = () => {
  const token = useAuthStore((state) => state.token);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionStates, setActionStates] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/connections/requests`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setRequests(data.pendingRequests || []);
      } else {
        setError(data.error || 'Failed to fetch requests');
      }
    } catch (err) {
      setError('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (connectionId) => {
    try {
      setActionStates(prev => ({ ...prev, [connectionId]: 'accepting' }));
      
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/connections/accept/${connectionId}`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (res.ok) {
        setRequests(prev => prev.filter(req => req._id !== connectionId));
        setActionStates(prev => ({ ...prev, [connectionId]: 'accepted' }));
        setTimeout(() => {
          setActionStates(prev => {
            const newState = { ...prev };
            delete newState[connectionId];
            return newState;
          });
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to accept request');
        setActionStates(prev => ({ ...prev, [connectionId]: null }));
      }
    } catch (err) {
      setError('Failed to accept request');
      setActionStates(prev => ({ ...prev, [connectionId]: null }));
    }
  };

  const handleReject = async (connectionId) => {
    try {
      setActionStates(prev => ({ ...prev, [connectionId]: 'rejecting' }));
      
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/connections/reject/${connectionId}`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (res.ok) {
        setRequests(prev => prev.filter(req => req._id !== connectionId));
        setActionStates(prev => ({ ...prev, [connectionId]: 'rejected' }));
        setTimeout(() => {
          setActionStates(prev => {
            const newState = { ...prev };
            delete newState[connectionId];
            return newState;
          });
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to reject request');
        setActionStates(prev => ({ ...prev, [connectionId]: null }));
      }
    } catch (err) {
      setError('Failed to reject request');
      setActionStates(prev => ({ ...prev, [connectionId]: null }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading requests...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Connection Requests</h1>
        <button 
          onClick={() => navigate('/')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back to Home
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {requests.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-xl mb-4">No pending connection requests</div>
          <p className="text-gray-400">When someone sends you a connection request, it will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {requests.map((request) => (
            <div
              key={request._id}
              className="bg-white border rounded-lg shadow-md p-6"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                  {request.requester.username?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{request.requester.username}</h3>
                  <p className="text-gray-500 text-sm">{request.requester.email}</p>
                </div>
                <div className="text-sm text-gray-400">
                  {new Date(request.createdAt).toLocaleDateString()}
                </div>
              </div>

              {request.requester.bio && (
                <p className="text-gray-600 mb-4">{request.requester.bio}</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {request.requester.skillsToTeach && request.requester.skillsToTeach.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Can Teach:</h4>
                    <div className="flex flex-wrap gap-1">
                      {request.requester.skillsToTeach.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {request.requester.skillstoLearn && request.requester.skillstoLearn.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Wants to Learn:</h4>
                    <div className="flex flex-wrap gap-1">
                      {request.requester.skillstoLearn.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleAccept(request._id)}
                  disabled={actionStates[request._id] === 'accepting' || actionStates[request._id] === 'accepted'}
                  className={`flex-1 py-2 px-4 rounded font-medium transition-colors ${
                    actionStates[request._id] === 'accepted'
                      ? 'bg-green-500 text-white'
                      : actionStates[request._id] === 'accepting'
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {actionStates[request._id] === 'accepting' ? 'Accepting...' : 
                   actionStates[request._id] === 'accepted' ? 'Accepted!' : 'Accept'}
                </button>
                
                <button
                  onClick={() => handleReject(request._id)}
                  disabled={actionStates[request._id] === 'rejecting' || actionStates[request._id] === 'rejected'}
                  className={`flex-1 py-2 px-4 rounded font-medium transition-colors ${
                    actionStates[request._id] === 'rejected'
                      ? 'bg-red-500 text-white'
                      : actionStates[request._id] === 'rejecting'
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  {actionStates[request._id] === 'rejecting' ? 'Rejecting...' : 
                   actionStates[request._id] === 'rejected' ? 'Rejected!' : 'Reject'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConnectionRequests; 