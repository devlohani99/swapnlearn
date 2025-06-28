import React,{useState} from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const SignupForm=()=>{

  const signup=useAuthStore((state)=>state.signup);
  const loading=useAuthStore((state)=>state.loading);
  const error=useAuthStore((state)=>state.error);

  const [form,setForm]=useState({username:'',email:'',password:''});
  const navigate = useNavigate();

  const handleChange=(e)=>{
    setForm({...form,[e.target.name]:e.target.value});

  };


  const handleSubmit=async(e)=>{
    e.preventDefault();
    const success = await signup(form);
    if (success) {
      navigate('/edit-profile');
    }
  }
  return (
<form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <input
        name="username"
        value={form.username}
        onChange={handleChange}
        placeholder="Username"
        className="input input-bordered w-full"
        required
      />
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="input input-bordered w-full"
        required
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        className="input input-bordered w-full"
        required
      />
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
      {error && <div className="text-red-500">{error}</div>}
    </form>
  );
};

export default SignupForm;