import { Outlet } from "react-router-dom"
import Header from "../../components/Header"

export default function AuthLayout() {
  return(
    <main className="container mx-auto px-4 py-8">
      <Outlet />
    </main>
  )
}