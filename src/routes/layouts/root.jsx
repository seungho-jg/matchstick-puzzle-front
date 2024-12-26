import { Outlet, ScrollRestoration } from "react-router-dom"
import Header from "../../components/Header"

export default function Root() {
  return(
    <div className="bg-gray-50 dark:bg-slate-600">
      <Header />
    <main className="mx-auto px-4 py-8 pt-16">
      <Outlet />
    </main>
    <ScrollRestoration />
  </div>
  )
}