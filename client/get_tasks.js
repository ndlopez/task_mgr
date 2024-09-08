const task_url = "http://127.0.0.1:3872/tasks";
let thisDate = new Date();
let monty = thisDate.getMonth();
let dayna = thisDate.getDate();
let wkday = thisDate.getDay(); //0:Sun,1:Mon

let thisMany = daysInMonty(monty,thisDate.getFullYear());
let thisAhead = (kate)=>{return thisDate.setDate(dayna + kate - wkday);}
const months = ["January","February","March","April","May","June","July",
"August","September","October","November","December"];
const assign = ["Me","Boss","Client"];
let fiveDays = new Date(thisAhead(5)); 

const mainDiv = document.getElementById("root");
mainDiv.innerHTML = `<h2>Doing Projects</h2><div class="tasky"><h3>&nbsp;This week: ${thisDate.getFullYear()} ${months[monty]} ${dayna-wkday+1}(Mon) ~ ${months[fiveDays.getMonth()]} ${fiveDays.getDate()}(Fri)</h3><p><button onclick='openNav()'>Add Task</button></p></div>`;

let thisId= "";

function daysInMonty(month,year){
    return new Date(year,month,0).getDate();
}

function addDays2Date(objDate, intDays){
    let addMillis = (intDays*24)*60*60*1000;
    return new Date(objDate+addMillis);
}

(async ()=>{
    const gotTasks = await get_tasks();
    const tab = document.createElement("table");
    let stat_val="",this_class="",stat_width="",stg_stat="";
    let txt = "<tr><th>Name</th><th>Stage</th><!--th>Implement</th><th>Status</th--><th>Work hours</th><th>Assigned</th><th>Actions</th></tr>";
    let gabi = addDays2Date(Date.now(),8-wkday);
    let oli = addDays2Date(Date.now(),12-wkday);

    if (gotTasks === undefined || gotTasks.length == 0){
       disp_msg("503: Server Down. Contact Admin","#fadbd0");
       return
    }else{
        //for (let jdx =0;jdx < gotTasks.length;jdx++){}
        for (let idx=0;idx < gotTasks[0].length; idx++){
        if (gotTasks[0][idx]['stat'] == 100){
            stat_val="done";this_class="done_task";
            stat_width="100";
        }else if(gotTasks[0][idx]['stat'] == 0){
            stat_val="to-do";this_class="todo_task";
            stat_width="100";
        }else{
            stat_val="doing";this_class="doing_task";
            stat_width=gotTasks[0][idx]['stat'];
        }
        txt += `<tr><td><span>${gotTasks[0][idx]['name']}</span><div class='grey-fill float_left'><div class='${this_class}' style="width:${stat_width}%;height:12px;border-radius:5px;"></div></div><div class="col20 float_left">${gotTasks[0][idx]['stat']}%</div></td><td><span>${gotTasks[0][idx]['stage']}</span><br><span>${gotTasks[0][idx]['days']}</span></td><!--td>${gotTasks[0][idx]['days']}</td><td class="no_pad"><div class="grey-fill"><div id="StatBar" class="${this_class}" style="width:${stat_width}%">${stat_val}</div></div></td--><td class="centered">${gotTasks[0][idx]['work_hours']}</td><td><span>${gotTasks[0][idx]['assign']}</span><br><span>${gotTasks[0][idx]['received']}</span></td><td><button class="update" onclick="edit_book('${gotTasks[0][idx]['id']}')">Update</button><button class="delete" onclick="del_book('${gotTasks[0][idx]['id']}')">Delete</button></td></tr>`;
        }//idx loop
    }
    
    tab.innerHTML = txt;
    mainDiv.appendChild(tab);

    /* attempts to fix date
    let gabi = dayna - wkday + 8; //Mon 24-2+8 = 29
    let oli = dayna - wkday + 12; //Fri 24-2+12 = 33
    new Date(thisDate.getFullYear(),thisDate.getMonth(),dayna+12-wkday);*/
    
    txt = `<div class="tasky"><h3>&nbsp;Next week: ${thisDate.getFullYear()} ${months[gabi.getMonth()]} ${gabi.getDate()}(Mon) ~ ${months[oli.getMonth()]} ${oli.getDate()}(Fri)</h3><p><button onclick='openNav()'>Add Task</button></p></div>`;
    const nxtSec = document.createElement("section");
    nxtSec.innerHTML = txt;
    const tab2 = document.createElement("table");
    stat_val="",this_class="";
    txt = "<tr><th>Name</th><th>Stage</th><!--th>Implement</th><th>Status</th--><th>Work hours</th><th>Assigned</th><th>Actions</th></tr>";
    for (let idx=0;idx < gotTasks[1].length; idx++){
        console.log("status",gotTasks[1][idx]['stat']);
        if (gotTasks[1][idx]['stat'] == 100){
            stat_val="done";this_class="done_task";
        }else if(gotTasks[1][idx]['stat'] == 0){
            stat_val="to-do";this_class="todo_task";
        }else{stat_val="doing";this_class="doing_task";}
       stg_stat = assign[0];
       if (gotTasks[1][idx]['stage'].includes("Review"))
           stg_stat = assign[1];
       if (gotTasks[1][idx]['stage'].includes("Release"))
           stg_stat = assign[2];
        txt += `<tr><span><td>${gotTasks[1][idx]['name']}</span><div class='grey-fill float_left'><div class='${this_class}' style="width:${gotTasks[1][idx]['stat']}%;height:12px;border-radius:5px;"></div></div><div class="col20 float_left">${gotTasks[1][idx]['stat']}%</div>
       </td><td><span>${gotTasks[1][idx]['stage']}</span><br><span>${gotTasks[1][idx]['days']}</span></td>
       <!--td class="no_pad"><div id="StatBar" class="${this_class}">${stat_val}</div></td--><td class="centered">${gotTasks[1][idx]['work_hours']}</td><td><span>${gotTasks[1][idx]['assign']}</span><br><span>${gotTasks[1][idx]['received']}</span></td><td><button class="update" onclick="edit_book('${gotTasks[1][idx]['id']}')">Update</button><button class="delete" onclick="del_book('${gotTasks[1][idx]['id']}')">Delete</button></td></tr>`;
    }
    tab2.innerHTML = txt;
    nxtSec.appendChild(tab2);
    mainDiv.appendChild(nxtSec);
})();

async function get_tasks(){
    try {
        const response = await fetch(task_url);
        const data = await response.json();
        // console.log("got data",data);
        return [data.tasks,data.next_tasks];
    } catch (error) {
        console.log("503: Server is down or in maintenance");
        return [];
    }
}

function add_task(postData){
    /* Post to server side 
    this_task,this_stage,these_days,this_progress,this_many,this_date
    const postData = {
        name: this_task, stage: this_stage,
        days: these_days, stat: this_progress,
        work_hours: this_many, received: this_date,
        id: self.crypto.randomUUID()
    }*/
    let stat_val="",this_class="",stat_width="";
    postData['id'] = self.crypto.randomUUID();
    fetch(task_url,{
        method: "POST",
        body: JSON.stringify(postData),
        headers:{
            "Content-type": "application/json;charset=UTF-8"
        }
    })
    .then((response)=>response.json())
    .then((json)=>console.log(json));
    /* Update client-side */
    if (postData['stat'] == 100){
        stat_val="done";this_class="done_task";stat_width="100";
    }else if(postData['stat'] == 0){
        stat_val="to-do";this_class="todo_task";stat_width="100";
    }else{
        stat_val="doing";this_class="doing_task";
        stat_width=postData['stat'];
    }
    const trEl = document.createElement("TR");
    trEl.innerHTML = `<td><span>${postData['name']}</span><div class='grey-fill float_left'><div class='${this_class}' style="width:${stat_width}%;height:12px;border-radius:5px;"></div></div><div class="float_left">${postData['stat']}%</div></td><td><span>${postData['stage']}</span><br><span>${postData['days']}</span></td><!--td class="no_pad"><div class="grey-fill"><div id="StatBar" class="${this_class}" style="width:${stat_width}%">${stat_val}</div></div></td--><td class="centered">${postData['work_hours']}</td><td>${postData['received']}</td><td><button class="update" onclick="edit_book('${postData['id']}')">Update</button><button class="delete" onclick="del_book('${postData['id']}')">Delete</button></td>`;
   
    document.getElementsByTagName("tbody")[0].appendChild(trEl);
    //console.log("new item",tab,trEl);
}

function del_book(taskId){
    /*DEL data saved in RAM*/
    const path = `${task_url}/${taskId}`;
    fetch(path, {
        method: "DELETE",
        body: '',
        headers: { "Content-Type": "application/json; charset=UTF-8"}
    });
    /* Hide element from ui */
    const delBtn = document.getElementsByClassName("delete");
    for (let idx=0;idx < delBtn.length;idx++){
        if (delBtn[idx].outerHTML.includes(taskId)){
            console.log("Bye bye",delBtn[idx].outerHTML);
            const taskParent = delBtn[idx].parentElement.parentElement;
            // console.log("parent",task);
            disp_msg(`Bye bye ${taskParent.firstChild.innerText}`);
            taskParent.remove();
            // task.style.display = "none";
        }
    }
}

function disp_msg(this_msg){
   /* must add a timer */
   let topp = document.getElementById('top_msg');
   topp.style.backgroundColor = degree;
   topp.style.display = "block";
   topp.innerHTML = this_msg;
}

async function edit_book(taskId){
    const data = await get_tasks();
    console.log("Editing...",taskId);
    mainDiv.appendChild(add_form("Edit task",true));
    //openNav();
    let idx = 0;
    // must find the task index
    for (let jdx = 0; jdx < data[0].length; jdx++){
        /*if (Object.hasOwnProperty(key)){}*/
        if (data[0][jdx]['id'] == taskId){
            idx = jdx;
            console.log("thisIdx",idx);
            break;
        }
    }
    // console.log("thisData",data[idx]);
    document.getElementById('fname').value = data[0][idx]['name'];
    let selStg = document.getElementById('fstage');
    selStg.options[selStg.selectedIndex].text = data[0][idx]['stage'];
    document.getElementById('fweek').value = data[0][idx]['days'];
   
    let slide = document.getElementById("fstat");
    slide.value = data[0][idx]['stat'];
    let slide_out = document.getElementById("rngVal")
    slide_out.textContent = slide.value;
    // document.getElementById('rngVal').value = data[0][idx]['stat'];
 
    document.getElementById('fhours').value = data[0][idx]['work_hours'];
    document.getElementById('farrive').value = data[0][idx]['received'];
    document.getElementById('fassign').value = data[0][idx]['assign'];
    // openNav();
    slide.addEventListener("input",(ev)=>{slide_out.textContent = ev.target.value;});
    thisId = taskId; //Updated id
}
 
function putData(){
    // Update a record and PUT to server
    let taskId = thisId;
    let selStg = document.getElementById('fstage');
    let workHours = document.getElementById('fhours').value;
    if (workHours == ""){ workHours = "0"; }
    const putData = {
        id: taskId,
        name: document.getElementById('fname').value,
        stage: selStg.options[selStg.selectedIndex].text,
        days: document.getElementById('fweek').value,
        stat: document.getElementById('fstat').value,
        // read: document.getElementById('book_read').checked,
        work_hours: workHours,
        received: document.getElementById('farrive').value,
        assign: document.getElementById('fassign').value,
        //id: self.crypto.randomUUID()
    };
    const path = `${task_url}/${taskId}`;
    fetch(path, {
        method: "PUT",
        body: JSON.stringify(putData),
        headers: {"Content-type": "application/json;charset=UTF-8"}
    })
    .then((response)=>response.json())
    .then((json)=>console.log(json));
    closeNav();
    // Updating the GUI without reloading the page 2023-09-27
    const editItem = document.getElementsByClassName("update");
    let stat_val="",this_class="",stat_width="";
    for(let idx = 0;idx < editItem.length; idx++){
        if (editItem[idx].outerHTML.includes(bookId)){
            console.log(taskId,"Edited");
            const thisTask = editItem[idx].parentElement.parentElement;
            if (putData['stat'] == 100){
                stat_val="done";this_class="done_task";stat_width="100";
            }else if(putData['stat'] == 0){
                stat_val="to-do";this_class="todo_task";stat_width="100";
            }else{
                stat_val="doing";this_class="doing_task";
                stat_width=putData['stat'];
            }
            thisTask.innerHTML = `<td><span>${putData.name}</span><div class='grey-fill float_left'><div class='${this_class}' style="width:${stat_width}%;height:12px;border-radius:5px;"></div></div><div class="col20 float_left">${putData['stat']}%</div></td><td><span>${putData.stage}</span><br><span>${putData.days}</span></td><!--td class="no_pad"><div class="grey-fill"><div id="StatBar" class="${this_class}" style="width:${stat_width}%">${stat_val}</div></div></td--><td class="centered">${putData.work_hours}</td><td><span>${putData.assign}</span><br><span>${putData.received}</span></td><td><button class="update" onclick="edit_book('${taskId}')">Update</button><button class="delete" onclick="del_book('${taskId}')">Delete</button></td>`;
        }
    }
}
 
function add_form(thisTitle="Add a new task",edit=false){
    console.log(thisTitle,edit);
    const formDiv = document.createElement("section");
    formDiv.id = "addBook";
    formDiv.classList.add("modal");
    //formDiv.innerHTML = "<h3>Add a new book</h3>";
    //let txt = "";
    let buttons = "<input type='button' value='Create task' onclick='get_form()'><!--input type='button' value='Save' onclick='putData()' disabled-->";
    if (edit){
        buttons = "<!--input type='button' value='Create task' onclick='get_form()' disabled--><input type='button' value='Update task' onclick='putData()'>";  
    }
    let listy = '<datalist id="progres"><option value="0" label="0"></option><option value="20" label="20"></option><option value="40" label="40"></option><option value="60" label="60"></option><option value="80" label="80"></option><option value="100" label="100"></option></datalist>';
    let statThis = '<option value="to-do">To do</option><option value="doing">In progress</option><option value="stuck">Stuck</option><option value="done">Done</option>';
    let job_stage ='<option value="learn">e-Learning</option><option value="simulation">Simulation</option><option value="building">Building Tool</option><option value="testing">Testing</option><option value="docs">資料作成</option><option value="edit">資料修正</option><option value="review">In Review</option><option value="release">Release</option>';
    formDiv.innerHTML = "<div class='modal-content'><div><h3>"+ thisTitle + "</h3><span class='close' onclick=closeNav()>&times;</span></div><div class='pad10'><form><label for='fname'>Task</label><br><input type='text' id='fname' name='fname'><br><br>" + 
   "<div class='col50 float_left'><label for='fstage'>Stage</label><br><select id='fstage'><option value=''>--Please choose an stage--</option>" + job_stage + 
   "</select></div><div class='col50 float_left'><!--br><br--><label for='fweek'>Implement</label><br><input type='date' id='fweek' name='fweek'><br><br></div><label for='fstat'>Status [<output id='rngVal'></output>%]</label><br><input type='range' min='0' max='100' value='50' step='5' id='fstat' name='fstat'><br><br>" + 
   "<div class='col50 float_left'><label for='fhours'>Worked hours</label><br><input type='number' id='fhours' name='fhours' min='0' max='100'></div><div class='col50 float_left'><!--br><br--><label for='farrive'>Arrived</label><br><input type='date' id='farrive' name='farrive'><br><br></div><label for='fassign'>Assignee</label><br><input type='text' id='fassign' name='fassign'><br><br>" + buttons + "</form></div></div>";
    /*<input type='checkbox' id='book_read' name='book_read' value='Read?'><label for='book_read'>Read?</label> */
    window.onclick = function(ev){
        if (ev.target == formDiv){
            formDiv.style.display = "none";
        }
    }
    return formDiv;
}
 
function get_form(){
    let selStg = document.getElementById("fstage");
    const objData = {
        name: document.getElementById("fname").value,
        stage: selStg.options[selStg.selectedIndex].text,
        days: document.getElementById("fweek").value,
        stat: document.getElementById("fstat").value,
        work_hours: document.getElementById("fhours").value,
        received: document.getElementById("farrive").value,
        assign: document.getElementById("fassign").value
    };
    console.log(objData['name'],objData['days'],objData['assign']);
    add_task(objData);
    closeNav();
}

function closeNav(){
    /*
    openNav creates a new elem (section) every time, by setting
    document.getElementById('addBook').style.display = "none";
    it hides the elem and cannot modify it*/
    document.getElementById('addBook').remove();
}
function openNav(){
    mainDiv.appendChild(add_form());
    const thisDiv = document.getElementById('addBook');
    thisDiv.style.display = "block";
    let slider = document.getElementById("fstat");
    let slider_out = document.getElementById("rngVal")
    slider_out.textContent = slider.value;
    console.log("stage",slider.value);
    slider.addEventListener("input",(ev)=>{slider_out.textContent = ev.target.value;});
    // document.querySelector("datalist").style.display="flex";
}

let formItems=[];
function validate(e){
    const inps=document.querySelectorAll('input');
    const lbls=document.querySelectorAll('label');

    let obj={};
    obj.label=lbls[i];
    obj.input=inps[i];
    formItems.push(obj);
    const errorLst = document.querySelector('.err ul');
    errorLst.innerHTML='';
    for(let kdx=0;kdx<formItems.length;kdx++){
        let testIt=formItems[kdx];
    }
}
/*
<div id="StatBar">texty</div>
#StatBar{
    width:10%;
    height:30px;
    background-color:black;
    text-align:center;
    line-height:30px;
    color:white;
}
*/
let j=0;
function anim_bar(){
    if (j==0){
        j =1;
        let elem= document.getElementById("StatBar");
        let width=10;
        let inter_val=setInterval(framy, 10);
        function framy(){
            if (width>=100){
                clearInterval(inter_val);
                j=0;
            }else{
                width++;
                elem.style.width = width + "%";
                elem.innerHTML = "in progress, done,";
            }
        }
    }
}
/*async function remove_item(){
    // currently not working
    const delBtn = document.getElementsByClassName("delete");
    let jdx = 0;
    const data = await get_tasks();
    for (let idx= 0;idx<delBtn.length;idx++){
        delBtn[idx].onclick = function(){
            const task = this.parentElement.parentElement;
            task.style.display = "none";
            for (let kdx = 0; kdx < data.length; kdx++) {
                if(data[kdx]['name'] == task.childNodes[0].innerHTML){
                    jdx = kdx;
                }
            }
            console.log("Bye bye ",task.childNodes[0].innerHTML);
        }
    }
    del_book(data[jdx]['id']);
}*/

