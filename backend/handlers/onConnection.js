import Chat from "../models/Chat.js"
import User from "../models/User.js"

import chatsHandlers from "./onChats.js"
import disconnectHandler from "./onDisconnect.js"
import messagesHandlers from "./onMessage.js"

const onConnection = async (socket) => {

    disconnectHandler(socket)

    chatsHandlers(socket)

    messagesHandlers(socket)

    const chats = (await Chat.find({users: socket.user.user_id}).distinct('_id')).map((id) => id.toString())
    socket.join([socket.user.user_id, ...chats])

    await User.findOneAndUpdate({_id: socket.user.user_id}, {online: true})

    chats.forEach(chat_id => {
        socket.to(chat_id).emit("user:connected",  {chat_id, user_id: socket.user.user_id})
    })
}

export default onConnection