import TotalSlokken from "./components/TotalSlokken"
import AddSlok from "./components/AddSlok"
import UserList from "./components/UserList"
import ResetSlokken from "./components/ResetSlokken"
import { Toaster } from "react-hot-toast"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center text-white w-full max-w-lg mx-auto px-4 sm:px-6">
      <Toaster position="top-right" />
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold my-6 text-center animate-fadeIn">Tiebo ey counter</h1>
      <TotalSlokken />
      <div className="flex flex-col space-y-4 mb-6 w-full animate-slideIn">
        <AddSlok />
        <ResetSlokken />
      </div>
      <UserList />
    </main>
  )
}

