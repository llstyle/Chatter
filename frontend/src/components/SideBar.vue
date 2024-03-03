<template>
    <aside class="sidebar">
      <div class="optional">
        <Header style="margin-bottom: 1%;" />
        <div class="search-bar">
          <input v-model="searchQuery" type="text" placeholder="Search friends" />
        </div>
          <div style="position: absolute;background-color: black;">
              <div style="padding: 8px;border: 1px gray solid; cursor: pointer;"  v-for="user in searchUsers" :key="user._id" @click="createChat(user)">
                  {{ user.username }}| {{ user.firstname }} {{ user.lastname }}
              </div>
          </div>
      </div>
      
      <div class="friends-list">
        <div v-for="chat in chats" :key="chat._id" :class="selectedChat === chat._id ? 'friend selected': 'friend'" @click="emit('selectChat', chat)">
          <div class="friend-details" >
            <span>{{ chat.name.at(0).firstname }} {{ chat.name.at(0).lastname }}</span>
            <div style="display: flex;">
              <div v-if="chat.name.at(0).online" class="online"></div>
              <div class="last-message">{{ chat.last?.content }}</div>
            </div>
          </div>
          <div style="display: flex;position: relative;">
            <div v-if="chat.unviewed > 0" class="notification">{{ chat.unviewed }}</div>
              <div @click.stop="showOptions(chat._id)" class="dropdown-options" >
                ⋮
                <div  v-if="showOptionsId === chat._id" class="dropdown">
                  <button @click="deleteChat(chat._id)">Delete</button>
                </div>
              </div>
          </div>
        </div>
      </div>
    </aside>
  </template>
  
  <script setup>
  import { computed, ref, watch } from 'vue';
  import axios from 'axios';
import { useUserStore } from '@/stores/user.store';
import Header from './Header.vue';
  
  const props = defineProps({
    chats: Array,
    selectedChat: String,
    userId: String
  })
  const emit = defineEmits(['selectChat', 'createChat', 'deleteChat'])

  const searchUsers = ref([])
  
  const searchQuery = ref('');

  const userStore = useUserStore()

  const showOptionsId = ref(null)

  const showOptions = (chatId) => {
    showOptionsId.value = showOptionsId.value === chatId ? null : chatId;
  };

  const findUsers = async (val) => {
    try {
        const response = await axios.get(`/auth/search?search=${val}`, {
            headers: {
                "Authorization": userStore.user.token
            }
        });
        searchUsers.value = response.data
    } catch (error) {
        console.error('Login failed:', error);
    }
  }
  const createChat = (user) => {
    searchQuery.value = ""
    emit('createChat', user._id)
  }
  const deleteChat = (chatId) => {
    if(chatId) {
      emit("deleteChat", chatId)
    }
  }
  watch(searchQuery, async (val) => {
    if(val) {
        findUsers(val)
    } else {
      searchUsers.value = []
    }
  })
  </script>
  
  <style scoped>
  .sidebar {
    width: 300px;
    height: 100%;
    background-color: black;
    border-right: 1px solid #ddd;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
  }
  
  .search-bar {
    margin-bottom: 10px;
  }
  
  .search-bar input {
    width: 100%;
    padding: 8px;
    background-color: chartreuse;
    color: black;
    border-radius: 4px;
  }
  
  .friends-list {
    overflow-y: auto;
    flex: 1;
  }
  
  .friend {
    position: relative;
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ddd;
    cursor: pointer;
  }
  .friend span {
    font-size: 1em;
  }
  .selected {
    background-color: chartreuse;
    color: black;
  }

.friend-details {
  flex-grow: 1;
  position: relative;
}

.last-message {
  color: #888;
  font-size: 0.8em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100px;
}

.notification {
  font-size: small;
  color: red;  
  padding: 2px;
  margin-top: auto;
  margin-bottom: auto;
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
  .online {
    width: 8px;
    height: 8px;
    background-color: red;
    margin-right: 5px;
    margin-top: auto;
    margin-bottom: auto;
  }
  </style>
  