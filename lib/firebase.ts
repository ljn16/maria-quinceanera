// import { initializeApp } from 'firebase/app'
// import { getStorage } from 'firebase/storage'
// import { getFirestore } from 'firebase/firestore'

// const firebaseConfig = {
//   apiKey: 'YOUR_KEY',
//   authDomain: 'YOUR_DOMAIN',
//   projectId: 'YOUR_ID',
//   storageBucket: 'YOUR_BUCKET',
//   messagingSenderId: 'YOUR_SENDER_ID',
//   appId: 'YOUR_APP_ID',
// }

// const app = initializeApp(firebaseConfig)

// export const storage = getStorage(app)
// export const db = getFirestore(app)
// lib/firebase.ts

// import { initializeApp, getApps, getApp } from 'firebase/app'
// import { getFirestore } from 'firebase/firestore'
// import { getStorage } from 'firebase/storage'

// // Your Firebase config
// const firebaseConfig = {
//   apiKey: "AIzaSyBzxj-9sYoJ6IZbKnwtCOiINzN7GHU7o0I",
//   authDomain: "maria-quinceanera.firebaseapp.com",
//   projectId: "maria-quinceanera",
//   storageBucket: "maria-quinceanera.appspot.com", // ← fix: should be `appspot.com`
//   messagingSenderId: "518335467341",
//   appId: "1:518335467341:web:1de462f0d3434dc13ab104",
// }

// // Only initialize once (for Next.js hot reload)
// const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

// export const db = getFirestore(app)
// export const storage = getStorage(app)
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBzxj-9sYoJ6IZbKnwtCOiINzN7GHU7o0I',
  authDomain: 'maria-quinceanera.firebaseapp.com',
  projectId: 'maria-quinceanera',
  storageBucket: 'maria-quinceanera.firebasestorage.app', // ✅ important fix
  messagingSenderId: '518335467341',
  appId: '1:518335467341:web:1de462f0d3434dc13ab104',
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const storage = getStorage(app) // ✅ will now use correct bucket