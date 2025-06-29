import mongoose from 'mongoose';

const connectDB=async()=>{
  try{
    const conn=await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo is connected");

  }
  catch{
    console.error('${error.message}');
    process.exit(1);
  }
}

export default connectDB;