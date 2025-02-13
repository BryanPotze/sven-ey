"use client"

import { useState } from "react"
import { resetAllSlokken } from "@/lib/firebaseUtils"

export default function ResetSlokken() {
  const [isResetting, setIsResetting] = useState(false)

  const handleReset = async () => {
    setIsResetting(true)
    try {
      await resetAllSlokken()
    } catch (error) {
      console.error("Error resetting slokken:", error)
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <button
      onClick={handleReset}
      className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:bg-gray-400"
      disabled={isResetting}
    >
      {isResetting ? "Resetting..." : "Ey reset"}
    </button>
  )
}

