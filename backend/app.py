from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

DATA_FILE = 'habits.json'

def load_habits():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return {'habits': []}

def save_habits(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def calculate_streak(check_ins):
    if not check_ins:
        return 0
    
    sorted_dates = sorted(check_ins, reverse=True)
    today = datetime.now().date()
    streak = 0
    
    for i, date_str in enumerate(sorted_dates):
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
        expected_date = today - timedelta(days=i)
        
        if date == expected_date:
            streak += 1
        else:
            break
    
    return streak

@app.route('/api/habits', methods=['GET'])
def get_habits():
    data = load_habits()
    return jsonify(data['habits'])

@app.route('/api/habits', methods=['POST'])
def create_habit():
    data = load_habits()
    new_habit = request.json
    new_habit['id'] = str(int(datetime.now().timestamp() * 1000))
    new_habit['check_ins'] = []
    new_habit['created_at'] = datetime.now().isoformat()
    
    data['habits'].append(new_habit)
    save_habits(data)
    return jsonify(new_habit), 201

@app.route('/api/habits/<habit_id>', methods=['PUT'])
def update_habit(habit_id):
    data = load_habits()
    for habit in data['habits']:
        if habit['id'] == habit_id:
            habit.update(request.json)
            save_habits(data)
            return jsonify(habit)
    return jsonify({'error': 'Habit not found'}), 404

@app.route('/api/habits/<habit_id>', methods=['DELETE'])
def delete_habit(habit_id):
    data = load_habits()
    data['habits'] = [h for h in data['habits'] if h['id'] != habit_id]
    save_habits(data)
    return jsonify({'success': True})

@app.route('/api/habits/<habit_id>/check-in', methods=['POST'])
def check_in_habit(habit_id):
    data = load_habits()
    today = datetime.now().strftime('%Y-%m-%d')
    
    for habit in data['habits']:
        if habit['id'] == habit_id:
            if today not in habit['check_ins']:
                habit['check_ins'].append(today)
            save_habits(data)
            habit['streak'] = calculate_streak(habit['check_ins'])
            return jsonify(habit)
    
    return jsonify({'error': 'Habit not found'}), 404

@app.route('/api/habits/<habit_id>/check-in', methods=['DELETE'])
def undo_check_in(habit_id):
    data = load_habits()
    today = datetime.now().strftime('%Y-%m-%d')
    
    for habit in data['habits']:
        if habit['id'] == habit_id:
            if today in habit['check_ins']:
                habit['check_ins'].remove(today)
            save_habits(data)
            habit['streak'] = calculate_streak(habit['check_ins'])
            return jsonify(habit)
    
    return jsonify({'error': 'Habit not found'}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)
