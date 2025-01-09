import { Outlet, ScrollRestoration } from "react-router-dom"
import Header from "../../components/Header"
import Footer from "../../components/Footer"

export default function Root() {
  return(
    <div className="bg-gray-50 dark:bg-slate-600">
      <Header />
    <main className="mx-auto px-2 py-6 pt-16">
      <Outlet />
    </main>
    <ScrollRestoration />
    <Footer />
  </div>
  )
}