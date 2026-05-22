import { Outlet } from "react-router-dom"
import Navbar from "./NavBar"

export default function Layout() {
  return (
    <>
      <header>
        <h1>📚 Series Bible 📚</h1>
        <Navbar />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}