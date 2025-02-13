"use client"

import { useState } from "react"
import { db } from "@/lib/firebase"
import { doc, runTransaction } from "firebase/firestore"

export default function AddSlok() {
  const [isAdding, setIsAdding] = useState(false)

  const addSlok = async () => {
    setIsAdding(true)
    try {
      await runTransaction(db, async (transaction) => {
        const counterRef = doc(db, "Config", "counter")
        const counterDoc = await transaction.get(counterRef)

        if (!counterDoc.exists()) {
          throw "Document does not exist!"
        }

        const newTotal = (counterDoc.data().totalSlokken || 0) + 1
        transaction.update(counterRef, { totalSlokken: newTotal })
      })
    } catch (e) {
      console.error("Error adding slok: ", e)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <button
      onClick={addSlok}
      className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:bg-gray-400"
      disabled={isAdding}
    >
      {isAdding ? "Adding..." : "Ey"}
    </button>
  )
}

