import uuid
from urllib import request
from flask import Flask,jsonify, request
from flask_cors import CORS
import json
 
#config
DEBUG=True
 
#instant the app
app = Flask(__name__)
app.config.from_object(__name__)
 
#enable CORs
CORS(app, resources={r'/*':{'origins':'*'}})
 
def read_json():
    # open a file on server side
    with open(r"\Users\Documents\flask_vue_crud\server\tasks.json","r",encoding="utf-8") as fp:
        task_data = json.load(fp)
    return task_data["tasks"]
 
def remove_task(task_id):
    for task in TASKS:
        if task['id'] == task_id:
            TASKS.remove(task)
            return True
    return False

#check route
@app.route('/')
def port_init():
    return '<h2>Hi there, testing server out</h2>'
 
@app.route('/ping',methods=['GET'])
def ping_me():
    return jsonify('pong')
 
@app.route('/tasks',methods=['GET','POST'])
def all_tasks():
    response_obj = {'status':'success'}
    if request.method == 'POST':
        post_data = request.get_json()
        TASKS.append({
            'id': post_data.get('id'),
            # uuid.uuid4().hex, 2024-01-22
            'name': post_data.get('name'),
            'stage':post_data.get('stage'),
            'timeline': post_data.get('timeline'),
            'status': post_data.get('status'),
            'work_hours':post_data.get('work_hours'),
            'deadline':post_data.get('deadline'),
            'priority':post_data.get('priority')
        })
        response_obj['message'] = 'Task added'
    else:
        response_obj['tasks'] = TASKS
    return jsonify(response_obj)

 
@app.route('/tasks/<task_id>',methods=['PUT','DELETE'])
def single_task(task_id):
    response_obj = {'status':'success'}
    if request.method == 'PUT':
        post_data = request.get_json()
        remove_task(task_id)
        TASKS.append({
            'id': post_data.get('id'),
            'name': post_data.get('name'),
            'stage':post_data.get('stage'),
            'timeline': post_data.get('timeline'),
            'status': post_data.get('status'),
            'work_hours':post_data.get('work_hours'),
            'deadline':post_data.get('deadline'),
            'priority':post_data.get('priority')
        })
        response_obj['message'] = 'task updated'
    if request.method == 'DELETE':
        remove_task(task_id)
        response_obj['message'] = 'task removed'
    return jsonify(response_obj)

 
@app.route('/tasks/name=<task_name>',methods=['GET'])
def list_item(task_name):
    response_obj = {'status':'success'}
    # search for task in TASKS dic?
    try:
        aux = next(item for item in TASKS if task_name in item["name"])
        # my attempt
        """for item in TASKS:
            if author in item["author"]:
                return jsonify(item)"""
    except StopIteration:
        aux = f"Please fix your input, dont add quots to item. Or item is not on the DB"
    # get the index
    # idx = ((i for i,item in enumerate(TASKS) if author in item["name"]),None)
    # return jsonify(TASKS[idx])
    # using filter func
    # aux = list(filter(lambda person: author in person["author"], TASKS))
    return jsonify(aux)

 
if __name__ == "__main__":
    TASKS = read_json()
    app.run(port=3872)

