import { Routes, Route } from "react-router-dom"
import './tokens.css'
import './reset.css'
import './a11y.css'
import './index.css'
import './App.css'
import Layout from "./Layout"
import About from "./About"
import NotFound from "./NotFound"
import MakeBible from "./MakeBible"
import Connect from "./Connect"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<About />} />
        <Route path="make" element={<MakeBible />} />
        <Route path="connect" element={<Connect />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
