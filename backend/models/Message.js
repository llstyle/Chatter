import mongoose from 'mongoose';

const Message = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: {type:  String, required: true},
    contentType: {type:  String, enum: ['text'], default: "text"},
    viewed: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    replyMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }
}, { timestamps: true })

export default mongoose.model('Message', Message)