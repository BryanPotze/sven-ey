"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore"
import AddUser from "./AddUser"
import { addSlokToUser, removeSlokFromUser, deleteUser } from "../../lib/firebaseUtils"
import { toast, Toaster } from "react-hot-toast"
import { CheckCircle, XCircle, PlusCircle, MinusCircle, Trash2 } from "lucide-react"
import CountingNumber from "./CountingNumber"
import WavyBeerFill from "./WavyBeerFill"
import { Button } from "@/components/ui/button"
import DrinkIcon from "./DrinkIcon"

interface User {
  id: string
  name: string
  totalSlokken: number
  drinkType?: string
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [totalEys, setTotalEys] = useState(0)

  useEffect(() => {
    const unsubscribeUsers = onSnapshot(collection(db, "Config", "users", "users"), (snapshot) => {
      const updatedUsers = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as User,
      )
      setUsers(updatedUsers)
    })

    const unsubscribeTotal = onSnapshot(doc(db, "Config", "counter"), (doc) => {
      if (doc.exists()) {
        setTotalEys(doc.data().totalSlokken || 0)
      }
    })

    return () => {
      unsubscribeUsers()
      unsubscribeTotal()
    }
  }, [])

  const handleAddSlokToUser = async (userId: string) => {
    try {
      await addSlokToUser(userId)
      toast.success("Slok toegevoegd aan gebruiker")
    } catch (err) {
      console.error("Error adding slok to user:", err)
      toast.error("Kan niet meer slokken toevoegen dan het totaal")
    }
  }

  const handleRemoveSlokFromUser = async (userId: string) => {
    try {
      await removeSlokFromUser(userId)
      toast.success("Slok verwijderd van gebruiker")
    } catch (err) {
      console.error("Error removing slok from user:", err)
      toast.error("Kan geen slokken verwijderen als de gebruiker er geen heeft")
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId)
      toast.success("Gebruiker verwijderd")
    } catch (err) {
      console.error("Error deleting user:", err)
      toast.error("Fout bij het verwijderen van de gebruiker")
    }
  }

  const handleChangeDrinkType = async (userId: string, newDrinkType: string) => {
    try {
      await updateDoc(doc(db, "Config", "users", "users", userId), {
        drinkType: newDrinkType,
      })
      toast.success("Drankje gewijzigd")
    } catch (err) {
      console.error("Error changing drink type:", err)
      toast.error("Fout bij het wijzigen van het drankje")
    }
  }

  const getStatusColor = (userSlokken: number) => {
    return userSlokken >= totalEys ? "text-green-500" : "text-red-500"
  }

  const getStatusIcon = (userSlokken: number) => {
    return userSlokken >= totalEys ? (
      <CheckCircle className="inline-block ml-2 text-green-500" />
    ) : (
      <XCircle className="inline-block ml-2 text-red-500" />
    )
  }

  const getProgressBarWidth = (userSlokken: number) => {
    const percentage = (userSlokken / totalEys) * 100
    return `${Math.min(percentage, 100)}%`
  }

  const getWaveColor = (drinkType: string | undefined) => {
    switch (drinkType?.toLowerCase()) {
      case "beer":
        return "rgba(251, 191, 36, 0.9)"
      case "jägermeister":
        return "rgba(45, 25, 15, 0.9)"
      case "malibu":
        return "rgba(255, 235, 238, 0.9)"
      case "berenburg":
        return "rgba(121, 85, 72, 0.9)"
      default:
        return "rgba(158, 158, 158, 0.9)"
    }
  }

  return (
    <div className="w-full animate-slideIn">
      <Toaster position="top-center" />
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">Gebruikers</h2>
      <ul className="space-y-4">
        {users.map((user) => (
          <li key={user.id} className="card hover:shadow-lg transition-shadow duration-300 overflow-hidden bg-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 relative z-10 p-3 sm:p-4">
              <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                <DrinkIcon
                  drinkType={user.drinkType}
                  className={getStatusColor(user.totalSlokken)}
                  onSelect={(type) => handleChangeDrinkType(user.id, type)}
                />
                <span className={`text-base sm:text-lg font-semibold ${getStatusColor(user.totalSlokken)}`}>
                  {user.name}: <CountingNumber value={user.totalSlokken} duration={1500} />
                  <span className="hidden sm:inline"> slokken genomen</span>
                </span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                {getStatusIcon(user.totalSlokken)}
                <Button
                  onClick={() => handleRemoveSlokFromUser(user.id)}
                  className="text-red-500 hover:text-white hover:bg-red-500 transition-all duration-300 transform hover:scale-110"
                  variant="ghost"
                  size="sm"
                >
                  <MinusCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button
                  onClick={() => handleAddSlokToUser(user.id)}
                  className="text-green-500 hover:text-white hover:bg-green-500 transition-all duration-300 transform hover:scale-110"
                  variant="ghost"
                  size="sm"
                >
                  <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button
                  onClick={() => handleDeleteUser(user.id)}
                  className="text-gray-500 hover:text-white hover:bg-gray-500 transition-all duration-300 transform hover:scale-110"
                  variant="ghost"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-4 sm:h-6 w-full glass-background overflow-hidden">
              <WavyBeerFill width={getProgressBarWidth(user.totalSlokken)} waveColor={getWaveColor(user.drinkType)} />
            </div>
          </li>
        ))}
      </ul>
      <AddUser />
    </div>
  )
}

