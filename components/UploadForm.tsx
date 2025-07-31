'use client'

import { useState } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { addDoc, collection, Timestamp } from 'firebase/firestore'
import { storage, db } from '@/lib/firebase'
import { v4 as uuid } from 'uuid'

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState('')

  const handleUpload = async () => {
    if (!file) return
    const id = uuid()
    const storageRef = ref(storage, `uploads/${id}-${file.name}`)
    setStatus('Uploading...')

    try {
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)

      await addDoc(collection(db, 'uploads'), {
        url: downloadURL,
        filename: file.name,
        uploadedAt: Timestamp.now(),
      })

      setStatus('Upload complete!')
      setFile(null)
    } catch (err) {
      console.error(err)
      setStatus('Upload failed.')
    }
  }

  return (
    <div className="space-y-4">
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload} disabled={!file}>
        Upload
      </button>
      {status && <p>{status}</p>}
    </div>
  )
}