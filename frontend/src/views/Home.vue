<script setup>
import Messages from "@/components/Messages.vue";
import SideBar from "@/components/SideBar.vue";
import { socket } from "@/socket";
import { useUserStore } from "@/stores/user.store";
import { useChatStore } from "@/stores/chat.store";
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import  useOnline from "@/composables/online/useOnline.js"

const router = useRouter()

const userStore = useUserStore()
const chatStore = useChatStore()

const setLastMessage = (message, chatId) => {
  const chat = chatStore.chats.find(c => c._id === chatId)
  if (chat) {
    chat.last = message
  }
  return chat
}

const back = async () => {
  chatStore.chat = {}
  chatStore.messages = []
}

onMounted(async () => {
  try {
    await userStore.refreshToken()
  } catch (e) {
    if(e.response.status === 401) {
      return await router.push({name: 'login'})
    }
    alert("Any problems on server")
  }
  if(userStore.user.token) {
    socket.auth = { token: userStore.user.token }
    socket.connect()
    socket.emit("chats")
  }
})

onUnmounted(() => {
  socket.disconnect()
  socket.off("connect");
  socket.off("chats");
  socket.off("chat:new");
  socket.off("message:new");
  socket.off("connect_error");
  socket.off("credentials");
  socket.off("user:connected");
  socket.off("user:disconnect")
})

useOnline(socket)

socket.on("chats", (chats) => {
  chatStore.chats = chats
})
socket.on("chat:new", (chat) => {
  socket.emit("chat:get", chat, (response) => {
    if(response.status === "OK") {
      chatStore.chats.push(response.chat)
    }
  })
})
socket.on("chat:delete", chat => {
  if(chat._id === chatStore.chat._id) {
    chatStore.chat = {}
    chatStore.messages = []
  }
  chatStore.chats = chatStore.chats.filter((chatFilter) => chatFilter._id !== chat._id)
})
socket.on("message:new", (message) => {
    const chat = setLastMessage(message, message.chat._id)
    if(message.chat._id === chatStore.chat._id) {
      chatStore.messages.push(message)

      socket.emit("message:view", message._id, (response) => {
        if(response.status === "NOK") {
          alert("Any troubles when sending message")
        }
      })
    } else {
      chat.unviewed++
    }
})

socket.on("message:delete", message => {
  if(message.chat === chatStore.chat._id) {
      chatStore.messages = chatStore.messages.filter((mes) => message._id !== mes._id)
    }
    setLastMessage(chatStore.messages.at(-1), message.chat)
})

socket.on("connect_error", (err) => {
  if (err.message === "Authentication error") {
    router.push({name: 'login'})
  }
});

const selectChat = (chatSelected) => {
  socket.emit("messages:get", chatSelected._id, (response) => {
    if(response.status === "OK") {
      chatStore.chat = chatSelected
      chatStore.messages = response.messages

      const chat = chatStore.chats.find(chat => chat._id === chatStore.chat._id)
      chat.unviewed = 0
    }
  })
}
const createChat = (user_id) => {
  socket.emit("chat:new", user_id, (response) => {
    if(response.status === "OK") {
      response.chat.users = response.chat.users.filter(user => user._id !== userStore.user.id)
      chatStore.chats.push(response.chat)
    }
  })
}
const deleteChat = (chat_id) => {
  socket.emit("chat:delete", chat_id, (response) => {
    if(response.status === "OK") {
      if(response.chat._id === chatStore.chat._id) {
        chatStore.chat = {}
        chatStore.messages = []
      }
      chatStore.chats = chatStore.chats.filter((chat) => chat._id !== response.chat._id)
    }
  })
}
const createMessage = (message) => {
  socket.emit("message:new", chatStore.chat._id, message.content, message.reply, (response) => {
    if(response.status === "OK") {
      chatStore.messages.push(response.message)
      setLastMessage(response.message, chatStore.chat._id)
    }
  })
}
const deleteMessage = (mesId) => {
  socket.emit("message:delete", mesId, (response) => {
    if(response.status === "OK") {
      chatStore.messages = chatStore.messages.filter((message) => message._id !== response.message)
      setLastMessage(chatStore.messages.at(-1), chatStore.chat._id)
    }
  })
}
</script>

<template>
  <div class="home-container">
    <SideBar :class="chatStore.chat._id ? 'sbar': 'sbar-active'" :chats="chatStore.chatsFiltered" :selectedChat="chatStore.chat._id" :userId="userStore.user.id" @selectChat="selectChat" @createChat="createChat" @deleteChat="deleteChat"/>
    <Messages :class="chatStore.chat._id ? 'messages-active': 'messages'" :messages="chatStore.messages" :user="userStore.user.id" :chat="chatStore.chat" @messageNew="createMessage" @messageDelete="deleteMessage" @back="back" />
  </div>
</template>

<style scoped>
.home-container {
  flex: 1;
  display: flex;
  min-height: 0;
  min-width: 0;
}

@media (max-width:960px) {
  .sbar-active {
    width: 100%;
    display: flex;
  }
  .messages {
    display: none;
  }
  .sbar {
    display: none;
  }
  .messages-active {
    width: 100%;
    display: flex;
  }
}
</style>
