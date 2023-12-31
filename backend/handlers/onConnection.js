import chatsHandlers from "./onChats.js"
import messagesHandlers from "./onMessage.js"

const onConnection = (socket) => {
    socket.emit('credentials', socket.user)

    chatsHandlers(socket)

    socket.join(socket.user.user_id)

    messagesHandlers(socket)
}

export default onConnection