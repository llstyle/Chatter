import mongoose from 'mongoose';

const Activation = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    activationLink: {type: String, required: true}
})

export default mongoose.model('Activation', Activation)