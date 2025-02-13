import type React from "react"
import Image from "next/image"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface DrinkIconProps {
  drinkType?: string
  className?: string
  onSelect?: (type: string) => void
}

const DrinkIcon: React.FC<DrinkIconProps> = ({ drinkType, className, onSelect }) => {
  const getIconUrl = (type: string) => {
    switch (type.toLowerCase()) {
      case "beer":
        return "https://cdn-icons-png.flaticon.com/512/931/931949.png"
      case "jägermeister":
        return "https://cdn-icons-png.flaticon.com/512/15466/15466478.png"
      case "malibu":
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL_E_2025-02-13_20.30.34_-_A_simple__flat-style_vector_icon_of_a_Malibu_rum_bottle__similar_to_the_J%C3%A4germeister_bottle_icon_from_Flaticon._The_bottle_should_have_a_white_body_wi-removebg-preview%20(1)-yLkQwgKZTy3ZteWkHlnXILU0E7ejp1.png"
      case "berenburg":
        return "https://cdn-icons-png.flaticon.com/512/920/920592.png"
      default:
        return "https://cdn-icons-png.flaticon.com/512/920/920539.png"
    }
  }

  const drinkTypes = [
    { value: "beer", label: "Beer" },
    { value: "jägermeister", label: "Jägermeister" },
    { value: "malibu", label: "Malibu" },
    { value: "berenburg", label: "Berenburg" },
    { value: "other", label: "Other" },
  ]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className={`p-0 h-auto hover:bg-transparent ${className}`}>
          <div className="w-8 h-8 relative">
            <Image
              src={getIconUrl(drinkType || "other")}
              alt={drinkType || "Other drink"}
              fill
              className="object-contain"
            />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <div className="grid gap-2">
          {drinkTypes.map((type) => (
            <Button
              key={type.value}
              variant="ghost"
              className="w-full justify-start font-normal text-green-100 hover:bg-green-500/20 hover:text-white transition-colors"
              onClick={() => onSelect?.(type.value)}
            >
              <div className="w-6 h-6 relative mr-2">
                <Image
                  src={getIconUrl(type.value) || "/placeholder.svg"}
                  alt={type.label}
                  fill
                  className="object-contain"
                />
              </div>
              {type.label}
              {drinkType?.toLowerCase() === type.value && <Check className="w-4 h-4 ml-auto text-green-500" />}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default DrinkIcon

