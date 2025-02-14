"use client"

import { useState, useEffect } from "react"
import { db } from "../../lib/firebase"
import { doc, onSnapshot } from "firebase/firestore"
import CountingNumber from "./CountingNumber"
import { Beer } from "lucide-react"

export default function TotalSlokken() {
  const [totalEys, setTotalEys] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "Config", "counter"), (doc) => {
      if (doc.exists()) {
        setTotalEys(doc.data().totalSlokken || 0)
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return <div className="text-3xl sm:text-4xl font-bold mb-8 text-center animate-pulse">Loading...</div>
  }

  return (
    <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center animate-fadeIn flex items-center justify-center">
      <Beer className="text-amber-500 h-6 w-6 sm:h-8 sm:w-8 mr-2" />
      <span className="hidden sm:inline">Totaal</span> ey&apos;s: <CountingNumber value={totalEys} duration={1500} />
    </div>
  )
}

