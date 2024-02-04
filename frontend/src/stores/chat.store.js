import { defineStore } from "pinia"
import { ref, computed } from "vue"

export const useChatStore = defineStore('chat', () => {
    const chats = ref([])
    const chat = ref({})
    const messages = ref([])

    const chatsFiltered = computed(() => {
        return [...chats.value].sort((a, b) => {
            if (a === null) {
                return 1;
            }
            if (b === null) {
              return -1;
            }
            return new Date(b.message?.at(0)?.createdAt) - new Date(a.message?.at(0)?.createdAt);
        })
    })

    return { chat, chats, messages, chatsFiltered  }
  })