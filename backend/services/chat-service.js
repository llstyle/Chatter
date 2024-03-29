import SocketError from "../exceptions/socket-error.js"
import Chat from "../models/Chat.js"

class ChatService {
    async getChats(user) {
        const chats = await Chat.find({users: user})
        .populate("last")
        .populate({ path:"unviewed", match: { "viewed": {"$ne": user  } } })
        .populate({ path: "name", match: {"_id": {"$ne": user}}, select: "firstname lastname online"})      
        return chats
    }
    async getChat(chat_id, user) {
        if(!chat_id) {
            throw SocketError.BadRequest("chat not found")
        }
        const chat = await Chat.findOne({ _id: chat_id, users: user})
        .populate("last")
        .populate({ path:"unviewed", match: { "viewed": {"$ne": user  } } })
        .populate({ path: "name", match: {"_id": {"$ne": user}}, select: "firstname lastname"})  

        if (!chat) {
            throw SocketError.Forbidden("doesnt have permissions")
        }

        return chat
    }
    async createChat(chatter, user) {
        if(!chatter || user === chatter) {
            throw SocketError.BadRequest("chatter is you")
        }
        const users = [chatter, user]

        const exist = await Chat.findOne({users: { $all : users }})

        if(exist) {
            throw SocketError.BadRequest("already exists")
        }

        const chat_created = await Chat.create({users: users})

        const chat = await Chat.findOne({ _id: chat_created._id})
        .populate("last")
        .populate({ path:"unviewed", match: { "viewed": {"$ne": user  } } })
        .populate({ path: "name", match: {"_id": {"$ne": user}}, select: "firstname lastname"})

        return [chat_created, chat]
    }
    async deleteChat(chatId, user) {
        const chat = await Chat.findOne({users: user, _id: chatId})
        if(!chat) {
            throw SocketError.BadRequest("chat not found") 
        }
        await chat.deleteOne()
        return chat
    }
}

export default new ChatService