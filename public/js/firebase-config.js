// Firebase configuration – same across all pages
const firebaseConfig = {
  apiKey: "AIzaSyAsKJHRE1kzAdlVBXhRxcZF3yXAbdHRCrc",
  authDomain: "wallpaperfeed-577a7.firebaseapp.com",
  databaseURL: "https://wallpaperfeed-577a7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wallpaperfeed-577a7",
  storageBucket: "wallpaperfeed-577a7.firebasestorage.app",
  messagingSenderId: "560156190506",
  appId: "1:560156190506:web:cbc8482e912b05805ee053",
  measurementId: "G-H8K993NRGN"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();