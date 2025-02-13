"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, onSnapshot } from "firebase/firestore"
import AddUser from "./AddUser"
import { addSlokToUser, deleteUser } from "../../lib/firebaseUtils"
import { toast, Toaster } from "react-hot-toast"

interface User {
  id: string
  name: string
  totalSlokken: number
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Config", "users", "users"), (snapshot) => {
      const updatedUsers = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as User,
      )
      setUsers(updatedUsers)
    })

    return () => unsubscribe()
  }, [])

  const handleAddSlokToUser = async (userId: string) => {
    try {
      await addSlokToUser(userId)
      toast.success("Slok toegevoegd aan gebruiker")
    } catch (error) {
      toast.error("Kan niet meer slokken toevoegen dan het totaal")
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId)
      toast.success("Gebruiker verwijderd")
    } catch (error) {
      toast.error("Fout bij het verwijderen van de gebruiker")
    }
  }

  return (
    <div className="w-full max-w-md">
      <Toaster position="top-right" />
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Gebruikers</h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/10 backdrop-blur-sm p-3 rounded"
          >
            <span className="mb-2 sm:mb-0">
              {user.name}: {user.totalSlokken} slokken genomen
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleAddSlokToUser(user.id)}
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                +
              </button>
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                X
              </button>
            </div>
          </li>
        ))}
      </ul>
      <AddUser />
    </div>
  )
}

