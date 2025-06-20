"use client"

import { useState } from "react"
import { addUser } from "../../lib/firebaseUtils"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"

export default function AddUser() {
  const [name, setName] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (name) {
      try {
        await addUser(name, "beer")
        setName("")
        toast.success("Gebruiker toegevoegd")
      } catch (err) {
        console.error("Error adding user:", err)
        toast.error("Fout bij het toevoegen van gebruiker")
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-2 sm:gap-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Gebruikersnaam"
        className="flex-grow px-4 py-3 rounded-lg text-black text-base sm:text-lg h-10 sm:h-12 bg-green-100"
      />
      <Button type="submit" className="btn btn-success h-10 sm:h-12 bg-green-500 hover:bg-green-600 text-white">
        <span className="sm:hidden">Toevoegen</span>
        <span className="hidden sm:inline">Voeg Gebruiker Toe</span>
      </Button>
    </form>
  )
}

