from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime
from pathlib import Path

app = Flask(__name__)
CORS(app)

# Database file path
DATA_FILE = Path(__file__).parent / "data.json"

def load_habits():
    """Load habits from JSON file"""
    if DATA_FILE.exists():
        try:
            with open(DATA_FILE, 'r') as f:
                return json.load(f)
        except json.JSONDecodeError:
            return {"habits": []}
    return {"habits": []}

def save_habits(data):
    """Save habits to JSON file"""
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def calculate_streak(check_ins):
    """Calculate current streak from check-ins"""
    if not check_ins:
        return 0
    
    sorted_dates = sorted(check_ins, reverse=True)
    from datetime import datetime, timedelta
    today = datetime.now().date()
    streak = 0
    
    for i, date_str in enumerate(sorted_dates):
        check_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        expected_date = today - timedelta(days=i)
        
        if check_date == expected_date:
            streak += 1
        else:
            break
    
    return streak

@app.route('/api/habits', methods=['GET'])
def get_habits():
    """Get all habits"""
    data = load_habits()
    habits = data.get("habits", [])
    
    # Add streak calculation to each habit
    for habit in habits:
        habit['streak'] = calculate_streak(habit.get('check_ins', []))
    
    return jsonify(habits)

@app.route('/api/habits', methods=['POST'])
def create_habit():
    """Create a new habit"""
    data = load_habits()
    habit_data = request.json
    
    new_habit = {
        "id": str(int(datetime.now().timestamp() * 1000)),
        "name": habit_data.get("name"),
        "description": habit_data.get("description", ""),
        "color": habit_data.get("color", "indigo"),
        "check_ins": [],
        "created_at": datetime.now().isoformat(),
        "streak": 0
    }
    
    data["habits"].append(new_habit)
    save_habits(data)
    
    return jsonify(new_habit), 201

@app.route('/api/habits/<habit_id>', methods=['GET'])
def get_habit(habit_id):
    """Get a specific habit"""
    data = load_habits()
    habit = next((h for h in data["habits"] if h["id"] == habit_id), None)
    
    if habit:
        habit['streak'] = calculate_streak(habit.get('check_ins', []))
        return jsonify(habit)
    
    return jsonify({"error": "Habit not found"}), 404

@app.route('/api/habits/<habit_id>', methods=['PUT'])
def update_habit(habit_id):
    """Update a habit"""
    data = load_habits()
    habit = next((h for h in data["habits"] if h["id"] == habit_id), None)
    
    if not habit:
        return jsonify({"error": "Habit not found"}), 404
    
    habit_data = request.json
    habit.update(habit_data)
    save_habits(data)
    
    return jsonify(habit)

@app.route('/api/habits/<habit_id>', methods=['DELETE'])
def delete_habit(habit_id):
    """Delete a habit"""
    data = load_habits()
    data["habits"] = [h for h in data["habits"] if h["id"] != habit_id]
    save_habits(data)
    
    return jsonify({"success": True})

@app.route('/api/habits/<habit_id>/check-in', methods=['POST'])
def check_in(habit_id):
    """Add a check-in for today"""
    data = load_habits()
    habit = next((h for h in data["habits"] if h["id"] == habit_id), None)
    
    if not habit:
        return jsonify({"error": "Habit not found"}), 404
    
    today = datetime.now().date().isoformat()
    if today not in habit["check_ins"]:
        habit["check_ins"].append(today)
    
    habit['streak'] = calculate_streak(habit['check_ins'])
    save_habits(data)
    
    return jsonify(habit)

@app.route('/api/habits/<habit_id>/undo-check-in', methods=['POST'])
def undo_check_in(habit_id):
    """Remove today's check-in"""
    data = load_habits()
    habit = next((h for h in data["habits"] if h["id"] == habit_id), None)
    
    if not habit:
        return jsonify({"error": "Habit not found"}), 404
    
    today = datetime.now().date().isoformat()
    habit["check_ins"] = [d for d in habit["check_ins"] if d != today]
    habit['streak'] = calculate_streak(habit['check_ins'])
    save_habits(data)
    
    return jsonify(habit)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
