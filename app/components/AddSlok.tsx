"use client"

import { useState } from "react"
import { addSlokToTotal, removeSlokFromTotal } from "../../lib/firebaseUtils"
import { toast } from "react-hot-toast"
import { Beer, BeerOff } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AddSlok() {
  const [isAdding, setIsAdding] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  const addEy = async () => {
    setIsAdding(true)
    try {
      await addSlokToTotal()
      toast.success("Ey toegevoegd")
    } catch (e) {
      console.error("Error adding ey: ", e)
      toast.error("Fout bij het toevoegen van ey")
    } finally {
      setIsAdding(false)
    }
  }

  const removeEy = async () => {
    setIsRemoving(true)
    try {
      await removeSlokFromTotal()
      toast.success("Ey verwijderd")
    } catch (e) {
      console.error("Error removing ey: ", e)
      toast.error("Fout bij het verwijderen van ey")
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full">
      <Button
        onClick={removeEy}
        className="flex-1 h-12 flex items-center justify-center btn btn-danger"
        disabled={isAdding || isRemoving}
      >
        <BeerOff className="mr-2 h-5 w-5" />
        <span className="sm:hidden">Verwijder</span>
        <span className="hidden sm:inline">{isRemoving ? "Verwijderen..." : "Ey verwijderen"}</span>
      </Button>
      <Button
        onClick={addEy}
        className="flex-1 h-12 flex items-center justify-center btn btn-success"
        disabled={isAdding || isRemoving}
      >
        <Beer className="mr-2 h-5 w-5" />
        <span className="sm:hidden">Voeg toe</span>
        <span className="hidden sm:inline">{isAdding ? "Toevoegen..." : "Ey toevoegen"}</span>
      </Button>
    </div>
  )
}

