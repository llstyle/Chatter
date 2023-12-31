import Message from "../models/Message.js"
import Chat from "../models/Chat.js"

const messagesHandlers = async (socket) => {

    socket.on("messages:get", async (chatid, callback) => {
        try {
            const chat = await Chat.findOne({_id: chatid, users: {"$in": [socket.user.user_id]}})
            if(!chat) {
                throw {message: "doesnt have permissions", code: 400}
            }

            await Message.updateMany({ viewed: { "$ne": socket.user.user_id}, chat}, { $push: { viewed: socket.user.user_id } })
            
            const messages = await Message.find({chat}).populate("owner", "firstname lastname")

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
    socket.on("message:new", async (chatid, content, callback) => {
        try {
            const chat = await Chat.findOne({_id: chatid, users: {"$in": [socket.user.user_id]}})
            if(!chat) {
                throw {message: "doesnt have permissions", code: 400}
            }

            let message = await Message.create({
                owner: socket.user.user_id,
                content,
                chat,
                viewed: [socket.user.user_id]
            })
            message = await message.populate("owner", "firstname lastname")

            chat.users.forEach((user) => {
                socket.to(user.toString()).emit("message:new", message)
            })

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
    })
}

export default messagesHandlers