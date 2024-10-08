import uuid
from urllib import request
from flask import Flask,jsonify, request
from flask_cors import CORS
import json
import sqlite3
from datetime import date,timedelta

#config
DEBUG=True
 
#instant the app
app = Flask(__name__)
app.config.from_object(__name__)
 
#enable CORs
CORS(app, resources={r'/*':{'origins':'*'}})

task_data = {}
data = {}

def del_one_item(new_data,db_path,table_name):
    # must compare each value from id to prev stored
    # actually better DEL record and create a new one
    # cur.execute(f"UPDATE {table_name} SET key1={newVal}, key2={newVal2} WHERE id={this_id}")
    pass

def read_json():
    # open a file on server side
    # with open(r"\Users\Documents\flask_vue_crud\server\tasks.json","r",encoding="utf-8") as fp:
    #    task_data = json.load(fp)
    gabi = make_json("myTasks")
    # task_data["tasks"] = make_json("myTasks")
    task_data["tasks"] = gabi[0]
    task_data["next_tasks"] = gabi[1]
    return task_data
 
def remove_task(task_id):
    # Remove item from DB and TASKS
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(f"DELETE FROM {TBL_NAME} WHERE id='{task_id}'")
    conn.commit()
    conn.close()

    # Remove id from dicObj
    for task in TASKS:
        if task['id'] == task_id:
            TASKS.remove(task)
            return True
    return False

def make_dict(tbl,day1,day2,show_all=False):
   julie = []
   wkday = date.today().weekday()
   connie = sqlite3.connect(DB_PATH)
   tasky = connie.cursor()
   if show_all:
       tasky.execute(f"SELECT * FROM {tbl}")
   else:
       tasky.execute(f"SELECT * FROM {tbl} WHERE days BETWEEN '{date.today()+timedelta(day1-wkday)}' AND '{date.today()+timedelta(day2-wkday)}' ORDER BY days")
   print(f"SELECT * FROM {tbl} WHERE days BETWEEN '{date.today()+timedelta(day1-wkday)}' AND '{date.today()+timedelta(day2-wkday)}'")
   cols = [descr[0] for descr in tasky.description]
   for row in tasky.fetchall():
       result = dict(zip(cols,row))
       julie.append(result)
   
   connie.close()
   return julie
 
def make_json(table_name):
    """wkday = date.today().weekday()
    connie = sqlite3.connect(DB_PATH)
    tasky = connie.cursor()
    tasky.execute(f"SELECT * FROM {table_name} WHERE days BETWEEN '{date.today()+timedelta(-wkday)}' AND '{date.today()+timedelta(4-wkday)}'")
    print(f"SELECT * FROM {table_name} WHERE days BETWEEN '{date.today()+timedelta(-wkday)}' AND '{date.today()+timedelta(4-wkday)}'")
    # tasky.execute(f"SELECT * FROM {table_name}")
    cols = [descr[0] for descr in tasky.description]
    zoey = []
    for row in tasky.fetchall():
        result = dict(zip(cols,row))
        zoey.append(result)
    connie.close()"""
    # print("dic",zoey)
    # fetch tasks for next week
    task_data["tasks"] = make_dict(table_name,0,4)
    task_data["next_tasks"] = make_dict(table_name,7,11)
    print("dic",task_data)
    return task_data


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
            'days': post_data.get('days'),
            'stat': int(post_data.get('stat')),
            'work_hours':int(post_data.get('work_hours')),
            'received':post_data.get('received'),
            'assign': post_data.get('assign')
            #,'priority':post_data.get('priority')
        })
        response_obj['message'] = 'Task added'
        insert_from_js(TASKS[-1], TBL_NAME)
        response_obj['info'] = 'DB updated'
    else:
        response_obj['tasks'] = TASKS
        response_obj['next_tasks'] = NEXT_TASKS
    return jsonify(response_obj)

 
@app.route('/tasks/<task_id>',methods=['PUT','DELETE','GET'])
def single_task(task_id):
    response_obj = {'status':'success'}
    if request.method == 'PUT':
        post_data = request.get_json()
        remove_task(task_id)
        TASKS.append({
            'id': post_data.get('id'),
            'name': post_data.get('name'),
            'stage':post_data.get('stage'),
            'days': post_data.get('days'),
            'stat': int(post_data.get('stat')),
            'work_hours':int(post_data.get('work_hours')),
            'received':post_data.get('received'),
            'assign':post_data.get('assign')
            #,'priority':post_data.get('priority')
        })
        response_obj['message'] = 'task updated'
        insert_from_js(TASKS[-1], TBL_NAME)
    elif request.method == 'DELETE':
        remove_task(task_id)
        response_obj['message'] = 'task removed'
    else:
        # request.method == 'GET':
        try:
            aux = next(item for item in TASKS if task_id in item["id"])
            response_obj["task"] = aux
        except StopIteration:
            aux = f"Please fix your input, dont add quots to item. Or {task_id} is not on the DB"
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
    DB_PATH = '/Users/truly/Documents/task_mgr/server/task.db'
    TBL_NAME = "myTasks"
    #update arrays
    make_json(TBL_NAME)
    TASKS = task_data("tasks")
    NEXT_TASKS = task_data["next_tasks"]
    app.run(port=3872)

