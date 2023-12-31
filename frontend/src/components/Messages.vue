<template>
    <div class="messages-container" v-if="chat">
      <div class="message-list" ref="messageList">
        <div v-for="message in messages" :key="message._id" class="message" :class="{ 'sent': message.owner._id === user }">
          <div class="message-content">{{ message.content }}</div>
          <div class="message-meta" v-if="message.owner._id === user">You</div>
          <div class="message-meta" v-else >{{ message.owner.firstname }} {{ message.owner.lastname }}</div>
        </div>
      </div>
      <div class="message-input">
        <textarea v-model="content" placeholder="Type a message"></textarea>
        <button @click="sendMessage">Send</button>
      </div>
    </div>
    <div class="select-container" v-else>
      <div class="select">
        <h3>Select chat</h3>
      </div>
    </div>
  </template>
  
  <script setup>
  import { nextTick, ref, watch } from 'vue';

  const props = defineProps({
    messages: Array,
    user: String,
    chat: String
  })
  const emit = defineEmits(['messageNew'])

  const messageList = ref()
  
  const content = ref('');
  
  const sendMessage = () => {
    if(props.user && props.chat) {
        emit("messageNew", content.value)
        content.value = ""
    }
  };
  watch(() => props.messages, async () => {
    if(props.messages.length > 0) {
      await nextTick()
      messageList.value.scrollTop = messageList.value.scrollHeight
    }
  }, {deep: true})
  </script>
  
  <style scoped>
  .messages-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
  
  .message-list {
    flex: 1;
    overflow-y: auto;
  }
  
  .message {
    max-width: 70%;
    padding: 10px;
    margin: 10px;
    border-radius: 8px;
  }
  
  .message-content {
    word-wrap: break-word;
  }
  
  .sent {
    align-self: flex-end;
    background-color: #dcf8c6;
  }
  
  .message-meta {
    font-size: 0.8em;
    color: #888;
    margin-top: 5px;
  }
  
  .message-input {
    display: flex;
    align-items: center;
    padding: 10px;
    border-top: 1px solid #ddd;
  }
  
  textarea {
    flex: 1;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: none;
    margin-right: 10px;
  }
  
  button {
    padding: 8px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .select-container {
    height: 100%;
    width: 100%;
  }
  .select h3 {
    margin: 0;
    background: #f4f4f4;
    padding: 8px;
    border-radius: 12px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%) 
  }
  </style>
  