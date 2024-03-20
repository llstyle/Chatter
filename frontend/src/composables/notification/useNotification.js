import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { initializeApp } from "firebase/app";

export default function notification() {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_APIKEY,
      authDomain: import.meta.env.VITE_AUTHDOMAIN,
      projectId: import.meta.env.VITE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_APP_ID
    };

    const app = initializeApp(firebaseConfig);

    const messaging = getMessaging();
    
    const getDevice = async () => {
        return await getToken(messaging, { vapidKey: import.meta.env.VITE_VAPID_KEY})
    }
    return { getDevice } 
}