import messagesService from "../services/messages-service.js"
import SocketError from "../exceptions/socket-error.js"
const messagesHandlers = async (socket) => {

    socket.on("messages:get", async (chatid, page, callback) => {
        try {
            const messages = await messagesService.getMessages(chatid, page, socket.user.user_id)
            callback({ status: "OK", messages});
        } catch(e) {
            console.log(e)
            callback({ 
                status: "NOK",
                message: e instanceof SocketError ? "Any troubles on server": e.message 
            });
        }
    })
    socket.on("message:new", async (chatid, content, replyMessage, callback) => {
        try {
            const message = await messagesService.createMessage(chatid, content, replyMessage, socket.user.user_id)

            socket.to(message.chat.id.toString()).emit("message:new", message)

            callback({ status: "OK", message });
        } catch(e) {
            console.log(e)
            callback({ 
                status: "NOK",
                message: e instanceof SocketError ? "Any troubles on server": e.message 
            });
        }
    }),
    socket.on("message:delete", async (messageId, callback) => {
        try {
            const [message, last] = await messagesService.deleteMessage(messageId, socket.user.user_id)

            socket.to(message.chat.toString()).emit("message:delete", {last, message})

            callback({ status: "OK", message: message._id});
        } catch(e) {
            callback({ 
                status: "NOK",
                message: e instanceof SocketError ? "Any troubles on server": e.message 
            });
        }
    }),
    socket.on("message:view", async (messageId, callback) => {
        try {
            const message = await messagesService.viewMessage(messageId, user)
            callback({ status: "OK", message });
        } catch(e) {
            callback({ 
                status: "NOK",
                message: e instanceof SocketError ? "Any troubles on server": e.message 
            });
        }
    })
}

export default messagesHandlers
