// JSON-server backed API with simple JWT auth endpoints
const express = require('express')
const jsonServer = require('json-server')
const path = require('path')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const cors = require('cors')
const bodyParser = require('body-parser')

const DATA_FILE = path.join(__dirname, 'data.json')
const SECRET = process.env.JWT_SECRET || 'change_this_secret'
const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(bodyParser.json())

function readDb() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8')
    return JSON.parse(raw)
  } catch (e) {
    return { users: [], habits: [] }
  }
}

function writeDb(db) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf8')
}

function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '7d' })
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ error: 'Authorization header missing' })
  const parts = auth.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Invalid authorization format' })
  const token = parts[1]
  try {
    const payload = jwt.verify(token, SECRET)
    req.user = payload
    next()
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

app.post('/auth/register', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  const db = readDb()
  const existing = db.users.find((u) => u.email === email)
  if (existing) return res.status(400).json({ error: 'User already exists' })
  const hashed = bcrypt.hashSync(password, 8)
  const user = { id: Date.now().toString(), email, password: hashed }
  db.users.push(user)
  writeDb(db)
  const token = generateToken(user)
  res.json({ user: { id: user.id, email: user.email }, token })
})

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  const db = readDb()
  const user = db.users.find((u) => u.email === email)
  if (!user) return res.status(400).json({ error: 'Invalid credentials' })
  const ok = bcrypt.compareSync(password, user.password)
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' })
  const token = generateToken(user)
  res.json({ user: { id: user.id, email: user.email }, token })
})

const router = jsonServer.router(DATA_FILE)
const middlewares = jsonServer.defaults()

function calculateStreak(checkIns) {
  if (!checkIns || checkIns.length === 0) return 0
  const sorted = [...checkIns].sort((a, b) => (a < b ? 1 : -1))
  const today = new Date()
  let streak = 0
  for (let i = 0; i < sorted.length; i++) {
    const parts = sorted[i].split('-').map((p) => parseInt(p, 10))
    const d = new Date(parts[0], parts[1] - 1, parts[2])
    const expected = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    expected.setDate(expected.getDate() - i)
    if (d.getFullYear() === expected.getFullYear() && d.getMonth() === expected.getMonth() && d.getDate() === expected.getDate()) {
      streak += 1
    } else {
      break
    }
  }
  return streak
}

app.post('/api/habits/:id/check-in', authMiddleware, (req, res) => {
  const db = readDb()
  const habit = db.habits.find((h) => h.id === req.params.id)
  if (!habit) return res.status(404).json({ error: 'Habit not found' })
  const today = new Date().toISOString().split('T')[0]
  habit.check_ins = habit.check_ins || []
  if (!habit.check_ins.includes(today)) habit.check_ins.push(today)
  habit.streak = calculateStreak(habit.check_ins)
  writeDb(db)
  res.json(habit)
})

app.post('/api/habits/:id/undo-check-in', authMiddleware, (req, res) => {
  const db = readDb()
  const habit = db.habits.find((h) => h.id === req.params.id)
  if (!habit) return res.status(404).json({ error: 'Habit not found' })
  const today = new Date().toISOString().split('T')[0]
  habit.check_ins = (habit.check_ins || []).filter((d) => d !== today)
  habit.streak = calculateStreak(habit.check_ins)
  writeDb(db)
  res.json(habit)
})

app.use('/api/habits', (req, res, next) => {
  if (req.method === 'GET') return next()
  return authMiddleware(req, res, next)
})

app.post('/api/habits', authMiddleware, (req, res) => {
  const db = readDb()
  const body = req.body || {}
  const userId = req.user && req.user.id
  const newHabit = {
    id: Date.now().toString(),
    name: body.name,
    description: body.description || '',
    color: body.color || 'indigo',
    check_ins: [],
    created_at: new Date().toISOString(),
    streak: 0,
    userId: userId || null,
  }
  db.habits = db.habits || []
  db.habits.push(newHabit)
  writeDb(db)
  res.status(201).json(newHabit)
})

app.use('/api', middlewares)
app.use('/api', (req, res, next) => {
  if (req.method === 'GET' && req.path === '/habits') {
    const db = readDb()
    let habits = db.habits || []
    const auth = req.headers.authorization
    if (auth) {
      try {
        const token = auth.split(' ')[1]
        const payload = jwt.verify(token, SECRET)
        habits = habits.filter((h) => !h.userId || h.userId === payload.id)
      } catch (e) {
        // ignore invalid token
      }
    }
    habits.forEach((h) => {
      h.streak = calculateStreak(h.check_ins || [])
    })
    return res.json(habits)
  }
  next()
})

app.use('/api', router)

app.listen(PORT, () => {
  console.log(`JSON backend + auth running on http://localhost:${PORT}`)
})
