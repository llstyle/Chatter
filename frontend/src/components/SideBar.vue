<template>
    <aside class="sidebar">
      <div class="optional">
        <Header style="margin-bottom: 1%;" />
        <div class="search-bar">
          <input v-model.trim="searchQuery" type="text" placeholder="Search friends" />
        </div>
          <div class="search-friends">
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
  
  <style scoped lang="css" src="@/assets/styles/sidebar.css"></style>
  