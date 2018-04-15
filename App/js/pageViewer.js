var hljs = require('highlight.js');
var md = require('markdown-it')({
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre class="hljs"><code>' +
                    hljs.highlight(lang, str, true).value +
                    '</code></pre>';
            } catch (__) { }
        }

        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
});
var dateFormat = require('dateformat');

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
    } else if (page === "c_doc") { // Updating preview page
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
                console.log(result);

                // Set date and time
                let timestamp = new Date(result.created);
                date.innerText = dateFormat(timestamp, "ddd, mmm dS, yyyy") + " at " + dateFormat(timestamp, "h:MM TT");

                title.innerHTML = result.title;
                desc.innerHTML = result.description;
                url.innerHTML = "<a href='" + result.url + "' target='_BLANK'>" + result.url + "</a>";
                keywords.innerHTML = "";
                project.innerHTML = result.project;
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
        xhttp.send(JSON.stringify({ "id": id }));

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
    } else if (page == "c_view") {
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
                
                // Set date and time
                let timestamp = new Date(project.started);
                started.innerText = dateFormat(timestamp, "ddd, mmm dS, yyyy") + " at " + dateFormat(timestamp, "h:MM TT");

                // Insert data
                title.innerText = project.name;
                desc.innerText = project.description;
                homepage.innerText = project.homepage;

                // Creating the Event log!
                dump.innerHTML = "";
                if (logs.length === 0) {
                    let div = document.createElement("div");
                    div.innerHTML = "No Projects Yet";
                    dump.appendChild(div);
                } else {
                    // Add all results
                    for (i = 0; i < logs.length; i++) {
                        let div = document.createElement("div");
                        div.setAttribute('class', 'log');
                        let time = dateFormat(logs[i].created, "ddd, mmm dS, yyyy") + " at " + dateFormat(logs[i].created, "h:MM TT");
                        if (logs[i].title != null) {
                            div.innerHTML = logs[i].name_first + " " + logs[i].name_last + " created an issue called <code>" + logs[i].title + "</code> on " + time;
                        } else {
                            div.innerHTML = logs[i].name_first + " " + logs[i].name_last + " wrote a journal on " + time;
                        }
                        dump.appendChild(div);
                    }
                }
            }
        };
        xhttp.open("GET", store.get("url") + "/log/project/" + id, true);
        xhttp.send();
    }
};

viewPage(cpage);

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

const viewPupup = (popup) => {
    switch (popup) {
        case "newProject":
            break;
    }
}