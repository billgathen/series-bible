import { NavLink } from "react-router-dom"

export default function Navbar() {
  return (
    <nav>
      <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Getting Started</NavLink>
      <NavLink to="/load" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Load Books</NavLink>
      <NavLink to="/connect" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Connect Your AI</NavLink>
    </nav>
  )
}