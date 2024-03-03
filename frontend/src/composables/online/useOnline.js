import { useChatStore } from "@/stores/chat.store";

export default function online(socket) {
    const chatStore = useChatStore()

    socket.on("user:disconnect", (user) => {
        const chat = chatStore.chats.find(c => c._id === user.chat_id)
        chat.name.at(0).online = false
    })

    socket.on("user:connected", (user) => {
        const chat = chatStore.chats.find(c => c._id === user.chat_id)
        chat.name.at(0).online = true
    })
}