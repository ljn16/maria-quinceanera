
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
      <div className="w-full h-1 bg-white/10 mt-4 rounded overflow-hidden">
        <div
          className="h-full bg-white/30 transition-all duration-100"
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