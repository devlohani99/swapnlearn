import User from "../models/User.js";

export const getProfile=async(req,res)=>{
  try{
    const user=await User.findById(req.user.id).select('-password');
    res.json(user);

  }
  catch(err){
    res.status(500).json({error:err.message});

  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { username, bio, skillsToTeach, skillstoLearn } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, bio, skillsToTeach, skillstoLearn },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const matchUsers = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const matches = await User.find({
      _id: { $ne: user._id },
      skillsToTeach: { $in: user.skillstoLearn },
      skillstoLearn: { $in: user.skillsToTeach }
    }).select('-password');
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};