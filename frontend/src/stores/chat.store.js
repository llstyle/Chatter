import { defineStore } from "pinia"
import { ref, computed } from "vue"

export const useChatStore = defineStore('chat', () => {
    const chats = ref([])
    const chat = ref({})
    const messages = ref([])

    const chatsFiltered = computed(() => {
        return [...chats.value].sort((a, b) => {
            if(!a.last?.createdAt) {
                return 1
            }
            if(!b.last?.createdAt) {
                return -1
            }
            return new Date(b.last?.createdAt) - new Date(a.last?.createdAt);
        })
    })

    return { chat, chats, messages, chatsFiltered  }
  })
