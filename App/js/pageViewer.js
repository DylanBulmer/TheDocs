var hljs = require('highlight.js');
var md = require('markdown-it')({
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre class="hljs"><code>' +
                    hljs.highlight(lang, str, true).value +
                    '</code></pre>';
            } catch (__) { return ''; }
        }

        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
});
var dateFormat = require('dateformat');
if (typeof Store === 'undefined') {
    var Store = require('../modules/store');
    var store = new Store({
        configName: 'user-preferences'
    });
}

var cpage = "c_main";
var viewPage = function viewPage(page, id) {
    document.getElementById(cpage).style.display = "none";
    document.getElementById(page).style.display = "block";
    cpage = page;

    if (page === "c_pre") { // Updating preview page
        let title = document.getElementById("p_title");
        let desc = document.getElementById("p_desc");
        let url = document.getElementById("p_url");
        let keywords = document.getElementById("p_keywords");
        let solution = document.getElementById("p_solution");
        let project = document.getElementById('p_project');
        let date = document.getElementById('p_date');

        if (document.getElementById('n_project').value === 'new') {
            project.innerHTML = document.getElementById('n_pname').value;
        } else {
            project.innerHTML = document.getElementById('n_project').selectedOptions[0].innerText;
        }

        title.innerHTML = document.getElementById("n_title").value;
        desc.innerHTML = document.getElementById("n_desc").value;
        url.innerHTML = document.getElementById("n_url").value;
        keywords.innerHTML = document.getElementById("n_keywords").value;
        solution.innerHTML = md.render(document.getElementById("n_solution").value);
        date.innerHTML = document.getElementById("n_date").innerText;
    } else if (page === "c_doc") { // get document page
        let title = document.getElementById("d_title");
        let desc = document.getElementById("d_desc");
        let url = document.getElementById("d_url");
        let keywords = document.getElementById("d_keywords");
        let solution = document.getElementById("d_solution");
        let project = document.getElementById('d_project');
        let name = document.getElementById('d_name');
        let date = document.getElementById('d_date');

        // Getting The Doc
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let result = JSON.parse(this.responseText);

                // Set date and time
                let timestamp = new Date(result.created);
                date.innerText = dateFormat(timestamp, "ddd, mmm dS, yyyy") + " at " + dateFormat(timestamp, "h:MM TT");

                title.innerHTML = result.title;
                desc.innerHTML = result.description;
                url.innerHTML = "<a href='" + result.url + "' target='_BLANK'>" + result.url + "</a>";
                keywords.innerHTML = "";
                project.innerHTML = "<a onclick='view(\"project\", " + result.project_id + ")'>" + result.project + "</a>";
                name.innerHTML = result.user.name_first + " " + result.user.name_last;

                for (let i = 0; i < result.keywords.length; i++) {
                    if (i === result.keywords.length - 1) {
                        keywords.innerHTML += result.keywords[i];
                    } else {
                        keywords.innerHTML += result.keywords[i] + ", ";
                    }
                }

                // Get solution from buffer;
                solution.innerHTML = md.render(new Buffer(result.solution).toString('utf8'));
            }
        };
        xhttp.open("POST", store.get("url") + "/doc", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify({ "id": id, "profile": store.getUser() }));

    } else if (page === "c_new") { // Updating New Doc Page
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let dump = document.getElementById("n_projects");
                let result = JSON.parse(this.responseText);

                dump.innerHTML = "";
                if (result.length === 0) {
                    let opt = document.createElement("option");
                    opt.innerHTML = "No Projects Yet";
                    dump.appendChild(opt);
                } else {
                    // Add all results
                    for (i = 0; i < result.length; i++) {
                        let opt = document.createElement("option");
                        opt.innerHTML = result[i].name;
                        opt.setAttribute("value", "" + result[i].id);
                        if (i === 0) {
                            opt.selected = true;
                        }
                        dump.appendChild(opt);
                    }
                }
            }
            let date = document.getElementById('n_date');
            // Set date and time
            let timestamp = new Date();
            date.innerText = dateFormat(timestamp, "ddd, mmm dS, yyyy") + " at " + dateFormat(timestamp, "h:MM TT");
        };
        xhttp.open("GET", store.get("url") + "/projects", true);
        xhttp.send();
    } else if (page === "c_view") {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let dump = document.getElementById("eventlog");
                let result = JSON.parse(this.responseText);
                let logs = result.logs;
                let project = result.info;

                // Containts for project data
                let title = document.getElementById("p_title");
                let started = document.getElementById("p_date");
                let desc = document.getElementById("p_desc");
                let homepage = document.getElementById("p_homepage");
                let joinBtn = document.getElementById("join_btn");

                // Set date and time
                let timestamp = new Date(project.started);
                started.innerText = dateFormat(timestamp, "ddd, mmm dS, yyyy") + " at " + dateFormat(timestamp, "h:MM TT");

                // Insert data
                title.innerText = project.name;
                desc.innerText = project.description;
                homepage.href = project.homepage;
                homepage.innerText = project.homepage;

                if (project.joined) {
                    joinBtn.innerHTML = "Leave";
                    joinBtn.setAttribute('onclick', 'toggleJoin("leave", ' + project.id + ')');
                } else {
                    joinBtn.innerHTML = "Join";
                    joinBtn.setAttribute('onclick', 'toggleJoin("join", ' + project.id + ')');
                }

                // Grab the TODO list
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
                            item.innerHTML = "There is nothing to do!";
                            dump.appendChild(item);

                            item = document.createElement("item");
                            let span = document.createElement("span");
                            span.innerText = "Add new item.";
                            item.appendChild(span);
                            item.setAttribute("onclick", "onNewTodo(this, "+id+")");
                            item.setAttribute("class", "add");
                            dump.appendChild(item);
                        } else {
                            // Add all results
                            for (i = 0; i < list.length; i++) {
                                let item = document.createElement("item");
                                item.setAttribute("id", list[i].id);
                                item.setAttribute("created", list[i].created);
                                item.setAttribute("project_id", list[i].project_id);

                                let input = document.createElement("input");
                                input.setAttribute('type', 'checkbox');
                                input.setAttribute('onchange', "onUpdateTodo(this)");

                                if (list[i].completed !== null) {
                                    input.checked = true;
                                }

                                let span = document.createElement('span');
                                span.setAttribute('style', 'width: calc(100% - 24px);');
                                span.innerHTML = list[i].description;

                                item.appendChild(input);
                                item.appendChild(span);

                                dump.appendChild(item);
                            }

                            let item = document.createElement("item");
                            let span = document.createElement("span");
                            span.innerText = "Add new item.";
                            item.appendChild(span);
                            item.setAttribute("onclick", "onNewTodo(this, "+id+")");
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
                        id: id
                    }
                }));

                // Creating the Event log!
                dump.innerHTML = "";
                if (logs.length === 0) {
                    let div = document.createElement("span");
                    div.setAttribute('class', 'log');
                    div.style.textAlign = 'center';
                    div.style.padding = '10px 0';
                    div.innerHTML = "No Events Yet!";
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
                for (i = 0; i < Scrolls.length; i++) {
                    Scrolls[i].resetValues();
                }
            }
        };
        xhttp.open("POST", store.get("url") + "/log/project/" + id, true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(store.getUser()));
    }
};

/**
 * 
 * @param {Element} element Element
 * @param {number} id Id of project
 */
let onNewTodo = (element, id) => {

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
    a.setAttribute('onclick', 'onAddTodo(this, '+id+')');
    a.innerText = "Add";

    element.appendChild(input);
    element.appendChild(a);
};

/**
 * 
 * @param {Element} element Element
 * @param {number} id Id of project
 */
let onAddTodo = (element, id) => {

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
                    item.setAttribute("id", newItem.id);
                    item.setAttribute("created", newItem.created);
                    item.setAttribute("project_id", newItem.project_id);

                    let input = document.createElement("input");
                    input.setAttribute('type', 'checkbox');
                    input.setAttribute('onchange', "onUpdateTodo(this)");

                    let span = document.createElement('span');
                    span.setAttribute('style', 'width: calc(100% - 24px);');
                    span.innerHTML = newItem.description;

                    item.appendChild(input);
                    item.appendChild(span);

                    dump.appendChild(item);

                    // Re-create the add new item button
                    item = document.createElement("item");
                    item.setAttribute("onclick", "onNewTodo(this, "+id+")");
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
                project_id: id,
                description: escapeHTML(newTodoItem.value)
            }
        };
        req.open("POST", store.get("url") + "/todo/new", true);
        req.setRequestHeader("Content-Type", "application/json");
        req.send(JSON.stringify(request));
    } else {
        sendMessage('error', 'todo', 'New task field cannot be empty!');
    }
};

/**
 * 
 * @param {Element} element Elements
 */
let onUpdateTodo = (element) => {
    let item = {
        id: element.parentElement.id,
        is_done: element.checked ? 1 : 0
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
    };
    req.open("POST", store.get("url") + "/todo/update", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(request));
};

var toggleJoin = (type, id) => {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let result = JSON.parse(this.responseText);
            let joinBtn = document.getElementById("join_btn");

            if (result.err) {
                console.log(err.message);
            } else {
                if (result.result.hasJoined) {
                    joinBtn.innerHTML = "Leave";
                    joinBtn.setAttribute('onclick', 'toggleJoin("leave", ' + id + ')');
                } else {
                    joinBtn.innerHTML = "Join";
                    joinBtn.setAttribute('onclick', 'toggleJoin("join", ' + id + ')');
                }
            }
        }
    };
    if (type === "join") {
        xhttp.open("POST", store.get("url") + "/project/join/" + id, true);
    } else {
        xhttp.open("POST", store.get("url") + "/project/leave/" + id, true);
    }
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(store.getUser()));
};

var updateChange = function () {
    if (document.getElementById('n_project').value === 'new') {
        document.getElementById('pname').style.display = "inline-block";
    } else {
        if (document.getElementById('pname').style.display === 'inline-block') {
            document.getElementById('pname').style.display = 'none';
        }
    }
};

/* VIEW POP-UP FUNCTION */

const viewPopup = (popup) => {
    switch (popup) {
        case "newProject":
            break;
    }
};

/* VIEW OTHER FUNCTION -- FOR VIEWING ITEMS ON ANOTHER PAGE */

const view = (type, id) => {
    switch (type) {
        case 'issue':
            if (window.location.href.slice(-7) === 'app.pug') {
                viewPage('c_doc', id);
            } else {
                // save this call in the store
                let call = store.get('view') || {};

                call.next = "viewPage('c_doc', " + id + ")";
                call.continue = true;

                store.set('view', call);

                // go to corrent page
                window.location.href = "app.pug";
            }
            break;
        case 'project':
            if (window.location.href.slice(-12) === 'projects.pug') {
                viewPage('c_view', id);
            } else {
                // save this call in the store
                let call = store.get('view') || {};

                call.next = "viewPage('c_view', " + id + ")";
                call.continue = true;

                store.set('view', call);

                // go to corrent page
                window.location.href = "projects.pug";
            }
            break;
        case 'newDoc':
            if (window.location.href.slice(-7) === 'app.pug') {
                viewPage('c_new');
            } else {
                // save this call in the store
                let call = store.get('view') || {};

                call.next = "viewPage('c_new', " + id + ")";
                call.continue = true;

                store.set('view', call);

                // go to corrent page
                window.location.href = "app.pug";
            }
            break;
        case 'newProject':
            if (window.location.href.slice(-12) === 'projects.pug') {
                viewPage('c_newProject', id);
            } else {
                // save this call in the store
                let call = store.get('view') || {};

                call.next = "viewPage('c_newProject', " + id + ")";
                call.continue = true;

                store.set('view', call);

                // go to corrent page
                window.location.href = "projects.pug";
            }
            break;
        case 'newJournal':
            if (window.location.href.slice(-12) === 'journals.pug') {
                //viewPage('c_newJournal', id);
            } else {
                // save this call in the store
                let call = store.get('view') || {};

                //call.next = "viewPage('c_newJournal', " + id + ")";
                //call.continue = true;

                //store.set('view', call);

                // go to corrent page
                window.location.href = "journals.pug";
            }
            break;
    }
};


// CHECK IF CONTINUE === TRUE => DIRECT TO CORRECT AREA; ELSE VIEW MAIN PAGE

(function () {
    let call = store.get('view');

    if (call && call['continue'] === true) {
        eval(call.next);
        call.next = "";
        call.continue = false;

        store.set('view', call);
    } else {
        try {
            document.getElementById(cpage);
            viewPage(cpage);
        } catch (e) { return; }
    }
})();
