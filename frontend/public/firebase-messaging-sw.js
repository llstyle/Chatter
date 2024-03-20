importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

  
firebase.initializeApp(
    {
        apiKey: "AIzaSyBVpu_JC_jXlTuu_y7WGgzJZII9oIX8mlM",
        authDomain: "chatter-2a668.firebaseapp.com",
        projectId: "chatter-2a668",
        storageBucket: "chatter-2a668.appspot.com",
        messagingSenderId: "987685550572",
        appId: "1:987685550572:web:7033f5aa927dc9d0f028c9"
    }
);

const messaging = firebase.messaging();
