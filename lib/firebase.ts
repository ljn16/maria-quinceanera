
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