import { useState, useEffect } from "react"
import axios from "@/lib/api"
import { TrendingUp, Calendar, Flame, Target } from "lucide-react"
import { useUserChange } from "@/hooks/useUserChange"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

export default function Statistics() {
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchHabits()
  }, [])

  // Refetch habits when user changes (login/logout)
  useUserChange(() => {
    fetchHabits()
  })

  const fetchHabits = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/habits`)
      setHabits(response.data)
      setError("")
    } catch (err) {
      console.error("Error fetching habits:", err)
      setError("Failed to load statistics. Make sure the backend is running.")
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics
  const totalHabits = habits.length
  const totalCheckIns = habits.reduce((sum, h) => sum + h.check_ins.length, 0)
  const longestStreak = Math.max(...habits.map((h) => h.streak || 0), 0)
  const completionRate = totalHabits > 0
    ? Math.round((habits.filter((h) => {
        const today = new Date().toISOString().split("T")[0]
        return h.check_ins.includes(today)
      }).length / totalHabits) * 100)
    : 0

  // Get top habits by streak
  const topHabits = [...habits].sort((a, b) => (b.streak || 0) - (a.streak || 0)).slice(0, 5)

  // Get this week's data
  const getWeekStats = () => {
    const today = new Date()
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    const weekData = {}
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekAgo.getTime() + i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split("T")[0]
      weekData[dateStr] = 0
    }

    habits.forEach((habit) => {
      habit.check_ins.forEach((checkIn) => {
        if (weekData.hasOwnProperty(checkIn)) {
          weekData[checkIn]++
        }
      })
    })

    return Object.entries(weekData).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      count,
    }))
  }

  const weekStats = getWeekStats()

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
          <p style={{ color: "var(--muted-foreground)" }}>Loading statistics...</p>
        </div>
      </div>
    )
  }

  return (
    <main style={{
      minHeight: "calc(100vh - 64px)",
      backgroundImage: "linear-gradient(to bottom right, var(--background), var(--background), #f1f5f9)",
      paddingTop: "32px",
      paddingBottom: "32px",
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
      }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{
            fontSize: "48px",
            fontWeight: "bold",
            color: "var(--foreground)",
            marginBottom: "8px",
            margin: "0 0 8px 0",
          }}>
            Statistics & Analytics
          </h1>
          <p style={{
            fontSize: "18px",
            color: "var(--muted-foreground)",
          }}>
            Track your progress and habits performance
          </p>
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

        {totalHabits === 0 ? (
          <div className="card" style={{ textAlign: "center", paddingTop: "64px", paddingBottom: "64px" }}>
            <p style={{
              color: "var(--muted-foreground)",
              fontSize: "18px",
            }}>
              No habits yet. Create some habits to see statistics!
            </p>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "16px",
              marginBottom: "32px",
            }}>
              {/* Total Habits */}
              <div className="card" style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <div>
                  <p style={{
                    fontSize: "14px",
                    color: "var(--muted-foreground)",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    fontWeight: "600",
                  }}>
                    Total Habits
                  </p>
                  <p style={{
                    fontSize: "40px",
                    fontWeight: "bold",
                    color: "var(--primary)",
                  }}>
                    {totalHabits}
                  </p>
                </div>
                <Target size={32} style={{ color: "var(--primary)", opacity: 0.5 }} />
              </div>

              {/* Total Check-ins */}
              <div className="card" style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <div>
                  <p style={{
                    fontSize: "14px",
                    color: "var(--muted-foreground)",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    fontWeight: "600",
                  }}>
                    Total Check-ins
                  </p>
                  <p style={{
                    fontSize: "40px",
                    fontWeight: "bold",
                    color: "var(--accent)",
                  }}>
                    {totalCheckIns}
                  </p>
                </div>
                <Calendar size={32} style={{ color: "var(--accent)", opacity: 0.5 }} />
              </div>

              {/* Longest Streak */}
              <div className="card" style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <div>
                  <p style={{
                    fontSize: "14px",
                    color: "var(--muted-foreground)",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    fontWeight: "600",
                  }}>
                    Longest Streak
                  </p>
                  <p style={{
                    fontSize: "40px",
                    fontWeight: "bold",
                    color: "var(--secondary)",
                  }}>
                    {longestStreak} days
                  </p>
                </div>
                <Flame size={32} style={{ color: "var(--secondary)", opacity: 0.5 }} />
              </div>

              {/* Today's Completion */}
              <div className="card" style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <div>
                  <p style={{
                    fontSize: "14px",
                    color: "var(--muted-foreground)",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    fontWeight: "600",
                  }}>
                    Today's Completion
                  </p>
                  <p style={{
                    fontSize: "40px",
                    fontWeight: "bold",
                    color: "var(--primary)",
                  }}>
                    {completionRate}%
                  </p>
                </div>
                <TrendingUp size={32} style={{ color: "var(--primary)", opacity: 0.5 }} />
              </div>
            </div>

            {/* Week Overview */}
            <div className="card" style={{ marginBottom: "32px" }}>
              <h2 style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "var(--foreground)",
                marginBottom: "24px",
              }}>
                Weekly Activity
              </h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "12px",
              }}>
                {weekStats.map((day, idx) => (
                  <div key={idx} style={{
                    textAlign: "center",
                    padding: "16px",
                    backgroundColor: "var(--muted)",
                    borderRadius: "8px",
                  }}>
                    <p style={{
                      fontSize: "12px",
                      color: "var(--muted-foreground)",
                      marginBottom: "8px",
                      fontWeight: "600",
                    }}>
                      {day.date.split(",")[0]}
                    </p>
                    <p style={{
                      fontSize: "28px",
                      fontWeight: "bold",
                      color: "var(--primary)",
                    }}>
                      {day.count}
                    </p>
                    <p style={{
                      fontSize: "11px",
                      color: "var(--muted-foreground)",
                      marginTop: "4px",
                    }}>
                      check-ins
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Habits */}
            {topHabits.length > 0 && (
              <div className="card">
                <h2 style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "var(--foreground)",
                  marginBottom: "24px",
                }}>
                  Top Habits by Streak
                </h2>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}>
                  {topHabits.map((habit) => (
                    <div key={habit.id} style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px",
                      backgroundColor: "var(--muted)",
                      borderRadius: "8px",
                      borderLeft: `4px solid ${habit.color}`,
                    }}>
                      <div>
                        <h3 style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "var(--foreground)",
                          marginBottom: "4px",
                        }}>
                          {habit.name}
                        </h3>
                        <p style={{
                          fontSize: "14px",
                          color: "var(--muted-foreground)",
                        }}>
                          {habit.check_ins.length} total check-ins
                        </p>
                      </div>
                      <div style={{
                        textAlign: "right",
                      }}>
                        <p style={{
                          fontSize: "28px",
                          fontWeight: "bold",
                          color: habit.color,
                        }}>
                          {habit.streak || 0}
                        </p>
                        <p style={{
                          fontSize: "12px",
                          color: "var(--muted-foreground)",
                        }}>
                          day streak
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
