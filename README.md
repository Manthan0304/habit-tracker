# Habit Tracker - Full Stack Application

A modern habit tracking system built with **React + Vite** (frontend) and **Python Flask** (backend), styled with **Tailwind CSS**. Track your daily habits, maintain streaks, and visualize your progress with an intuitive interface.

## Features

- ✨ **Create Habits**: Add new habits with custom names, descriptions, and colors
- 📊 **Visual Progress**: 30-day progress bars showing completion percentage
- 🔥 **Streak Tracking**: Automatic streak calculation for consecutive daily check-ins
- ✅ **Daily Check-ins**: One-click habit completion with today's status indicator
- 🗑️ **Manage Habits**: Edit, delete, and organize your habits
- 💾 **Persistent Storage**: All data stored in JSON backend with automatic persistence
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Built with Tailwind CSS for a clean, engaging experience

## Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API communication
- **TypeScript** - Type-safe JavaScript

### Backend
- **Python** - Programming language
- **Flask** - Lightweight web framework
- **Flask-CORS** - Cross-Origin Resource Sharing support
- **JSON** - Data persistence

## Project Structure

\`\`\`
.
├── src/                          # React source directory
│   ├── App.tsx                  # Main App component
│   ├── main.tsx                 # React entry point
│   ├── components/              # React components
│   │   ├── habit-form.tsx       # Add new habit form
│   │   ├── habit-list.tsx       # Grid of habits
│   │   ├── habit-card.tsx       # Individual habit card
│   │   └── ui/                  # UI components
│   ├── lib/                     # Utility functions
│   │   └── utils.ts             # Helper functions
│   └── styles/                  # Global styles
│       └── globals.css          # Tailwind CSS & design tokens
├── index.html                    # HTML entry point
├── vite.config.ts               # Vite configuration
├── backend/                      # Python Flask backend
│   ├── server.py                # Main Flask app with API routes
│   ├── data.json                # JSON database file
│   └── requirements.txt          # Python dependencies
└── public/                       # Static assets
\`\`\`

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm/pnpm/yarn
- Python 3.8+
- pip (Python package manager)

### Backend Setup

1. **Install Python dependencies**:
\`\`\`bash
cd backend
pip install -r requirements.txt
\`\`\`

2. **Run the Flask server**:
\`\`\`bash
python server.py
\`\`\`

The backend will start on `http://localhost:5000`

### Frontend Setup

1. **Install dependencies**:
\`\`\`bash
npm install
# or
pnpm install
# or
yarn install
\`\`\`

2. **Set environment variable** (optional, defaults to localhost:5000):
\`\`\`bash
# Create .env file
echo "VITE_API_URL=http://localhost:5000" > .env
\`\`\`

3. **Run the development server**:
\`\`\`bash
npm run dev
# or
pnpm dev
# or
yarn dev
\`\`\`

The frontend will start on `http://localhost:3000`

## API Endpoints

### Habits

#### Get All Habits
\`\`\`
GET /api/habits
\`\`\`

#### Create New Habit
\`\`\`
POST /api/habits
Content-Type: application/json

{
  "name": "Morning Run",
  "description": "Run for 30 minutes",
  "color": "#6366f1"
}
\`\`\`

#### Get Single Habit
\`\`\`
GET /api/habits/:id
\`\`\`

#### Update Habit
\`\`\`
PUT /api/habits/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description",
  "color": "#ec4899"
}
\`\`\`

#### Delete Habit
\`\`\`
DELETE /api/habits/:id
\`\`\`

#### Check In Today
\`\`\`
POST /api/habits/:id/check-in
\`\`\`

#### Undo Today's Check-In
\`\`\`
POST /api/habits/:id/undo-check-in
\`\`\`

## Data Storage

All habit data is stored in a JSON file located at `backend/data.json`. The file structure is:

\`\`\`json
{
  "habits": [
    {
      "id": "1701234567890",
      "name": "Morning Meditation",
      "description": "10 minutes of mindfulness",
      "color": "#6366f1",
      "check_ins": ["2024-12-01", "2024-12-02", "2024-12-03"],
      "created_at": "2024-12-01T08:00:00",
      "streak": 3
    }
  ]
}
\`\`\`

## Usage

1. **Open the app** at `http://localhost:3000`
2. **Create a habit** by clicking "+ New Habit" and filling in the details
3. **Check in daily** by clicking the "Check In" button on your habit card
4. **Track progress** through the visual progress bar and streak counter
5. **Manage habits** with edit/delete functionality (delete via button on hover)

## Color Options

Choose from predefined colors when creating habits:
- Indigo (#6366f1)
- Rose (#ec4899)
- Emerald (#10b981)
- Amber (#f59e0b)
- Cyan (#06b6d4)
- Violet (#a855f7)

## Streak Calculation

Streaks are calculated based on consecutive daily check-ins. For example:
- Check in on Dec 1, 2, 3 → Streak: 3
- Check in on Dec 1, 2, 3, then skip Dec 4 → Streak: 0
- Check in on Dec 1, skip Dec 2, check in Dec 3 → Streak: 1 (only counts from today backwards)

## Development

### Frontend Development
- Components are organized in `/components`
- Custom Tailwind components defined in `globals.css`
- Design tokens for colors and spacing in CSS custom properties

### Backend Development
- All API routes in `server.py`
- Streak calculation logic in `calculate_streak()` function
- CORS enabled for localhost:3000

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy

### Backend (Any Python Host)
1. Deploy Flask app to service like Heroku, Render, or Railway
2. Update frontend `NEXT_PUBLIC_API_URL` to match backend URL
3. Ensure CORS settings allow your frontend domain

## Troubleshooting

**CORS Error**: Make sure Flask backend is running on port 5000 and frontend is configured with correct API URL.

**Data not persisting**: Check that `backend/data.json` exists and is writable.

**Habits not loading**: Verify backend is running and check browser console for errors.

## License

MIT

## Contributing

Feel free to fork and submit pull requests!
