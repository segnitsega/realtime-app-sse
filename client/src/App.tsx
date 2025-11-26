import { useState } from "react"
import Sidebar from "./components/sidebar"
import AdminDashboard from "./components/admin/admin-dashboard"
import UserViewer from "./components/user/user-viewer"

type View = "admin" | "user"

export default function Page() {
  const [currentView, setCurrentView] = useState<View>("admin")

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 overflow-auto">{currentView === "admin" ? <AdminDashboard /> : <UserViewer />}</main>
    </div>
  )
}
