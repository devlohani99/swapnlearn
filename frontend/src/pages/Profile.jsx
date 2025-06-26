import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

const Profile = () => {
  const user = useAuthStore((state) => state.user);
  const fetchProfile = useAuthStore((state) => state.fetchProffile);

  useEffect(() => {
    if (!user) fetchProfile();
  }, [user, fetchProfile]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div><b>Username:</b> {user.username}</div>
      <div><b>Email:</b> {user.email}</div>
    </div>
  );
};

export default Profile;