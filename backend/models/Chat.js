import mongoose from 'mongoose';
import Message from './Message.js';

const Chat = new mongoose.Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
})

Chat.pre('remove', function(next) {
    Message.remove({chat: this._id}).exec();
    next();
});

export default mongoose.model('Chat', Chat)