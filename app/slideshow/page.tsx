'use client'

import { useEffect, useRef, useState } from 'react'
import { db } from '@/lib/firebase'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore'
import { getStorage, ref as storageRef, getMetadata } from 'firebase/storage'

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
  const [isFullscreen, setIsFullscreen] = useState(false)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const rotationInterval = 8000 // ms
  const slideshowContainerRef = useRef<HTMLDivElement | null>(null)

  const current = mediaList[index]

  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  // 🔄 Real-time Firestore sync with cleanup for deleted files
  useEffect(() => {
    const storage = getStorage()
    const q = query(collection(db, 'uploads'), orderBy('uploadedAt', 'asc'))
    const unsub = onSnapshot(q, async (snap) => {
      const items: Media[] = []
      for (const docSnap of snap.docs) {
        const data = docSnap.data() as Media
        if (data.url && data.url.startsWith('http')) {
          try {
            // Check if file exists in storage
            const path = decodeURIComponent(
              data.url.split('/o/')[1].split('?')[0]
            )
            const fileRef = storageRef(storage, path)
            await getMetadata(fileRef) // Will throw if missing
            items.push({ ...data, id: docSnap.id })
          } catch {
            console.warn(`Removing missing file entry: ${docSnap.id}`)
            await deleteDoc(doc(db, 'uploads', docSnap.id))
          }
        }
      }
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

  const toggleFullScreen = () => {
    if (!document.fullscreenElement && slideshowContainerRef.current) {
      slideshowContainerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen mode: ${err.message}`)
      })
    } else {
      document.exitFullscreen().catch((err) => {
        console.error(`Error attempting to exit fullscreen mode: ${err.message}`)
      })
    }
  }

  return (
    <div
      ref={slideshowContainerRef}
      className="min-h-screen bg-black flex flex-col items-center justify-center"
    >
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

      {!isFullscreen && (
        <>
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
            <button
              onClick={toggleFullScreen}
              className="bg-white px-4 py-2 rounded font-medium"
            >
              Fullscreen
            </button>
          </div>
        </>
      )}
    </div>
  )
}