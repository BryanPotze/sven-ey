"use client"

import { useState } from "react"
import { addUser } from "@/lib/firebaseUtils"

export default function AddUser() {
  const [name, setName] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (name) {
      await addUser(name)
      setName("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Gebruikersnaam"
        className="flex-grow px-4 py-2 border rounded text-black"
      />
      <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
        Voeg Gebruiker Toe
      </button>
    </form>
  )
}

