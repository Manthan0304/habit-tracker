import { useState } from "react"

const COLORS = [
  { name: "Indigo", value: "#6366f1" },
  { name: "Rose", value: "#ec4899" },
  { name: "Emerald", value: "#10b981" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Violet", value: "#a855f7" },
]

export default function HabitForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#6366f1",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name.trim()) {
      onSubmit(formData)
      setFormData({ name: "", description: "", color: "#6366f1" })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card bg-white border-2 border-primary/20">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Habit Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Morning Meditation"
            className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Description (optional)</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Why do you want to build this habit?"
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">Color</label>
          <div className="flex gap-3">
            {COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setFormData({ ...formData, color: color.value })}
                className="w-8 h-8 rounded-full transition-transform hover:scale-110"
                style={{
                  backgroundColor: color.value,
                  border: formData.color === color.value ? "3px solid #0f172a" : "2px solid transparent",
                }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        <button type="submit" className="w-full btn-primary mt-6">
          Create Habit
        </button>
      </div>
    </form>
  )
}
