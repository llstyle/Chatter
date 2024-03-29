import chatService from "../services/chat-service.js"
import SocketError from "../exceptions/socket-error.js"

const chatsHandlers = (socket) => {
    socket.on("chats", async () => {
        try {
            const chats = await chatService.getChats(socket.user.user_id)
            socket.emit("chats", chats)
        } catch(e) {
            console.log(e)
        }
    })
    socket.on("chat:get", async (chat_id, callback) => {
        try {
            const chat = await chatService.getChat(chat_id, socket.user.user_id)
            socket.join(chat._id.toString())
            callback({ status: "OK", chat });
        } catch (e) {
            console.log(e)
            callback({ 
                status: "NOK",
                message: e instanceof SocketError ? "Any troubles on server": e.message 
            });
        }

    })
    socket.on("chat:new", async (chatter, callback) => {
        try {
            const [chat_created, chat] = await chatService.createChat(chatter, socket.user.user_id)
            socket.join(chat_created._id.toString())

            chat_created.users.forEach((user) => {
                socket.to(user.toString()).emit("chat:new", chat_created._id)
            })
            callback({ status: "OK", chat })
        } catch(e) {
            console.log(e)
            callback({ 
                status: "NOK",
                message: e instanceof SocketError ? "Any troubles on server": e.message 
            });
        }
    }),

    socket.on("chat:delete", async (chatId, callback) => {
        try {
            const chat = await chatService.deleteChat(chatId, socket.user.user_id)
            socket.to(chat._id.toString()).emit("chat:delete", chat)
            socket.in(chat._id.toString()).socketsLeave(chat._id);
            callback({ status: "OK", chat })
        } catch(e) {
            console.log(e)
            callback({ 
                status: "NOK",
                message: e instanceof SocketError ? "Any troubles on server": e.message 
            });
        }
    })
}

export default chatsHandlers