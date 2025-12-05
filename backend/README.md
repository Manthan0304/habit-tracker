# Habit Tracker Backend

Python Flask REST API backend for the Habit Tracker application.

## Quick Start

### 1. Install Dependencies
\`\`\`bash
pip install -r requirements.txt
\`\`\`

### 2. Run the Server
\`\`\`bash
python server.py
\`\`\`

Server runs on `http://localhost:5000`

## API Routes

### Habits Management

- `GET /api/habits` - Get all habits with streaks calculated
- `POST /api/habits` - Create new habit
- `GET /api/habits/:id` - Get specific habit
- `PUT /api/habits/:id` - Update habit details
- `DELETE /api/habits/:id` - Delete a habit

### Daily Check-ins

- `POST /api/habits/:id/check-in` - Add today's check-in
- `POST /api/habits/:id/undo-check-in` - Remove today's check-in

## Data Structure

### Habit Object
\`\`\`json
{
  "id": "1701234567890",
  "name": "Morning Meditation",
  "description": "10 minutes of mindfulness",
  "color": "#6366f1",
  "check_ins": ["2024-12-01", "2024-12-02"],
  "created_at": "2024-12-01T08:00:00",
  "streak": 2
}
\`\`\`

## Key Features

- **CORS Enabled**: Allows requests from frontend
- **Automatic Streak Calculation**: Calculates streaks on every habit fetch
- **Persistent Storage**: All data saved to `data.json`
- **RESTful API**: Standard HTTP methods for CRUD operations

## Environment

- **Python**: 3.8+
- **Flask**: 3.0.0
- **Flask-CORS**: 4.0.0

## Error Handling

All errors return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `404` - Not Found
- `500` - Server Error

## Files

- `server.py` - Main Flask application
- `data.json` - JSON database
- `requirements.txt` - Python dependencies
