import chatsHandlers from "./onChats.js"
import messagesHandlers from "./onMessage.js"

const onConnection = (socket) => {
    chatsHandlers(socket)

    socket.join(socket.user.user_id)

    messagesHandlers(socket)
}

export default onConnection