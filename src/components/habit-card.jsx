import { useState, useEffect } from "react"
import { Trash2, CheckCircle2, Circle } from "lucide-react"

export default function HabitCard({ habit, onCheckIn, onUndoCheckIn, onDelete }) {
  const [isCheckedInToday, setIsCheckedInToday] = useState(false)
  const [streak, setStreak] = useState(habit.streak || 0)

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    setIsCheckedInToday(habit.check_ins.includes(today))
    setStreak(habit.streak || 0)
  }, [habit])

  const handleCheckIn = () => {
    if (isCheckedInToday) {
      onUndoCheckIn(habit.id)
    } else {
      onCheckIn(habit.id)
    }
  }

  const progressPercentage = habit.check_ins.length > 0 ? Math.min((habit.check_ins.length / 30) * 100, 100) : 0

  return (
    <div className="card group hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground">{habit.name}</h3>
          {habit.description && <p className="text-sm text-muted-foreground mt-1">{habit.description}</p>}
        </div>
        <button
          onClick={() => onDelete(habit.id)}
          className="p-1 text-muted-foreground hover:text-secondary transition-colors opacity-0 group-hover:opacity-100"
          title="Delete habit"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Current Streak</p>
          <p className="text-2xl font-bold mt-1" style={{ color: habit.color }}>
            {streak}
          </p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Done</p>
          <p className="text-2xl font-bold mt-1 text-foreground">{habit.check_ins.length}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-muted-foreground">30-Day Progress</p>
          <p className="text-sm font-bold text-foreground">{Math.round(progressPercentage)}%</p>
        </div>
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPercentage}%`,
              backgroundColor: habit.color,
            }}
          />
        </div>
      </div>

      <button
        onClick={handleCheckIn}
        className="w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
        style={{
          backgroundColor: isCheckedInToday ? habit.color : "transparent",
          color: isCheckedInToday ? "white" : habit.color,
          border: `2px solid ${habit.color}`,
        }}
      >
        {isCheckedInToday ? (
          <>
            <CheckCircle2 size={20} />
            Done Today!
          </>
        ) : (
          <>
            <Circle size={20} />
            Check In
          </>
        )}
      </button>
    </div>
  )
}
