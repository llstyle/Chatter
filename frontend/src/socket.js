import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
  fooEvents: [],
  barEvents: []
});

const URL = import.meta.env.VITE_API_URL;

export const socket = io(URL, {autoConnect: false});