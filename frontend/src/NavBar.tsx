import { NavLink } from "react-router-dom"

export default function Navbar() {
  return (
    <nav>
      <NavLink to="/make" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Make Your Bible</NavLink>
      <NavLink to="/connect" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Connect Your AI</NavLink>
      <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>About</NavLink>
    </nav>
  )
}