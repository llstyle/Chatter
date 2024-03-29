<template>

    <div class="messages-container" v-if="chat._id">
      <MessageHeader @back="emit('back')" :chat="chat" />
      <div class="message-list" ref="messageList">
        
        <div v-for="message in messages" :key="message._id" class="message-main" :id="message._id">
          <div class="message" :class="{ 'sent': message.owner._id === user }">
            <div class="reply-container" v-if="message.replyMessage?._id">
              <div class="reply-message" @click="scrollTo(message.replyMessage._id)">{{ message.replyMessage.content }}</div>
            </div>
            <div class="content">
              <div class="message-content" v-html="markdown.render(message.content)"></div>
              <div @click="showOptions(message._id)" class="dropdown-options" >
                ⋮
                <div v-if="showOptionsId === message._id" class="dropdown">
                  <button @click="replyMessage(message._id, message.content)">Reply</button>
                  <button v-if="message.owner._id === user" @click="deleteMessage(message._id)">Delete</button>
                </div>
              </div>
            </div>
          </div>
          <div class="additional-container">
              <div class="message-meta">
                {{ (new Date(message.createdAt)).toLocaleString('en-GB', {day:'numeric', month: 'long', year:'numeric'}) }}
              </div>
            </div>
        </div>
      </div>

      <div class="input-container">
        <div class="reply" v-if="reply.mesId">
          <div class="reply-content" >{{ reply.content }}</div>
          <div class="reply-undo" @click="unReplyMessage">&#10006;</div>
        </div>
        <div class="message-input">
          <textarea v-model="content" required placeholder="Type a message" @keydown.enter.exact.prevent="sendMessage"></textarea>
          <button @click.prevent="sendMessage" style="background-color: black;color: chartreuse;font-size: x-large;">&#8680;</button>
        </div>  
      </div>
    </div>
    <div class="select-container" v-else>
      <div class="select">
        <h3>Select chat</h3>
      </div>
    </div>
</template>
  
<script setup>
  import { nextTick, onMounted, ref, watch } from 'vue';
  import MessageHeader from './MessageHeader.vue';
  import markdownit from 'markdown-it'

  const markdown = markdownit({html:false, linkify: true, typographer: true})

  const props = defineProps({
    messages: Array,
    user: String,
    chat: Object
  })
  const emit = defineEmits(['messageNew', 'messageDelete', 'back'])

  const messageList = ref()
  
  const reply = ref({}) 
  const content = ref('');
  
  const showOptionsId = ref(null)

  const showOptions = (messageId) => {
    showOptionsId.value = showOptionsId.value === messageId ? null : messageId;
  };
  const sendMessage = () => {
    if(props.user && props.chat._id && content.value) {
        emit("messageNew", { content: content.value, reply: reply.value.mesId })
        content.value = ""
        reply.value = {}
    }
  };
  const deleteMessage = (mesId) => {
    if(mesId) {
      emit("messageDelete", mesId)
    }
  }
  const replyMessage = (mesId, content) => {
    reply.value = {mesId, content}
  }
  const unReplyMessage = () => {
    reply.value = {}
  }
  const scrollTo = async (id) => {
    await nextTick()
    document.getElementById(id).scrollIntoView()
  }
  onMounted(async () => {
    if (props.chat.id) {
      messageList.value.scrollTop = messageList.value.scrollHeight
    }
  })
  watch(() => props.messages, async () => {
    if(props.messages.length > 0) {
      await nextTick()
      messageList.value.scrollTop = messageList.value.scrollHeight
    }
  }, {deep: true})
</script>

<style scoped lang="css" src="@/assets/styles/messages.css"></style>


  