// 'use client'

// import { useState } from 'react'
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
// import { addDoc, collection, Timestamp } from 'firebase/firestore'
// import { storage, db } from '@/lib/firebase'
// import { v4 as uuid } from 'uuid'

// export default function UploadForm() {
//   const [file, setFile] = useState<File | null>(null)
//   const [status, setStatus] = useState('')

//   const handleUpload = async () => {
//     if (!file) return
//     const id = uuid()
//     const storageRef = ref(storage, `uploads/${id}-${file.name}`)
//     setStatus('Uploading...')

//     try {
//       await uploadBytes(storageRef, file)
//       const downloadURL = await getDownloadURL(storageRef)

//       await addDoc(collection(db, 'uploads'), {
//         url: downloadURL,
//         filename: file.name,
//         uploadedAt: Timestamp.now(),
//       })

//       setStatus('Upload complete!')
//       setFile(null)
//     } catch (err) {
//       console.error(err)
//       setStatus('Upload failed.')
//     }
//   }

//   return (
//     <div className="space-y-4">
//       <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
//       <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleUpload} disabled={!file}>
//         Upload
//       </button>
//       {status && <p>{status}</p>}
//     </div>
//   )
// }

// 'use client'

// import { useState } from 'react'
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
// import { addDoc, collection, Timestamp } from 'firebase/firestore'
// import { storage, db } from '@/lib/firebase'
// import { v4 as uuid } from 'uuid'

// export default function UploadForm() {
//   const [file, setFile] = useState<File | null>(null)
//   const [status, setStatus] = useState('')
//   const [isUploading, setIsUploading] = useState(false)

//   const handleUpload = async () => {
//     if (!file) return
//     const id = uuid()
//     const storageRef = ref(storage, `uploads/${id}-${file.name}`)
//     setStatus('Uploading...')
//     setIsUploading(true)

//     try {
//       await uploadBytes(storageRef, file)
//       const downloadURL = await getDownloadURL(storageRef)

//       await addDoc(collection(db, 'uploads'), {
//         url: downloadURL,
//         filename: file.name,
//         uploadedAt: Timestamp.now(),
//       })

//       setStatus('✅ Upload complete!')
//       setFile(null)
//     } catch (err) {
//       console.error(err)
//       setStatus('❌ Upload failed.')
//     } finally {
//       setIsUploading(false)
//     }
//   }

//   return (
//     <div className="bg-white/90 backdrop-blur p-6 rounded-xl shadow-lg max-w-md mx-auto text-center space-y-4">
//       <h2 className="text-2xl font-semibold text-gray-800">Upload a Photo or Video</h2>

//       <input
//         type="file"
//         accept="image/*,video/*"
//         onChange={(e) => setFile(e.target.files?.[0] || null)}
//         className="block w-full text-sm text-gray-700
//                    file:mr-4 file:py-2 file:px-4
//                    file:rounded-full file:border-0
//                    file:text-sm file:font-semibold
//                    file:bg-blue-50 file:text-blue-700
//                    hover:file:bg-blue-100"
//       />

//       {file && (
//         <p className="text-sm text-gray-600">Selected: <span className="font-medium">{file.name}</span></p>
//       )}

//       <button
//         onClick={handleUpload}
//         disabled={!file || isUploading}
//         className={`w-full py-2 px-4 rounded text-white font-semibold transition
//           ${isUploading || !file
//             ? 'bg-blue-300 cursor-not-allowed'
//             : 'bg-blue-600 hover:bg-blue-700'
//           }`}
//       >
//         {isUploading ? 'Uploading...' : 'Upload'}
//       </button>

//       {status && (
//         <p
//           className={`text-sm font-medium ${
//             status.includes('✅') ? 'text-green-600' :
//             status.includes('❌') ? 'text-red-600' :
//             'text-gray-700'
//           }`}
//         >
//           {status}
//         </p>
//       )}
//     </div>
//   )
// }
'use client'

import { useState } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { addDoc, collection, Timestamp } from 'firebase/firestore'
import { storage, db } from '@/lib/firebase'
import { v4 as uuid } from 'uuid'

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async () => {
    if (!file) return
    const id = uuid()
    const storageRef = ref(storage, `uploads/${id}-${file.name}`)
    setStatus('Uploading...')
    setIsUploading(true)

    try {
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)

      await addDoc(collection(db, 'uploads'), {
        url: downloadURL,
        filename: file.name,
        uploadedAt: Timestamp.now(),
      })

      setStatus('✅ Upload complete!')
      setFile(null)
    } catch (err) {
      console.error(err)
      setStatus('❌ Upload failed.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="bg-white/90 backdrop-blur p-6 rounded-xl shadow-lg max-w-md mx-auto text-center space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">Upload a Photo or Video</h2>

      <input
        type="file"
        accept="image/*,video/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full text-sm text-gray-700
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100"
      />

      {file && (
        <p className="text-sm text-gray-600">Selected: <span className="font-medium">{file.name}</span></p>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className={`w-full py-2 px-4 rounded text-white font-semibold transition flex items-center justify-center
          ${isUploading || !file
            ? 'bg-blue-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
          }`}
      >
        {isUploading ? (
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Uploading...
          </div>
        ) : 'Upload'}
      </button>

      {status && (
        <p
          className={`text-sm font-medium ${
            status.includes('✅') ? 'text-green-600' :
            status.includes('❌') ? 'text-red-600' :
            'text-gray-700'
          }`}
        >
          {status}
        </p>
      )}
    </div>
  )
}