// 'use client'

// import { useEffect, useState } from 'react'
// import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
// import { db } from '@/lib/firebase'

// type Media = {
//   id: string
//   url: string
//   filename: string
// }

// export default function SlideshowPage() {
//   const [mediaList, setMediaList] = useState<Media[]>([])
//   const [currentIndex, setCurrentIndex] = useState(0)

//   // Listen to Firestore in real-time
//   useEffect(() => {
//     const q = query(collection(db, 'uploads'), orderBy('uploadedAt', 'asc'))
//     const unsub = onSnapshot(q, (snapshot) => {
//       const files: Media[] = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         url: doc.data().url,
//         filename: doc.data().filename,
//       }))
//       setMediaList(files)
//     })
//     return () => unsub()
//   }, [])

//   // Cycle through media every 5 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % mediaList.length)
//     }, 5000)

//     return () => clearInterval(interval)
//   }, [mediaList])

//   const currentMedia = mediaList[currentIndex]

//   return (
//     <div className="min-h-screen bg-black flex items-center justify-center">
//       {currentMedia ? (
//         currentMedia.filename.match(/\.(mp4|mov)$/i) ? (
//           <video
//             src={currentMedia.url}
//             controls
//             autoPlay
//             muted
//             loop
//             className="max-h-screen max-w-screen"
//           />
//         ) : (
//           <img
//             src={currentMedia.url}
//             alt="Uploaded media"
//             className="max-h-screen max-w-screen object-contain"
//           />
//         )
//       ) : (
//         <p className="text-white">Waiting for uploads...</p>
//       )}
//     </div>
//   )
// }
'use client'

import { useEffect, useRef, useState } from 'react'
import { db } from '@/lib/firebase'
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore'

type Media = {
  id: string
  url: string
  filename: string
  uploadedAt: Timestamp
}

export default function SlideshowPage() {
  const [mediaList, setMediaList] = useState<Media[]>([])
  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const rotationInterval = 8000 // ms

  const current = mediaList[index]

  // 🔄 Real-time Firestore sync
  useEffect(() => {
    const q = query(collection(db, 'uploads'), orderBy('uploadedAt', 'asc'))
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Media[]
      setMediaList(items)
    })
    return () => unsub()
  }, [])

  // 🔁 Progress + rotate timer
  useEffect(() => {
    if (isPaused || mediaList.length === 0) return

    let step = 0
    setProgress(0)

    intervalRef.current = setInterval(() => {
      step += 100
      setProgress((step / rotationInterval) * 100)

      if (step >= rotationInterval) {
        step = 0
        setIndex((i) => (i + 1) % mediaList.length)
        setProgress(0)
      }
    }, 100)

    return () => clearInterval(intervalRef.current as NodeJS.Timeout)
  }, [index, isPaused, mediaList])

  const handleSkip = () => {
    setIndex((i) => (i + 1) % mediaList.length)
    setProgress(0)
  }

  const togglePause = () => {
    setIsPaused((p) => !p)
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="w-full flex-1 flex items-center justify-center">
        {current ? (
          current.filename.match(/\.(mp4|mov)$/i) ? (
            <video
              key={current.id}
              src={current.url}
              autoPlay
              muted
              className="max-h-screen max-w-full"
            />
          ) : (
            <img
              src={current.url}
              alt="Uploaded"
              className="max-h-screen max-w-full object-contain"
            />
          )
        ) : (
          <p className="text-white text-lg">Waiting for uploads…</p>
        )}
      </div>

      {/* ⏱ Progress bar */}
      <div className="w-full h-2 bg-gray-800 mt-4">
        <div
          className="h-full bg-blue-500 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 🎛 Admin controls */}
      <div className="flex gap-4 mt-4 mb-6">
        <button
          onClick={togglePause}
          className="bg-white px-4 py-2 rounded font-medium"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button
          onClick={handleSkip}
          className="bg-white px-4 py-2 rounded font-medium"
        >
          Skip
        </button>
      </div>
    </div>
  )
}