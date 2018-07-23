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
        dump.innerHTML = "";
        if (list.length === 0) {
            // if there is no list.
            let item = document.createElement("item");
            item.innerHTML = "No Activity Yet!";
            dump.appendChild(item);
        } else {
            // Add all results
            for (i = 0; i < list.length; i++) {
                let item = document.createElement("item");
                item.setAttribute("id", list[i].id)
                item.setAttribute("created", list[i].created)
                item.setAttribute("project_id", list[i].project_id)

                let input = document.createElement("input");
                input.setAttribute('type', 'checkbox');
                input.setAttribute('onchange', "onUpdate(this)");

                if (list[i].completed != null) {
                    input.checked = true;
                }

                let span = document.createElement('span');
                span.innerHTML = list[i].description;

                let a = document.createElement('a');
                a.setAttribute("onclick", "view('project', " + list[i].project_id + ")");
                a.innerText = "Project";

                item.appendChild(input);
                item.appendChild(span);
                item.appendChild(a);

                dump.appendChild(item);
            }

            let item = document.createElement("item");
            let span = document.createElement("span");
            span.innerText = "Add new item.";
            item.appendChild(span);
            item.setAttribute("onclick", "onNew(this)");
            item.setAttribute("class", "add");
            dump.appendChild(item);
        }
    }
};
grabList.open("POST", store.get("url") + "/todo", true);
grabList.setRequestHeader("Content-Type", "application/json");
grabList.send(JSON.stringify({
    profile: store.getUser(),
    opts: {
        type: 'project',
        id: 1
    }
}));

/**
 * 
 * @param {Element} element
 */
let onNew = (element) => {

    element.setAttribute("class", "");
    element.setAttribute('onclick', '');
    element.setAttribute('style', 'padding: 0 10px 10px 10px;');
    element.innerHTML = "";

    let input = document.createElement("input");
    input.setAttribute('id', 'newItem');
    input.setAttribute('placeholder', 'Enter new task.');
    input.setAttribute('style', 'display: inline-block; vertical-align: middle; padding: 5px 10px; width: calc(100% - 50px); height: 32px; line-height: 32px; border-radius: 5px 0 0 5px;');
    input.setAttribute('type', 'text');

    let a = document.createElement("a");
    a.setAttribute('style', 'display: inline-block; vertical-align: middle; padding: 5px; width: 40px; height: 22px; line-height: 22px; text-align: center; background-color: #3369ff; color: #fff; border-radius: 0 5px 5px 0;');
    a.setAttribute('onclick', 'onAdd(this)');
    a.innerText = "Add";

    element.appendChild(input);
    element.appendChild(a);
};

/**
 * 
 * @param {Element} element
 */
let onAdd = (element) => {

    let newTodoItem = document.getElementById('newItem');

    if (newTodoItem.value !== '') {
        let req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let dump = document.getElementsByTagName("todo")[0];
                let result = JSON.parse(this.responseText);

                if (result.err) {
                    // if there is an error
                    sendMessage('error', 'todo', result.err.message);
                } else {
                    let newItem = result.result.item;

                    // remove 'create new item' element
                    dump.removeChild(dump.childNodes[dump.childNodes.length - 1]);

                    // create the new item
                    let item = document.createElement("item");
                    item.setAttribute("id", newItem.id)
                    item.setAttribute("created", newItem.created)
                    item.setAttribute("project_id", newItem.project_id)

                    let input = document.createElement("input");
                    input.setAttribute('type', 'checkbox');
                    input.setAttribute('onchange', "onUpdate(this)");

                    let span = document.createElement('span');
                    span.innerHTML = newItem.description;

                    let a = document.createElement('a');
                    a.setAttribute("onclick", "view('project', " + newItem.project_id + ")");
                    a.innerText = "Project";

                    item.appendChild(input);
                    item.appendChild(span);
                    item.appendChild(a);

                    dump.appendChild(item);

                    // Re-create the add new item button
                    item = document.createElement("item");
                    item.setAttribute("onclick", "onNew(this)");
                    item.setAttribute("class", "add");

                    span = document.createElement("span");
                    span.innerText = "Add new item.";

                    item.appendChild(span);

                    dump.appendChild(item);

                    sendMessage('success', 'todo', 'Your task has been added!');
                }
            }
        };
        let request = {
            profile: store.getUser(),
            item: {
                project_id: document.getElementById('project').value,
                description: escapeHTML(newTodoItem.value)
            }
        }
        req.open("POST", store.get("url") + "/todo/new", true);
        req.setRequestHeader("Content-Type", "application/json");
        req.send(JSON.stringify(request));
    } else {
        sendMessage('error', 'todo', 'New task field cannot be empty!');
    }
};

/**
 * 
 * @param {Element} element
 */
let onUpdate = (element) => {
    let item = {
        id: element.parentElement.id,
        is_done: (element.checked) ? 1 : 0
    };

    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let dump = document.getElementsByTagName("todo")[0];
            let result = JSON.parse(this.responseText);

            if (result.err) {
                // if there is an error
                sendMessage('error', 'todo', result.err.message);
            } else {
                sendMessage('success', 'todo', 'Your task has been updated!');
            }
        }
    };
    let request = {
        profile: store.getUser(),
        item: item
    }
    req.open("POST", store.get("url") + "/todo/update", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(request));
}