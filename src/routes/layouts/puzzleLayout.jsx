import { Outlet, ScrollRestoration } from "react-router-dom"

export default function Root() {
  return(
    <div>
      <main className="mx-auto px-4 py-8 pt-1">
        <Outlet />
      </main>
      <ScrollRestoration />
    </div>
  )
}