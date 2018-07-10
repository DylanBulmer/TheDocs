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