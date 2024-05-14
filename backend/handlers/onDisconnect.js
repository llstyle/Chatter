import logger from "../utils/logger.js"
import User from "../models/User.js"
import Chat from "../models/Chat.js"

const disconnectHandler = async (socket) => {
    socket.on("disconnect", async () => {
        try {
            const matchingSockets = await socket.in(socket.user.user_id).allSockets();
            const isDisconnected = matchingSockets.size === 0;
            if (isDisconnected) {
                const chats = (await Chat.find({users: socket.user.user_id}).distinct('_id'))
    
                chats.forEach(chat_id => {
                    socket.to(chat_id.toString()).emit("user:disconnect", {chat_id, user_id: socket.user.user_id})
                })
    
                await User.findOneAndUpdate({_id: socket.user.user_id}, {online: false})
            }
        } catch (e) {
            logger.error(e)
        }
    });
}
export default disconnectHandler