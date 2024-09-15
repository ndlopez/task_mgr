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
