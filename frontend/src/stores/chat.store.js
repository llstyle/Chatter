import { defineStore } from "pinia"
import { ref, computed } from "vue"

export const useChatStore = defineStore('chat', () => {
    const chats = ref([])
    const chat = ref({})
    const messages = ref([])

    const chatsFiltered = computed(() => {
        return [...chats.value].sort((a, b) => {
            if(!a.message.at(0)?.createdAt) {
                return 1
            }
            if(!b.message.at(0)?.createdAt) {
                return -1
            }
            console.log(a.message.at(0)?.createdAt)
            return new Date(b.message.at(0).createdAt) - new Date(a.message.at(0)?.createdAt);
        })
    })

    return { chat, chats, messages, chatsFiltered  }
  })
