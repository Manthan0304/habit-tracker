import { useState, useEffect } from "react"
import axios from "axios"
import HabitList from "@/components/habit-list"
import HabitForm from "@/components/habit-form"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

export default function Home() {
  const [habits, setHabits] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchHabits()
  }, [])

  const fetchHabits = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/api/habits`)
      setHabits(response.data)
      setError("")
    } catch (err) {
      console.error("Error fetching habits:", err)
      setError("Failed to load habits. Make sure the backend is running on http://localhost:5000")
    } finally {
      setLoading(false)
    }
  }

  const handleAddHabit = async (habitData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/habits`, habitData)
      setHabits([...habits, response.data])
      setShowForm(false)
      setError("")
    } catch (err) {
      console.error("Error creating habit:", err)
      setError("Failed to create habit")
    }
  }

  const handleCheckIn = async (habitId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/habits/${habitId}/check-in`)
      setHabits(habits.map((h) => (h.id === habitId ? response.data : h)))
      setError("")
    } catch (err) {
      console.error("Error checking in:", err)
      setError("Failed to check in")
    }
  }

  const handleUndoCheckIn = async (habitId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/habits/${habitId}/undo-check-in`)
      setHabits(habits.map((h) => (h.id === habitId ? response.data : h)))
      setError("")
    } catch (err) {
      console.error("Error undoing check-in:", err)
      setError("Failed to undo check-in")
    }
  }

  const handleDeleteHabit = async (habitId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/habits/${habitId}`)
      setHabits(habits.filter((h) => h.id !== habitId))
      setError("")
    } catch (err) {
      console.error("Error deleting habit:", err)
      setError("Failed to delete habit")
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--background)",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "48px",
            height: "48px",
            border: "4px solid var(--muted)",
            borderTopColor: "var(--primary)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 16px",
          }} />
          <p style={{ color: "var(--muted-foreground)" }}>Loading your habits...</p>
        </div>
      </div>
    )
  }

  return (
    <main style={{
      minHeight: "calc(100vh - 64px)",
      backgroundImage: "linear-gradient(to bottom right, var(--background), var(--background), #f1f5f9)",
    }}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{
        maxWidth: "1536px",
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: "16px",
        paddingRight: "16px",
        paddingTop: "32px",
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "24px",
          marginBottom: "32px",
        }}>
          <div style={{ flex: 1 }}>
            <h1 style={{
              fontSize: "48px",
              fontWeight: "bold",
              color: "var(--foreground)",
              marginBottom: "8px",
              margin: "0 0 8px 0",
            }}>
              Your Habits
            </h1>
            <p style={{
              fontSize: "18px",
              color: "var(--muted-foreground)",
            }}>
              Build better habits one day at a time
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
            style={{
              alignSelf: "flex-start",
            }}
          >
            {showForm ? "Cancel" : "+ New Habit"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            marginBottom: "24px",
            padding: "16px",
            backgroundColor: "rgba(236, 72, 153, 0.1)",
            border: "1px solid var(--secondary)",
            color: "var(--secondary)",
            borderRadius: "8px",
          }}>
            {error}
          </div>
        )}

        {/* Form Section */}
        {showForm && (
          <div style={{ marginBottom: "32px" }}>
            <HabitForm onSubmit={handleAddHabit} />
          </div>
        )}

        {/* Habits List */}
        {habits.length > 0 ? (
          <HabitList
            habits={habits}
            onCheckIn={handleCheckIn}
            onUndoCheckIn={handleUndoCheckIn}
            onDelete={handleDeleteHabit}
          />
        ) : (
          <div className="card" style={{ textAlign: "center", paddingTop: "48px", paddingBottom: "48px" }}>
            <p style={{
              color: "var(--muted-foreground)",
              fontSize: "18px",
            }}>
              {showForm ? "Create your first habit to get started!" : "No habits yet. Create one to get started!"}
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
