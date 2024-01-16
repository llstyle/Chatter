import mongoose from 'mongoose';

const User = new mongoose.Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: true},
    verified: { type: Boolean, default: false, select: false},
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      required: true,
    }
})

export default mongoose.model('User', User)