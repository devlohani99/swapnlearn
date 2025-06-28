import {useEffect,useState} from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { NavLink, useNavigate } from 'react-router-dom';

const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const EditProfile=()=>{
  const user=useAuthStore((state)=>state.user);
  const token=useAuthStore((state)=>state.token);
  const fetchProfile=useAuthStore((state)=>state.fetchProfile);
  const logout=useAuthStore((state)=>state.logout);
  const navigate = useNavigate();

  const [form,setForm]=useState({
    username:'',
    bio:'',
    skillsToTeach:[],
    skillstoLearn:[],
  });
  const [message,setMessage]=useState('');
  const [loading,setLoading]=useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.imageUrl || '');

  useEffect(()=>{
    if(user){
      setForm({
        username:user.username||'',
        bio:user.bio||'',
        skillsToTeach:user.skillsToTeach||[],
        skillstoLearn:user.skillstoLearn||[],
      });
      setImagePreview(user?.imageUrl || '');
    }
    else{
      fetchProfile();
    }
  },[user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value.split(',').map(s => s.trim()) });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    let imageUrl = user?.imageUrl || '';

    if (image) {
      const data = new FormData();
      data.append('file', image);
      data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      const res = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: data,
      });
      const file = await res.json();
      imageUrl = file.secure_url;
    }

    const res = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/users/profile`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          imageUrl,
        }),
      }
    );
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setMessage('Profile updated!');
      fetchProfile();
      navigate('/profile');
    } else {
      setMessage(data.error || 'Update failed');
    }
  };

  const handleLogout = () => {
    logout();
    clearAllCookies();
    navigate('/login');
  };

  const clearAllCookies = () => {
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          className="input input-bordered w-full"
          required
        />
        <input
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="Bio"
          className="input input-bordered w-full"
        />
        <input
          name="skillsToTeach"
          value={form.skillsToTeach.join(', ')}
          onChange={handleArrayChange}
          placeholder="Skills to Teach (comma separated)"
          className="input input-bordered w-full"
        />
        <input
          name="skillstoLearn"
          value={form.skillstoLearn.join(', ')}
          onChange={handleArrayChange}
          placeholder="Skills to Learn (comma separated)"
          className="input input-bordered w-full"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="input input-bordered w-full"
        />
        {imagePreview && (
          <img src={imagePreview} alt="Profile Preview" className="w-24 h-24 rounded-full mt-2 object-cover" />
        )}
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
        {message && <div className="text-green-600">{message}</div>}
      </form>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default EditProfile;