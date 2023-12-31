import mongoose from "mongoose";
import Chat from "../models/Chat.js"
import Message from "../models/Message.js"

const chatsHandlers = async (socket) => {
    const chats =  await Chat.aggregate([
        { $match: { users: {"$in": [new mongoose.Types.ObjectId(socket.user.user_id)]} } },
        {
          $lookup:  { from: 'messages', localField: '_id', foreignField: 'chat', as: 'message' }
        },
        {
            $lookup:  { from: 'users', localField: 'users', foreignField: '_id', as: 'users' }
        },
        { 
          $addFields: { "message": { "$slice": ["$message", -1] }}
        }
    ])

    socket.emit("chats", chats)

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

            let chat = await Chat.create({users: users})
            chat = await chat.populate("users", "_id firstname lastname")
            
            chat.users.forEach((user) => {
                socket.to(user._id.toString()).emit("chat:new", chat)
            })

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