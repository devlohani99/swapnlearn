import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';

const Home = () => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestStates, setRequestStates] = useState({});
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/users`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        const data = await res.json();
        if (res.ok) {
          setUsers(data);
        } else {
          setError(data.error || 'Failed to fetch users');
        }
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const sendConnectionRequest = async (targetUserId) => {
    try {
      setRequestStates(prev => ({ ...prev, [targetUserId]: 'sending' }));
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/connections/request`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ targetUserId }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setRequestStates(prev => ({ ...prev, [targetUserId]: 'sent' }));
        setTimeout(() => {
          setRequestStates(prev => ({ ...prev, [targetUserId]: 'sent' }));
        }, 2000);
      } else {
        setRequestStates(prev => ({ ...prev, [targetUserId]: 'error' }));
        setTimeout(() => {
          setRequestStates(prev => ({ ...prev, [targetUserId]: null }));
        }, 3000);
      }
    } catch (err) {
      setRequestStates(prev => ({ ...prev, [targetUserId]: 'error' }));
      setTimeout(() => {
        setRequestStates(prev => ({ ...prev, [targetUserId]: null }));
      }, 3000);
    }
  };

  const getButtonText = (userId) => {
    const state = requestStates[userId];
    switch (state) {
      case 'sending':
        return 'Sending...';
      case 'sent':
        return 'Request Sent!';
      case 'error':
        return 'Failed';
      default:
        return 'Connect';
    }
  };

  const getButtonClass = (userId) => {
    const state = requestStates[userId];
    switch (state) {
      case 'sending':
        return 'w-full mt-4 bg-gray-400 text-white py-2 px-4 rounded cursor-not-allowed';
      case 'sent':
        return 'w-full mt-4 bg-green-500 text-white py-2 px-4 rounded';
      case 'error':
        return 'w-full mt-4 bg-red-500 text-white py-2 px-4 rounded';
      default:
        return 'w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors';
    }
  };

  const filteredUsers = users.filter(userItem => {
    const search = filter.toLowerCase();
    return (
      userItem.username?.toLowerCase().includes(search) ||
      userItem.skillsToTeach?.some(skill => skill.toLowerCase().includes(search)) ||
      userItem.skillstoLearn?.some(skill => skill.toLowerCase().includes(search))
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to swapnlearn!</h1>
        <p className="text-lg text-gray-600">
          Connect with people who can teach you new skills and learn from your expertise
        </p>
      </div>
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="Search by username or skill..."
          className="input input-bordered w-full max-w-md"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((userItem) => (
          <div
            key={userItem._id}
            className="bg-white border rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3 overflow-hidden">
                {userItem.imageUrl ? (
                  <img
                    src={userItem.imageUrl}
                    alt={userItem.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  userItem.username?.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{userItem.username}</h3>
                <p className="text-gray-500 text-sm">{userItem.email}</p>
              </div>
            </div>
            {userItem.bio && (
              <p className="text-gray-600 mb-4 text-sm">{userItem.bio}</p>
            )}
            {userItem.skillsToTeach && userItem.skillsToTeach.length > 0 && (
              <div className="mb-3">
                <h4 className="font-medium text-sm text-gray-700 mb-2">
                  Can Teach:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {userItem.skillsToTeach.map((skill, index) => (
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
            {userItem.skillstoLearn && userItem.skillstoLearn.length > 0 && (
              <div className="mb-3">
                <h4 className="font-medium text-sm text-gray-700 mb-2">
                  Wants to Learn:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {userItem.skillstoLearn.map((skill, index) => (
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
            {token && user && user._id !== userItem._id && (
              <button 
                className={getButtonClass(userItem._id)}
                onClick={() => sendConnectionRequest(userItem._id)}
                disabled={requestStates[userItem._id] === 'sending'}
              >
                {getButtonText(userItem._id)}
              </button>
            )}
          </div>
        ))}
      </div>
      {filteredUsers.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No users found. Try a different search!
        </div>
      )}
    </div>
  );
};

export default Home;