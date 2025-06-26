import React,{useState} from "react";
import { useAuthStore } from "../../store/useAuthStore";

const LoginForm=()=>{
  const signin=useAuthStore((state)=>state.signin);
  const loading=useAuthStore((state)=>state.loading);
  const error=useAuthStore((state)=>state.error);

  const [form,setForm]=useState({email:'',password:''});

  const handleChange=(e)=>{
    setForm({...form,[e.target.name]:e.target.value});

  };

  const handleSubmit=async(e)=>{
    e.preventDefault();
    await signin(form);
  }
  return(
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="input input-boardered w-full" required></input>

      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="password" className="input input-boardered w-full" required></input>

      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>      {error&& <div className="text-red-500">{error}</div>}
    </form>
  );

};

export default LoginForm;