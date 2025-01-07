import { ReactNode } from "react";

export default function DashboardLayout({children}: {children: ReactNode}) {
  return (
  <div className="bg-accent/5 min-h-screen">
    {/* <NavBar /> */}
    <div className="container py-6">
      {children}
    </div>
  </div>
  )
}