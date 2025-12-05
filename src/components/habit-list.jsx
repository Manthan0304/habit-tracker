import HabitCard from "./habit-card"

export default function HabitList({ habits, onCheckIn, onUndoCheckIn, onDelete }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onCheckIn={onCheckIn}
          onUndoCheckIn={onUndoCheckIn}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
