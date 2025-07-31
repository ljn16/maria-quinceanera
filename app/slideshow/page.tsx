'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '@/lib/firebase'

type Media = {
  id: string
  url: string
  filename: string
}

export default function SlideshowPage() {
  const [mediaList, setMediaList] = useState<Media[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  // Listen to Firestore in real-time
  useEffect(() => {
    const q = query(collection(db, 'uploads'), orderBy('uploadedAt', 'asc'))
    const unsub = onSnapshot(q, (snapshot) => {
      const files: Media[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        url: doc.data().url,
        filename: doc.data().filename,
      }))
      setMediaList(files)
    })
    return () => unsub()
  }, [])

  // Cycle through media every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mediaList.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [mediaList])

  const currentMedia = mediaList[currentIndex]

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      {currentMedia ? (
        currentMedia.filename.match(/\.(mp4|mov)$/i) ? (
          <video
            src={currentMedia.url}
            controls
            autoPlay
            muted
            loop
            className="max-h-screen max-w-screen"
          />
        ) : (
          <img
            src={currentMedia.url}
            alt="Uploaded media"
            className="max-h-screen max-w-screen object-contain"
          />
        )
      ) : (
        <p className="text-white">Waiting for uploads...</p>
      )}
    </div>
  )
}