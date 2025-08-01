
// "use client";

// import QRCode from "react-qr-code";

// export default function QRCodePage() {
//   const uploadUrl = "https://maria-quinceanera.vercel.app/upload";

//   return (
//     <div className="min-h-screen flex items-center justify-center p-6">
//       <div className="bg-[#f0e0c6] p-4 rounded shadow">
//         <p className="mb-4 text-center font-medium">Scan to Upload Media</p>
//         <QRCode 
//           value={uploadUrl} 
//           bgColor="#f0e0c6"   // light brown
//           fgColor="#000000"  // black QR code
//         />
//       </div>
//     </div>
//   );
// }
// 'use client'

// import QRCode from 'react-qr-code'

// export default function QRCodePage() {
//   const uploadUrl = 'https://maria-quinceanera.vercel.app/upload'

//   return (
//     <div
//       className="min-h-screen bg-cover bg-center flex items-center justify-center p-6"
//       style={{ backgroundImage: "url('/floral background.jpg')" }}
//     >
//       <div className="bg-[#f0e0c6]/90 backdrop-blur-sm p-6 rounded-xl shadow-lg text-center max-w-sm">
//         <p className="mb-4 font-bold text-black text-lg">Scan to Add Pictures or Videos to Maria&apos;s Slideshow!</p>
//         <QRCode
//           value={uploadUrl}
//           bgColor="#f0e0c6"
//           fgColor="#000000"
//           size={256}
//         />
//       </div>
//     </div>
//   )
// }

'use client'

import QRCode from 'react-qr-code'

export default function QRCodePage() {
  const uploadUrl = 'https://maria-quinceanera.vercel.app/upload'

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-6"
      style={{ backgroundImage: "url('/floral background.jpg')" }}
    >
      <div className="bg-[#f0e0c6]/90 backdrop-blur-sm p-6 rounded-xl shadow-lg text-center max-w-sm">
        <p className="mb-4 font-bold text-black text-lg">
          Scan to Add Pictures or Videos to Maria&apos;s Slideshow!
        </p>
        <div className="flex justify-center">
          <QRCode
            value={uploadUrl}
            bgColor="#f0e0c6"
            fgColor="#000000"
            size={256}
          />
        </div>
      </div>
    </div>
  )
}