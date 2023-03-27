from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/checkIn_hardware', methods=['POST'])
def CheckIn_hardware():
    projectid = request.json.get('projectid')
    qty = request.json.get('qty')
    return checkIn_hardware(projectid, qty)

@app.route('/api/checkOut_hardware', methods=['POST'])    
def CheckOut_hardware():
    projectid = request.json.get('projectid')
    qty = request.json.get('qty')
    return checkOut_hardware(projectid, qty)

@app.route('/api/joinProject', methods=['POST'])
def JoinProject():
    projectid = request.json.get('projectid')
    return joinProject(projectid)
    
@app.route('/api/leaveProject', methods=['POST'])    
def LeaveProject():
    projectid = request.json.get('projectid')
    return leaveProject(projectid)

def checkIn_hardware(projectid, qty):
    return jsonify({'projectid': projectid, 'qty': qty})

def checkOut_hardware(projectid, qty):
    return jsonify({'projectid': projectid, 'qty': qty})

def joinProject(projectid):
    return jsonify({'projectid': projectid})

def leaveProject(projectid):
    return jsonify({'projectid': projectid})

if __name__ == '__main__':
    app.run()