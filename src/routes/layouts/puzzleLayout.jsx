import { Outlet } from "react-router-dom"
import Header from "../../components/Header"

export default function PuzzleLayout() {
  return(
    <div className="fixed inset-0 bg-gray-50 dark:bg-slate-600">
      <Header />
      <main className="mx-auto px-2 py-6 pt-16 h-[calc(100vh-4rem)]">
        <Outlet />
      </main>
    </div>
  )
}