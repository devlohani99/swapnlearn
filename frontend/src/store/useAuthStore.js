import {create} from 'zustand';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const useAuthStore=create((set,get)=>({
  user:null,
  token:localStorage.getItem('token')||null,
  loading:false,
  error:null,

  signup:async({username,email,password})=>{
    set({loading:true,error:null});
    try{
      const res=await fetch(`${API_URL}/auth/signup`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({username,email,password}),
      });
      const data=await res.json();
      if(!res.ok)throw new Error(data.error||'Signup failed');
      set({loading:false,error:null});
      return true;

    }
    catch(err){
      set({loading:false,error:err.message});
      return false;
    }
  },
  logout:()=>{
    set({user:null,token:null});
    localStorage.removeItem('token');
  },
  signin: async({email,password})=>{
    set({loading:true,error:null});
    try{
      const res=await fetch(`${API_URL}/auth/signin`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({email,password}),
      });
      const data=await res.json();
      if(!res.ok)throw new Error(data.error||'Signin failed');
      set({user:data.user,token:data.token,loading:false,error:null});
      localStorage.setItem('token',data.token);
      return true;
    }
    catch(err){
      set({loading:false,error:err.message});
      return false;
    }
  },

  fetchProfile:async()=>{
    set({loading:true,error:null});
    try{
      const token=get().token;
      if(!token) throw new Error('No token');
      const res = await fetch(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch profile');
      set({ user: data, loading: false, error: null });
      return data;

    }
    catch(err){
      set({loading:false,error:err.message});
      return null;
    }
  }



}))