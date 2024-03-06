import mongoose from 'mongoose';
import Message from './Message.js';

const Chat = new mongoose.Schema({
    type: {type: String, enum: ['chat', 'group'], required: true},
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

Chat.pre('deleteOne', { document: true, query: false }, async function(next) {
    await Message.deleteMany({chat: this._id})
    next()
});
Chat.virtual('name', {
    ref: "User",
    localField: "users",
    foreignField: "_id"
})
Chat.virtual('unviewed', {
    ref: "Message",
    localField: "_id",
    foreignField: "chat",
    count: true
})
Chat.virtual('last', {
    ref: "Message",
    localField: "_id",
    foreignField: "chat",
    justOne: true,
    options: {sort: {createdAt: -1}}
})

export default mongoose.model('Chat', Chat)
