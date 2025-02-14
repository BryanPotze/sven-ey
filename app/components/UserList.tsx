"use client"

import { useState, useEffect, useCallback } from "react"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore"
import AddUser from "./AddUser"
import { addSlokToUser, removeSlokFromUser, deleteUser } from "../../lib/firebaseUtils"
import { toast, Toaster } from "react-hot-toast"
import { PlusCircle, MinusCircle, Trash2 } from "lucide-react"
import CountingNumber from "./CountingNumber"
import WavyBeerFill from "./WavyBeerFill"
import { Button } from "@/components/ui/button"
import DrinkIcon from "./DrinkIcon"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface User {
  id: string
  name: string
  totalSlokken: number
  drinkType?: string
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [totalEys, setTotalEys] = useState(0)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [slokCounter, setSlokCounter] = useState<{ [key: string]: number }>({})

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

  const showGroupedToast = useCallback(
    (userId: string) => {
      const newCounter = { ...slokCounter, [userId]: (slokCounter[userId] || 0) + 1 }
      setSlokCounter(newCounter)

      // Reset the counter after a delay
      setTimeout(() => {
        setSlokCounter((prev) => ({ ...prev, [userId]: 0 }))
      }, 2000)
    },
    [slokCounter],
  )

  const handleAddSlokToUser = async (userId: string) => {
    try {
      await addSlokToUser(userId)
      showGroupedToast(userId)
    } catch (err) {
      console.error("Error adding slok to user:", err)
      toast.error("Kan niet meer slokken toevoegen dan het totaal")
    }
  }

  const handleRemoveSlokFromUser = async (userId: string) => {
    try {
      await removeSlokFromUser(userId)
      showGroupedToast(userId)
    } catch (err) {
      console.error("Error removing slok from user:", err)
      toast.error("Kan geen slokken verwijderen als de gebruiker er geen heeft")
    }
  }

  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete)
        toast.success("Gebruiker verwijderd")
        setUserToDelete(null)
      } catch (err) {
        console.error("Error deleting user:", err)
        toast.error("Fout bij het verwijderen van de gebruiker")
      }
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
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">Gebruikers</h2>
      <ul className="space-y-4">
        {users.map((user) => (
          <li key={user.id} className="card hover:shadow-lg transition-shadow duration-300 overflow-hidden bg-white">
            <div className="flex items-center gap-2 relative z-10 p-2 pb-8">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <DrinkIcon
                  drinkType={user.drinkType}
                  className={getStatusColor(user.totalSlokken)}
                  onSelect={(type) => handleChangeDrinkType(user.id, type)}
                />
                <span className={`text-base sm:text-lg font-semibold ${getStatusColor(user.totalSlokken)} truncate`}>
                  {user.name}: <CountingNumber value={user.totalSlokken} duration={500} />{" "}
                  <span className="hidden sm:inline">slokken</span>
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                <Button
                  onClick={() => handleRemoveSlokFromUser(user.id)}
                  className="text-red-500 hover:text-red-600 transition-transform duration-200 transform hover:scale-125 p-1"
                >
                  <MinusCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button
                  onClick={() => handleAddSlokToUser(user.id)}
                  className="text-green-500 hover:text-green-600 transition-transform duration-200 transform hover:scale-125 p-1"
                >
                  <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      onClick={() => setUserToDelete(user.id)}
                      className="text-gray-500 hover:text-gray-600 transition-transform duration-200 transform hover:scale-125 p-1"
                    >
                      <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Weet je zeker dat je deze gebruiker wilt verwijderen?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Deze actie kan niet ongedaan worden gemaakt. Alle gegevens van deze gebruiker zullen permanent
                        worden verwijderd.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setUserToDelete(null)}>Annuleren</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteUser}>Ja, verwijder gebruiker</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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

