var dateFormat = require('dateformat');
if (typeof Store === 'undefined') {
    var Store = require('../modules/store');
    var store = new Store({
        configName: 'user-preferences'
    });
}

let grabList = new XMLHttpRequest();
grabList.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
        let dump = document.getElementsByTagName("todo")[0];
        let result = JSON.parse(this.responseText);
        let list = result.result.list;

        // Creating the list.
        //dump.innerHTML = "";
        if (list.length === 0) {
            // if there is no list.
            let item = document.createElement("item");
            item.innerHTML = "No Activity Yet!";
            dump.appendChild(item);
        } else {
            // Add all results
            for (i = 0; i < list.length; i++) {
                let item = document.createElement("item");
                let input = document.createElement("input");
                input.setAttribute('type', 'checkbox');
                item.appendChild(input);
                item.setAttribute("id", list[i].id)
                item.setAttribute("created", list[i].created)
                item.setAttribute("project_id", list[i].project_id)
                item.innerHTML += "&nbsp;" + list[i].description;
                dump.appendChild(item);
            }

            let item = document.createElement("item");
            let span = document.createElement("span");
            span.innerText = "Add new item.";
            item.appendChild(span);
            item.setAttribute("class", "add");
            dump.appendChild(item);
        }
    }
};
grabList.open("POST", store.get("url") + "/todo", true);
grabList.setRequestHeader("Content-Type", "application/json");
grabList.send(JSON.stringify(store.getUser()));