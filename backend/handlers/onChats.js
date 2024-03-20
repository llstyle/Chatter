import Chat from "../models/Chat.js"
import Token from "../models/Token.js"
import { subcribeTopic, unsubcribeTopic } from "../services/notification-service.js"
const chatsHandlers = (socket) => {
    socket.on("chats", async () => {
        try {
            const chats = await Chat.find({users: socket.user.user_id})
            .populate("last")
            .populate({ path:"unviewed", match: { "viewed": {"$ne": socket.user.user_id  } } })
            .populate({ path: "name", match: {"_id": {"$ne": socket.user.user_id}}, select: "firstname lastname online"})      
            socket.emit("chats", chats)
        } catch(e) {
            console.log(e)
        }
    })
    socket.on("chat:get", async (chat_id, callback) => {
        try {
            if(!chat_id) {
                throw {message: "pls put id of chat", code: 400}
            }
            const chat = await Chat.findOne({ _id: chat_id, users: socket.user.user_id})
            .populate("last")
            .populate({ path:"unviewed", match: { "viewed": {"$ne": socket.user.user_id  } } })
            .populate({ path: "name", match: {"_id": {"$ne": socket.user.user_id}}, select: "firstname lastname"})  
            if (!chat) {
                throw {message: "doesnt have permissions", code: 400}
            }

            socket.join(chat._id.toString())

            callback({
                status: "OK",
                chat
            });
        } catch (e) {
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
    socket.on("chat:new", async (chatter, callback) => {
        try {
            if(!chatter || socket.user.user_id === chatter) {
                throw {message: "chatter is you", code: 400}
            }
            const users = [chatter, socket.user.user_id]

            const exist = await Chat.findOne({users: { $all : users }})

            if(exist) {
                throw {message: "already exists", code: 400}
            }

            const chat_created = await Chat.create({users: users})

            socket.join(chat_created._id.toString())

            chat_created.users.forEach((user) => {
                socket.to(user.toString()).emit("chat:new", chat_created._id)
            })

            const chat = await Chat.findOne({ _id: chat_created._id})
            .populate("last")
            .populate({ path:"unviewed", match: { "viewed": {"$ne": socket.user.user_id  } } })
            .populate({ path: "name", match: {"_id": {"$ne": socket.user.user_id}}, select: "firstname lastname"})  

            callback({
                status: "OK",
                chat
            })
        } catch(e) {
            console.log(e)
            let message = "Any troubles on server"
            if(e.code === 400) {
                message = e.message
            }
            callback({
                status: "NOK",
                message: message
            });
        }
    }),

    socket.on("chat:delete", async (chatId, callback) => {
        try {
            const chat = await Chat.findOne({users: socket.user.user_id, _id: chatId})

            if(!chat) {
                throw {message: "doesnt have permissions", code: 400}
            }

            await chat.deleteOne()

            socket.to(chat._id.toString()).emit("chat:delete", chat)
            socket.in(chat._id.toString()).socketsLeave(chat._id);

            callback({
                status: "OK",
                chat
            })
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
}

export default chatsHandlers