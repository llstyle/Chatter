import axios from "axios"
import { defineStore } from "pinia"
import { reactive, ref } from "vue"

export const useUserStore = defineStore('user', () => {
    const user = reactive({
        token: '',
        username: '',
        email: '',
        id: ''
    })
    const refreshTokenTimeout = ref(null)

    const refreshToken = async () => {
        const response = await axios.get(`/auth/refresh`, { withCredentials: true });
        user.token = response.data.accessToken
        startRefreshTokenTimer();
    }
    const startRefreshTokenTimer = () => {
        const jwtBase64 = user.token.split('.')[1];
        const jwtToken = JSON.parse(atob(jwtBase64));

        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);

        user.username = jwtToken.username
        user.email = jwtToken.email
        user.id = jwtToken._id

        refreshTokenTimeout.value = setTimeout(refreshToken, timeout);
    }

    return { user, refreshTokenTimeout, refreshToken, startRefreshTokenTimer  }
  })