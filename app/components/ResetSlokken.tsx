"use client"

import { useState } from "react"
import { resetAllSlokken } from "../../lib/firebaseUtils"
import { toast } from "react-hot-toast"
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
import { Button } from "@/components/ui/button"

export default function ResetSlokken() {
  const [isResetting, setIsResetting] = useState(false)

  const handleReset = async () => {
    setIsResetting(true)
    try {
      await resetAllSlokken()
      toast.success("Alle ey's en slokken gereset")
    } catch (error) {
      console.error("Error resetting ey's and slokken:", error)
      toast.error("Fout bij het resetten van ey's en slokken")
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" className="w-full h-12 btn btn-secondary">
          Ey reset
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Weet je zeker dat je de ey's wil resetten?</AlertDialogTitle>
          <AlertDialogDescription>
            Deze actie kan niet ongedaan worden gemaakt. Alle ey's en slokken zullen worden gereset naar 0.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuleren</AlertDialogCancel>
          <AlertDialogAction onClick={handleReset} disabled={isResetting}>
            {isResetting ? "Resetting..." : "Ja, reset alles"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

