<script setup>
import Messages from "@/components/Messages.vue";
import SideBar from "@/components/SideBar.vue";
import { socket, state } from "@/socket";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter()
const token = localStorage.getItem("token")

const currUser = ref({})
const chats = ref([])

const selectedChat = ref("")
const chatMessages = ref([])


onMounted(() => {
  if(token) {
    socket.auth = { token }
    socket.connect()
  }
})

onUnmounted(() => {
  socket.disconnect()
})
socket.on("credentials", (user) => {
  currUser.value = user
})

socket.on("chats", (chat) => {
  chat.forEach(c => {
    c.users = c.users.filter(user => user._id !== currUser.value.user_id)
  })
  chats.value = chat
})
socket.on("chat:new", (chat) => {
  chat.users = chat.users.filter(user => user._id !== currUser.value.user_id)
  chats.value.push(chat)
})
socket.on("message:new", (message) => {
    if(message.chat._id === selectedChat.value) {
      chatMessages.value.push(message)
    }
    const chat = chats.value.find(c => c._id === message.chat._id)
    if (chat) {
      chat.message = [message]
    }
})

socket.on("connect_error", (err) => {
  if (err.message === "Authentication error") {
    router.push({name: 'login'})
  }
});

const selectChat = (chatid) => {
  socket.emit("messages:get", chatid, (response) => {
    if(response.status === "OK") {
      selectedChat.value = chatid
      chatMessages.value = response.messages
      const chat = chats.value.find(chat => chat._id === selectedChat.value)
      if (chat) {
        chat.message = [response.messages.at(-1)]
      }
    }
  })
}
const createChat = (user_id) => {
  socket.emit("chat:new", user_id, (response) => {
    if(response.status === "OK") {
      response.chat.users = response.chat.users.filter(user => user._id !== currUser.value.user_id)
      chats.value.push(response.chat)
    }
  })
}
const createMessage = (content) => {
  socket.emit("message:new", selectedChat.value, content, (response) => {
    if(response.status === "OK") {
      chatMessages.value.push(response.message)
      const chat = chats.value.find(chat => chat._id === selectedChat.value)
      if (chat) {
        chat.message = [response.message]
      }
    }
  })
} 

const connected = computed(() => state.connected)

</script>

<template>
  <div class="home-container">
    <SideBar :chats="chats" :selectedChat="selectedChat" :userId="currUser.user_id" @selectChat="selectChat" @createChat="createChat" />
    <Messages :messages="chatMessages" :user="currUser.user_id" :chat="selectedChat" @messageNew="createMessage" />
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  width: 100%;
  height: 100%;
}

</style>
