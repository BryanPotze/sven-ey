import TotalSlokken from "./components/TotalSlokken"
import AddSlok from "./components/AddSlok"
import UserList from "./components/UserList"
import ResetSlokken from "./components/ResetSlokken"
import { Toaster } from "react-hot-toast"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center text-white max-w-lg mx-auto">
      <Toaster position="top-right" />
      <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-center animate-fadeIn">Tiebo ey counter</h1>
      <TotalSlokken />
      <div className="flex flex-col space-y-4 mb-8 w-full animate-slideIn">
        <AddSlok />
        <ResetSlokken />
      </div>
      <UserList />
    </main>
  )
}

