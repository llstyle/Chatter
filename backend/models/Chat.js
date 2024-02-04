import mongoose from 'mongoose';
import Message from './Message.js';

const Chat = new mongoose.Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
})

Chat.pre('deleteOne', { document: true, query: false }, async function(next) {
    await Message.deleteMany({chat: this._id})
    next()
});

export default mongoose.model('Chat', Chat)