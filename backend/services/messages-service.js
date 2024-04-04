import Chat from "../models/Chat.js"
import Message from "../models/Message.js"
import SocketError from "../exceptions/socket-error.js"
import DeviceToken from "../models/DeviceToken.js"
import { sendMessage } from "../utils/notification-util.js"

class MessagesService {
    async getMessages(chatid, page, user) {
        const limit = 50

        if(!chatid) {
            throw SocketError.BadRequest("chat is required")
        }

        const chat = await Chat.findOne({_id: chatid, users: {"$in": [user]}})

        if(!chat) {
            throw SocketError.BadRequest("chat is required")
        }

        await Message.updateMany({ viewed: { "$ne": user}, chat}, { $push: { viewed: user } })
        
        const messages = await Message.find({chat})
        .sort({ createdAt: -1 })
        .limit(limit).skip(((Math.max(1, page) - 1) * limit))
        .populate("owner", "firstname lastname")
        .populate("replyMessage", "_id content")
        .lean()

        return messages.reverse()
    }
    async createMessage(chatid, content, replyMessage, user) {
        const chat = await Chat.findOne({_id: chatid, users: {"$in": [user]}})
        if(!chat) {
            throw SocketError.BadRequest("chat is required")
        }
        if(replyMessage) {
            replyMessage = await Message.findOne({_id: replyMessage, chat: chat._id})
            if(!replyMessage) {
                throw SocketError.Forbidden("doesnt have permissions")
            }
        }

        let message = await Message.create({
            owner: user,
            chat,
            content,
            replyMessage,
            viewed: [user]
        })

        message = await message.populate("owner", "firstname lastname")
        const tokens = await DeviceToken.find({ $and: [{user: chat.users}, {user: {$ne: user}}] }, "deviceToken").distinct('deviceToken')
        sendMessage(message, tokens)
        
        return message
    }
    async deleteMessage(messageId, user) {
        const message = await Message.findOne({_id: messageId, owner: user})

        if(!message) {
            throw SocketError.BadRequest("message not found")
        }

        await message.deleteOne()

        const last = await Message.findOne({chat: message.chat}, {}, { sort: {createdAt: -1} })

        return [message, last]
    }
    async viewMessage(messageId, user) {
        const message = await Message.findOneAndUpdate({_id: messageId }, { $addToSet: {viewed: user} }, {new: true})
        if(!message) {
            throw SocketError.BadRequest("message not found")
        }
        return message
    }
}
export default new MessagesService