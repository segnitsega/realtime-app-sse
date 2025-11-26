interface SidebarProps {
  currentView: string
  onViewChange: (view: "admin" | "user") => void
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-sidebar border-r border-border h-screen flex flex-col p-6 sticky top-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-sidebar-primary flex items-center gap-2">
          <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
            ⚽
          </span>
          FootMatch
        </h1>
        <p className="text-sm text-sidebar-foreground/60 mt-1">Match Management System</p>
      </div>

      <nav className="space-y-2 flex-1">
        <button
          onClick={() => onViewChange("admin")}
          className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
            currentView === "admin"
              ? "bg-primary text-primary-foreground"
              : "text-sidebar-foreground hover:bg-secondary"
          }`}
        >
          📊 Admin Dashboard
        </button>
        <button
          onClick={() => onViewChange("user")}
          className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
            currentView === "user" ? "bg-primary text-primary-foreground" : "text-sidebar-foreground hover:bg-secondary"
          }`}
        >
          👁️ User Viewer
        </button>
      </nav>

      <div className="pt-4 border-t border-border">
        <p className="text-xs text-sidebar-foreground/50">© 2025 FootMatch</p>
      </div>
    </aside>
  )
}
