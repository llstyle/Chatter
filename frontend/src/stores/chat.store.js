import { defineStore } from "pinia"
import { ref, computed } from "vue"

export const useChatStore = defineStore('chat', () => {
    const chats = ref([])
    const chat = ref({})
    const messages = ref([])

    const chatsFiltered = computed(() => {
        chats.value.sort((a, b) => {
            return new Date(b.message?.at(0).createdAt) - new Date(a.message?.at(0).createdAt);
        })
        return chats.value
    })
    
    return { chat, chats, messages, chatsFiltered  }
  })