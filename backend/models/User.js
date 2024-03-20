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
      required: true,
      default: 'user'
    },
    online: { type: Boolean, default: false}
}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
      virtuals: true
  }
})
User.virtual('token', {
  ref: "Token",
  localField: "_id",
  foreignField: "user",
  justOne: true,
  options: {select: "deviceToken"}
})
export default mongoose.model('User', User)