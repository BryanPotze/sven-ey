"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { doc, onSnapshot } from "firebase/firestore"

export default function TotalSlokken() {
  const [totalSlokken, setTotalSlokken] = useState(0)

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "Config", "counter"), (doc) => {
      if (doc.exists()) {
        setTotalSlokken(doc.data().totalSlokken || 0)
      }
    })

    return () => unsubscribe()
  }, [])

  return <div className="text-2xl sm:text-3xl font-bold mb-6 text-center">Hoeveelheid ey's: {totalSlokken}</div>
}

