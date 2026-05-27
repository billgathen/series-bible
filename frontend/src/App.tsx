import { Routes, Route } from "react-router-dom"
import './tokens.css'
import './reset.css'
import './a11y.css'
import './index.css'
import './App.css'
import Layout from "./Layout"
import GettingStarted from "./GettingStarted"
import NotFound from "./NotFound"
import LoadBooks from "./LoadBooks"
import Connect from "./Connect"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<GettingStarted />} />
        <Route path="load" element={<LoadBooks />} />
        <Route path="connect" element={<Connect />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
