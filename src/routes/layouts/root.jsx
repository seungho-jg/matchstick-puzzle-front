import { Outlet, ScrollRestoration } from "react-router-dom"
import Header from "../../components/Header"

export default function Root() {
  return(
    <div className="min-h-screen bg-gray-50 dark:bg-slate-600">
    <Header />
    <main className="container mx-auto px-4 py-8 pt-10">
      <Outlet />
    </main>
    <ScrollRestoration />
  </div>
  )
}