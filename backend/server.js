const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data.json');
const PORT = 5000;

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

async function loadHabits() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return { habits: [] };
  }
}

async function saveHabits(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function calculateStreak(checkIns) {
  if (!checkIns || checkIns.length === 0) return 0;

  const sorted = [...checkIns].sort((a, b) => (a < b ? 1 : -1)); // desc
  const today = new Date();
  let streak = 0;

  for (let i = 0; i < sorted.length; i++) {
    const dateStr = sorted[i];
    const parts = dateStr.split('-').map((p) => parseInt(p, 10));
    const d = new Date(parts[0], parts[1] - 1, parts[2]);

    const expected = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    expected.setDate(expected.getDate() - i);

    if (
      d.getFullYear() === expected.getFullYear() &&
      d.getMonth() === expected.getMonth() &&
      d.getDate() === expected.getDate()
    ) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
}

app.get('/api/habits', async (req, res) => {
  try {
    const data = await loadHabits();
    const habits = data.habits || [];
    habits.forEach((h) => {
      h.streak = calculateStreak(h.check_ins || []);
    });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load habits' });
  }
});

app.post('/api/habits', async (req, res) => {
  try {
    const data = await loadHabits();
    const body = req.body || {};
    const newHabit = {
      id: Date.now().toString(),
      name: body.name,
      description: body.description || '',
      color: body.color || 'indigo',
      check_ins: [],
      created_at: new Date().toISOString(),
      streak: 0,
    };

    data.habits = data.habits || [];
    data.habits.push(newHabit);
    await saveHabits(data);
    res.status(201).json(newHabit);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create habit' });
  }
});

app.get('/api/habits/:id', async (req, res) => {
  try {
    const data = await loadHabits();
    const habit = (data.habits || []).find((h) => h.id === req.params.id);
    if (!habit) return res.status(404).json({ error: 'Habit not found' });
    habit.streak = calculateStreak(habit.check_ins || []);
    res.json(habit);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get habit' });
  }
});

app.put('/api/habits/:id', async (req, res) => {
  try {
    const data = await loadHabits();
    const habits = data.habits || [];
    const idx = habits.findIndex((h) => h.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Habit not found' });

    const updated = { ...habits[idx], ...req.body };
    // ensure check_ins exists
    if (!Array.isArray(updated.check_ins)) updated.check_ins = habits[idx].check_ins || [];
    updated.streak = calculateStreak(updated.check_ins);
    habits[idx] = updated;
    data.habits = habits;
    await saveHabits(data);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update habit' });
  }
});

app.delete('/api/habits/:id', async (req, res) => {
  try {
    const data = await loadHabits();
    data.habits = (data.habits || []).filter((h) => h.id !== req.params.id);
    await saveHabits(data);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete habit' });
  }
});

app.post('/api/habits/:id/check-in', async (req, res) => {
  try {
    const data = await loadHabits();
    const habits = data.habits || [];
    const habit = habits.find((h) => h.id === req.params.id);
    if (!habit) return res.status(404).json({ error: 'Habit not found' });

    const today = formatDate(new Date());
    habit.check_ins = habit.check_ins || [];
    if (!habit.check_ins.includes(today)) habit.check_ins.push(today);
    habit.streak = calculateStreak(habit.check_ins);
    await saveHabits(data);
    res.json(habit);
  } catch (err) {
    res.status(500).json({ error: 'Failed to check-in' });
  }
});

app.post('/api/habits/:id/undo-check-in', async (req, res) => {
  try {
    const data = await loadHabits();
    const habits = data.habits || [];
    const habit = habits.find((h) => h.id === req.params.id);
    if (!habit) return res.status(404).json({ error: 'Habit not found' });

    const today = formatDate(new Date());
    habit.check_ins = (habit.check_ins || []).filter((d) => d !== today);
    habit.streak = calculateStreak(habit.check_ins);
    await saveHabits(data);
    res.json(habit);
  } catch (err) {
    res.status(500).json({ error: 'Failed to undo check-in' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
