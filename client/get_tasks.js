const books_url = "http://127.0.0.1:3872/tasks";
const thisDate = new Date();
let monty = thisDate.getMonth();
let dayna = thisDate.getDate();
let wkday = thisDate.getDay(); //0:Sun,1:Mon

const months = ["January","February","March","April","May","June","July","August"];
const mainDiv = document.getElementById("root");
mainDiv.innerHTML = `<div id='top_msg'><p>These dreams go on when I close my eyes</p></div><h2>Doing Projects</h2><h2>week: ${thisDate.getFullYear()} ${months[monty]} ${dayna-wkday+1}(Mon) ~ ${months[monty]} ${dayna+5-wkday}(Fri)</h2><p><button onclick='openNav()'>Add Task</button></p>`;

let thisId= "";

(async ()=>{
    const gotTasks = await get_tasks();
    const tab = document.createElement("table");
    let stat_val="",this_class="";

    let txt = "<tr><th>Name</th><th>Stage</th><th>Implement</th><th>Status</th><th>Worked hours</th><th>Received</th><th></th></tr>";
    for (let idx=0;idx < gotTasks.length; idx++){
        if (gotTasks[idx]['stat'] == 100){
            stat_val="done";this_class="done_task";
        }else if(gotTasks[idx]['stat'] == 0){
            stat_val="to-do";this_class="todo_task";
        }else{stat_val="doing";this_class="doing_task";}
        txt += `<tr><td>${gotTasks[idx]['name']}</td><td>${gotTasks[idx]['stage']}</td><td>${gotTasks[idx]['days']}</td><td class="no_pad"><div id="StatBar" class="${this_class}">${stat_val}</div></td><td>${gotTasks[idx]['work_hours']}</td><td>${gotTasks[idx]['received']}</td><td><button class="update" onclick="edit_book('${gotTasks[idx]['id']}')">Update</button><button class="delete" onclick="del_book('${gotTasks[idx]['id']}')">Delete</button></td></tr>`;
    }
    tab.innerHTML = txt;
    mainDiv.appendChild(tab);
    //remove_item();
})();

async function get_tasks(){
    const response = await fetch(books_url);
    const data = await response.json();
    console.log("got data",data);
    return data.tasks;
}

function add_book(this_task,this_stage,these_days,this_progress,this_many,this_date){
    /* Post to server side */
    let stat_val="",this_class="";
    const postData = {
        name: this_task,
        stage: this_stage,
        days: these_days,
        stat: this_progress,
        work_hours: this_many,
        received: this_date,
        id: self.crypto.randomUUID()
    }
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
        stat_val="done";this_class="done_task";
    }else if(postData['stat'] == 0){
        stat_val="to-do";this_class="todo_task";
    }else{
        stat_val="doing";this_class="doing_task";}
    const trEl = document.createElement("TR");
    trEl.innerHTML = `<td>${postData['name']}</td><td>${postData['stage']}</td><td>${postData['days']}</td><td class="no_pad"><div id="StatBar" class="${this_class}">${stat_val}</div></td><td>${postData['work_hours']}</td><td>${postData['received']}</td><td><button class="update" onclick="edit_book('${postData['id']}')">Update</button><button class="delete" onclick="del_book('${postData['id']}')">Delete</button></td>`;
   
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
        if (delBtn[idx].outerHTML.includes(bookId)){
            console.log("Bye bye",delBtn[idx].outerHTML);
            const task = delBtn[idx].parentElement.parentElement;
            task.remove();
            // task.style.display = "none";
        }
    }
}

async function edit_book(taskId){
    const data = await get_tasks();
    console.log("Editing...",bookId);
    mainDiv.appendChild(add_form("Edit task",true));
    //openNav();
    let idx = 0;
    // must find the index of book
    for (let jdx = 0; jdx < data.length; jdx++){
        /*if (Object.hasOwnProperty(key)){}*/
        if (data[jdx]['id'] == taskId){
            idx = jdx;
            console.log("thisIdx",idx);
            break;
        }
    }
    // console.log("thisData",data[idx]);
    document.getElementById('fname').value = data[idx]['name'];
    document.getElementById('fstage').value = data[idx]['stage'];
    document.getElementById('fweek').value = data[idx]['days'];
    document.getElementById('fstat').value = data[idx]['stat'];
    document.getElementById('fhours').value = data[idx]['work_hours'];
    document.getElementById('farrive').value = data[idx]['received'];
    // openNav();
    thisId = taskId; //Updated id
}
 
function putData(){
    // Update a record and PUT to server
    let bookId = thisId;
    const putData = {
        id: taskId,
        name: document.getElementById('fname').value,
        stage: document.getElementById('fstage').value,
        days: document.getElementById('fweek').value,
        stat: document.getElementById('fstat').value,
        // read: document.getElementById('book_read').checked,
        work_hours: document.getElementById('fhours').value,
        received: document.getElementById('farrive').value,
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
    for(let idx = 0;idx < editItem.length; idx++){
        if (editItem[idx].outerHTML.includes(bookId)){
            console.log(taskId,"Edited");
            const thisTask = editItem[idx].parentElement.parentElement;
            if (putData['stat'] == 100){
                stat_val="done";this_class="done_task";
            }else if(putData['stat'] == 0){
                stat_val="to-do";this_class="todo_task";
            }else{
                stat_val="doing";this_class="doing_task";}
            thisTask.innerHTML = `<td>${putData.name}</td><td>${putData.stage}</td><td>${putData.days}</td><td class="no_pad"><div id="StatBar" class="${this_class}">${stat_val}</div></td><td>${putData.work_hours}</td><td>${putData.received}</td><td><button class="update" onclick="edit_book('${taskId}')">Update</button><button class="delete" onclick="del_book('${taskId}')">Delete</button></td>`;
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
    let buttons = "<input type='button' value='Submit' onclick='get_form()'><input type='button' value='Save' onclick='putData()' disabled>";
    if (edit){
        buttons = "<input type='button' value='Submit' onclick='get_form()' disabled><input type='button' value='Save' onclick='putData()'>";  
    }
    let listy = '<datalist id="progres"><option value="0" label="0"></option><option value="20" label="20"></option><option value="40" label="40"></option><option value="60" label="60"></option><option value="80" label="80"></option><option value="100" label="100"></option></datalist>';
    formDiv.innerHTML = "<div class='modal-content'><div><h3>"+ thisTitle + "</h3><span class='close' onclick=closeNav()>&times;</span></div><div><form><label for='fname'>Task</label><br><input type='text' id='fname' name='fname'><br><br>" +
    "<label for='fstage'>Stage</label><br><input type='text' id='fstage' name='fstage'><br><br><label for='fweek'>Timeline</label><br><input type='text' id='fweek' name='fweek'><br><br><label for='fstat'>Status [<output id='rngVal'></output>%]</label><br><input type='range' min='0' max='100' value='50' step='10' id='fstat' name='fstat' list='progres'><br>" + listy + "<br><label for='fhours'>Worked hours</label><br><input type='text' id='fhours' name='fhours'><br><br><label for='farrive'>Arrived</label><br><input type='text' id='farrive' name='farrive'><br><br>" + buttons + "</form></div></div>";
    /*<input type='checkbox' id='book_read' name='book_read' value='Read?'><label for='book_read'>Read?</label> */
    window.onclick = function(ev){
        if (ev.target == formDiv){
            formDiv.style.display = "none";
        }
    }
    return formDiv;
}
 
function get_form(){
    const name = document.getElementById("fname").value;
    const timeline = document.getElementById("fweek").value;
    // const read = document.getElementById("book_read").checked;
    const stag = document.getElementById("fstage").value;
    const hours = document.getElementById("fhours").value;
    const arrived = document.getElementById("farrive").value;
    const stat = document.getElementById("fstat").value;
    console.log(name,timeline);
    add_book(name,stag,timeline,stat,hours,arrived);
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
    document.querySelector("datalist").style.display="flex";
}
 
async function remove_item(){
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

