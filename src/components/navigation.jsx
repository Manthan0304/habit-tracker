import { Link, useLocation } from "react-router-dom"
import { BarChart3, Home } from "lucide-react"
import "@/styles/globals.css"

export default function Navigation() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav style={{
      backgroundColor: "var(--card)",
      borderBottom: "1px solid var(--border)",
      padding: "0 24px",
      height: "64px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    }}>
      <div style={{
        fontSize: "24px",
        fontWeight: "bold",
        color: "var(--primary)",
      }}>
        📊 Habit Tracker
      </div>

      <div style={{
        display: "flex",
        gap: "8px",
      }}>
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "8px",
            textDecoration: "none",
            color: isActive("/") ? "var(--primary)" : "var(--foreground)",
            backgroundColor: isActive("/") ? "rgba(99, 102, 241, 0.1)" : "transparent",
            fontWeight: isActive("/") ? "600" : "500",
            transition: "all 0.2s",
            border: "1px solid transparent",
            borderColor: isActive("/") ? "var(--primary)" : "transparent",
          }}
        >
          <Home size={20} />
          Home
        </Link>

        <Link
          to="/statistics"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "8px",
            textDecoration: "none",
            color: isActive("/statistics") ? "var(--primary)" : "var(--foreground)",
            backgroundColor: isActive("/statistics") ? "rgba(99, 102, 241, 0.1)" : "transparent",
            fontWeight: isActive("/statistics") ? "600" : "500",
            transition: "all 0.2s",
            border: "1px solid transparent",
            borderColor: isActive("/statistics") ? "var(--primary)" : "transparent",
          }}
        >
          <BarChart3 size={20} />
          Statistics
        </Link>
      </div>
    </nav>
  )
}
