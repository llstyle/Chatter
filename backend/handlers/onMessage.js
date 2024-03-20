import Message from "../models/Message.js"
import Chat from "../models/Chat.js"
import Token from "../models/Token.js"
import { sendMessage } from "../services/notification-service.js"
const messagesHandlers = async (socket) => {

    socket.on("messages:get", async (chatid, callback) => {
        try {
            const chat = await Chat.findOne({_id: chatid, users: {"$in": [socket.user.user_id]}})
            if(!chat) {
                throw {message: "doesnt have permissions", code: 400}
            }

            await Message.updateMany({ viewed: { "$ne": socket.user.user_id}, chat}, { $push: { viewed: socket.user.user_id } })
            
            const messages = await Message.find({chat})
            .populate("owner", "firstname lastname")
            .populate("replyMessage", "_id content")

            callback({
                status: "OK",
                messages
            });
        } catch(e) {
            let message = "Any troubles on server"
            if(e.code === 400) {
                message = e.message
            }
            callback({
                status: "NOK",
                message: message
            });
        }
    })
    socket.on("message:new", async (chatid, content, replyMessage, callback) => {
        try {
            const chat = await Chat.findOne({_id: chatid, users: {"$in": [socket.user.user_id]}})
            if(!chat) {
                throw {message: "doesnt have permissions", code: 400}
            }

            if(replyMessage) {
                replyMessage = await Message.findOne({_id: replyMessage, chat: chat._id})
                if(!replyMessage) {
                    throw {message: "doesnt have permissions", code: 400}
                }
            }

            let message = await Message.create({
                owner: socket.user.user_id,
                chat,
                content,
                replyMessage,
                viewed: [socket.user.user_id]
            })
            message = await message.populate("owner", "firstname lastname")
            socket.to(message.chat.id.toString()).emit("message:new", message)

            const tokens = await Token.find({user: chat.users, user: {$ne: socket.user.user_id} }, "deviceToken").distinct('deviceToken')
            sendMessage(message, tokens)

            callback({
                status: "OK",
                message
            });
        } catch(e) {
            callback({
                status: "NOK",
                message: "Any troubles on server"
            });
        }
    }),
    socket.on("message:delete", async (messageId, callback) => {
        try {
            const message = await Message.findOne({_id: messageId, owner: socket.user.user_id})

            if(!message) {
                throw {message: "doesnt have permissions", code: 400}
            }

            await message.deleteOne()

            const last = await Message.findOne({chat: message.chat}, {}, { sort: {createdAt: -1} })

            socket.to(message.chat.toString()).emit("message:delete", {last, message})

            callback({
                status: "OK",
                message: message._id
            });
        } catch(e) {
            callback({
                status: "NOK",
                message: "Any troubles on server"
            });
        }
    }),
    socket.on("message:view", async (messageId, callback) => {
        try {
            const message = await Message.findOneAndUpdate({_id: messageId }, { $addToSet: {viewed: socket.user.user_id} }, {new: true})
            callback({
                status: "OK",
                message
            });
        } catch {
            callback({
                status: "NOK",
                message: "Any troubles on server"
            });
        }
    })
}

export default messagesHandlers
