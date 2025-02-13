import TotalSlokken from "./components/TotalSlokken"
import AddSlok from "./components/AddSlok"
import UserList from "./components/UserList"
import ResetSlokken from "./components/ResetSlokken"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-4 text-white max-w-md">
      <h1 className="text-2xl font-bold mb-2">Tiebo ey counter</h1>
      <TotalSlokken />
      <div className="flex flex-col space-y-2 mb-4">
        <AddSlok />
        <ResetSlokken />
      </div>
      <UserList />
    </main>
  )
}

