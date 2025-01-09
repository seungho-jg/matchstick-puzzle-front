import { Outlet, ScrollRestoration } from "react-router-dom"

export default function Root() {
  return(
    <div>
      <main className="mx-auto py-8 pt-1">
        <Outlet />
      </main>
      <ScrollRestoration />
    </div>
  )
}