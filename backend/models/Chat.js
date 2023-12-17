import mongoose from 'mongoose';

const Chat = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: true},
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: "user",
      required: true,
    },
})

export default mongoose.model('Chat', Chat)