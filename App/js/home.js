var dateFormat = require('dateformat');
if (typeof Store === 'undefined') {
    var Store = require('../modules/store');
    var store = new Store({
        configName: 'user-preferences'
    });
}

let xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
        let dump = document.getElementById("eventlog");
        let result = JSON.parse(this.responseText);

        if (!result.err) {
            let logs = result.logs;
            // Creating the Event log!
            dump.innerHTML = "";
            if (logs.length === 0) {
                let div = document.createElement("span");
                div.setAttribute('class', 'log');
                div.style.textAlign = 'center';
                div.style.padding = '10px 0';
                div.innerHTML = "No Activity Yet!";
                dump.appendChild(div);
            } else {
                // Add all results
                for (i = 0; i < logs.length; i++) {
                    let div = document.createElement("span");
                    div.setAttribute('class', 'log');
                    let time = dateFormat(logs[i].created, "ddd, mmm dS, yyyy") + " at " + dateFormat(logs[i].created, "h:MM TT");
                    if (logs[i].title !== null) {
                        div.innerHTML = logs[i].name_first + " " + logs[i].name_last + " created an issue called <code>" + logs[i].title + "</code> on " + time + "</br><a onclick='view(\"issue\", " + logs[i].id + ")'>View Issue</a>";
                    } else {
                        div.innerHTML = logs[i].name_first + " " + logs[i].name_last + " wrote a journal on " + time;
                    }
                    dump.appendChild(div);
                }
            }
        } else {
            let div = document.createElement("span");
            div.setAttribute('class', 'log');
            div.style.textAlign = 'center';
            div.style.padding = '10px 0';
            div.innerHTML = "A error occurred!";
            dump.appendChild(div);
        }
        for (i = 0; i < Scrolls.length; i++) {
            Scrolls[i].resetValues();
        }
    }
};
xhttp.open("POST", store.get("url") + "/log/activity/all", true);
xhttp.setRequestHeader("Content-Type", "application/json");
xhttp.send(JSON.stringify(store.getUser()));

let grabProjects = new XMLHttpRequest();
grabProjects.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
        let dump = document.getElementById("projects");
        let result = JSON.parse(this.responseText);

        if (!result.err) {
            let projects = result.result.projects;
            dump.innerHTML = "";
            if (projects.length === 0) {
                let span = document.createElement("span");
                span.setAttribute('style', 'display: block; text-align: center; padding: 10px;');
                span.innerHTML = "You haven't joined any projects yet!";
                dump.appendChild(span);
            } else {
                // Add all results
                for (i = 0; i < projects.length; i++) {
                    let a = document.createElement("a");
                    a.setAttribute('onclick', 'view("project", ' + projects[i].project_id + ')');
                    a.innerHTML = projects[i].name;

                    dump.appendChild(a);
                }
            }
        } else {
            let div = document.createElement("span");
            div.style.textAlign = 'center';
            div.innerHTML = result.err.message;
            dump.appendChild(div);
        }
        for (i = 0; i < Scrolls.length; i++) {
            Scrolls[i].resetValues();
        }
    }
};
grabProjects.open("POST", store.get("url") + "/projects/current", true);
grabProjects.setRequestHeader("Content-Type", "application/json");
grabProjects.send(JSON.stringify(store.getUser()));