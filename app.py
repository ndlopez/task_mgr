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
    with open(r"C:\Users\tgA5313\Documents\flask_vue_crud\server\tasks.json","r",encoding="utf-8") as fp:
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

*json*
{
    "tasks":[
        {
            "id":123,"name":"SAB-インフレーター組み付け",
            "stage":"modeling",
            "timeline":["06-11","06-12","06-13"],
            "status":25,"work_hours":44,
            "deadline":"2023-11-01","priority":"high"
        },
        {
            "id":124,"name":"SABに粒子法で膨張",
            "stage":"資料修正",
            "timeline":["06-12","06-14"],
            "status":100,"work_hours":30,
            "deadline":"2023-11-01","priority":"medium"
        },
        {
            "id":125,"name":"島用ツール不具合対応",
            "stage":"released",
            "timeline":["06-10","06-11","06-12"],
            "status":100,"work_hours":36,"deadline":"2024-04-16","priority":"low"
        },
        {
            "id":126,"name":"RPA toolに追加機能",
            "stage":"資料作成",
            "timeline":["06-12","06-14"],
            "status":85,"work_hours":12,"deadline":"2024-04-10","priority":"low"
        },
        {
            "id":127,"name":"D-Shareツール",
            "stage":"資料作成",
            "timeline":["06-13","06-14"],
            "status":100,"work_hours":4,"deadline":"2024-04-01","priority":"low"
        }
    ],
    "todo":[
        {
            "id":123,"name":"SAB-インフレーター組み付け",
            "stage":"modeling",
            "timeline":["06-17","06-19","06-20"],
            "status":25,"work_hours":44,
            "deadline":"2023-11-01","priority":"high"
        },
        {
            "id":200,"name":"HeartCore Know-How",
            "stage":"資料作成",
            "timeline":["06-17","06-18","06-19"],
            "status":0,"work_hours":0,"deadline":"2023-06-27","priority":"low"
        },
        {
            "id":201,"name":"TACTIS Robo",
            "stage":"検証表作成",
            "timeline":["06-18","06-19","06-20"],
            "status":0,"work_hours":0,"deadline":"2024-04-04","priority":"medium"
        }
    ],
    "meeting":[
        {
            "id":1,
            "name":"DX1 team meeting",
            "date":"2024-06-11",
            "lenght":1.0
        },
        {
            "id":2,
            "name":"室会",
            "date":"2024-06-11",
            "lenght":1.0
        },
        {
            "id":3,
            "name":"進捗状況",
            "date":"2024-06-10",
            "lenght":0.5
        },
        {
            "id":4,
            "name":"Group改善活動",
            "date":"2024-06-13",
            "lenght":1.0
        }
    ]
}

CSS
input[type="text"],input[type="range"]{
    width: 80%;
}
#StatBar{
    width:100%;
    height: 20px;
    line-height: 20px;
    color: #bed2e0;
    text-align: center;
}
.done_task{
    background-color: green;
}
.doing_task{
    background-color: #cc274c;
}
datalist{
    display:flex;
    flex-direction: row;
    width: 80%;
    justify-content: space-between;
}
