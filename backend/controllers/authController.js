import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already in use' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const signin=async(req,res)=>{
  try{
    const {email,password}=req.body;

    const user=await User.findOne({email});
    if(!user)return res.status(400).json({error:'Invalid details'});

    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch)return res.status(400).json({error:'Not match password'});

    const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'});

    res.json({token,user:{id:user._id,username:user.username,email:user.email}});

  }
  catch(err){
    res.status(500).json({erorr:err.message});
  }
}

export const logout = (req, res) => {
  res.clearCookie("token"); 
  res.status(200).json({ message: "Logged out successfully" });
};

