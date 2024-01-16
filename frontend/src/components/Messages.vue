<template>
    <div class="messages-container" v-if="chat">
      <div class="message-list" ref="messageList">
        <div v-for="message in messages" :key="message._id" class="message" :class="{ 'sent': message.owner._id === user }">
          <div style="width: 100%;">
            <div class="message-content">
              {{ message.content }}
            </div>
            <div class="additional-container">
              <div class="message-meta" v-if="message.owner._id !== user" >{{ message.owner.firstname }} {{ message.owner.lastname }}</div>
              <div class="message-meta">
                {{ (new Date(message.createdAt)).toLocaleString('en-GB', {day:'numeric', month: 'long', year:'numeric'}) }}
              </div>
            </div>
          </div>

          <div  v-if="message.owner._id === user" @click="showOptions(message._id)" class="dropdown-options">
            ⋮
            <div v-if="showOptionsId === message._id" class="dropdown">
              <button @click="deleteMessage(message._id)">Delete</button>
            </div>
          </div>

        </div>
      </div>
      <div class="message-input">
        <textarea v-model="content" required placeholder="Type a message"></textarea>
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
  const emit = defineEmits(['messageNew', 'messageDelete'])

  const messageList = ref()
  
  const content = ref('');
  
  const showOptionsId = ref(null)

  const showOptions = (messageId) => {
    showOptionsId.value = showOptionsId.value === messageId ? null : messageId;
  };
  const sendMessage = () => {
    if(props.user && props.chat) {
        emit("messageNew", content.value)
        content.value = ""
    }
  };
  const deleteMessage = (mesId) => {
    if(mesId) {
      emit("messageDelete", mesId)
    }
  }
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
    display: flex;
    justify-content: space-between;
  }
  
  .message-content {
    word-wrap: break-word;
  }
  
  .sent {
    align-self: flex-end;
    background-color: chartreuse;
    color: black;
  }
  .message-meta {
    font-size: 0.8em;
    color: #888;
    margin-top: 5px;
    display: flex;
    justify-content: space-between;
  }
  .option {
    color: #888;
    font-size: large;
    font-weight: bold;
    padding: 0;
    height: 100%;
    background: none;
  }
  .dropdown {
    position: absolute;
    top: 20px;
    right: 0;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    z-index: 1;
  }

  .dropdown button {
    padding: 5px;
    background-color: chartreuse;
    border: none;
    cursor: pointer;
  }
  .dropdown-options {
    cursor: pointer;
    position: relative;
    font-size: xx-large;
    font-weight: bold;
    justify-self: end;
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
    border: 1px solid black;
    background-color: chartreuse;
    color: black;
    border-radius: 4px;
    resize: none;
    margin-right: 10px;
  }
  
  button {
    padding: 8px;
    background-color: chartreuse;
    color: black;
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
    background-color: chartreuse;
    color: black;
    padding: 8px;
    border-radius: 12px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%) 
  }
  .additional-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
</style>
  