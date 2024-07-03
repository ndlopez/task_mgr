import uuid
from urllib import request
from flask import Flask,jsonify, request
from flask_cors import CORS
import json
import sqlite3

#config
DEBUG=True
 
#instant the app
app = Flask(__name__)
app.config.from_object(__name__)
 
#enable CORs
CORS(app, resources={r'/*':{'origins':'*'}})

task_data = {}
data = {}

def read_json():
    # open a file on server side
    with open(r"\Users\Documents\flask_vue_crud\server\tasks.json","r",encoding="utf-8") as fp:
        task_data = json.load(fp)
    return task_data["tasks"]
 
def remove_task(task_id):
    # Remove item from DB and TASKS
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(f"DELETE FROM {TBL_NAME} WHERE id='{task_id}'")
    conn.commit()
    conn.close()

    for task in TASKS:
        if task['id'] == task_id:
            TASKS.remove(task)
            return True
    return False

def get_db_conn():
    connie = sqlite3.connect('/Users/truly/Documents/task_mgr/server/task.db')
    connie.row_factory = sqlite3.Row
    return connie

 
def make_json(table_name):
    connie = sqlite3.connect(DB_PATH)
    tasky = connie.cursor()
    tasky.execute(f"SELECT * FROM {table_name}")
    cols = [descr[0] for descr in tasky.description]
    zoey = []
    for row in tasky.fetchall():
        result = dict(zip(cols,row))
        zoey.append(result)
    connie.close()
    print("dic",zoey)
    return zoey
    # return json.dumps(zoey) <- returns as string
    '''tags = ("id","name","stage","days","stat","work_hours","received")
    for item in tags:
        TASKX[item] = tasky[0]
    zoey.append(TASKX)
    data["tasks"] = zoey'''

def insert_from_js(data, table_name):
    # fetching values from JS-post
    # with open(json_path, 'r') as file:
    #    data = json.load(file)
    # print("got this",data,data.keys(),data.values())
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
   
    '''for entry in data:
        # when data=[{key:value}]
        keys = ', '.join(entry.keys())
        question_marks = ', '.join(['?' for _ in entry])
        values = tuple(entry.values())
        cur.execute(f"INSERT INTO {table_name} ({keys}) VALUES ({question_marks})", values)
    '''
    keys = tuple(data.keys())
    question_marks = ', '.join(['?' for _ in data])
    values = tuple(data.values())
    # print(keys,values,f"INSERT INTO {table_name} {keys} VALUES ({question_marks})")
    cur.execute(f"INSERT INTO {table_name} {keys} VALUES ({question_marks})", values)

    conn.commit()
    conn.close()
 
def del_one_item(new_data,db_path,table_name):
    # must compare each value from id to prev stored
    # actually better DEL record and create a new one
    # cur.execute(f"UPDATE {table_name} SET key1={newVal}, key2={newVal2} WHERE id={this_id}")
    pass

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

