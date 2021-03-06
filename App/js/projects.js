// If I choose to do a search feature, just uncomment the code and adjust to the right config.
// document.getElementById("liveSearch").addEventListener("keyup", liveSearch);

var dateFormat = require('dateformat');

function projectSearch() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let dump = document.getElementById("dump");
            let result = JSON.parse(this.responseText);

            dump.innerHTML = "";
            let tab;

            if (result.length === 0) {
                let tab = document.createElement("tab");
                tab.innerHTML = "<h3>No projects found!</h3><p>Create a new one!</p>";
                dump.appendChild(tab);
            } else {
                // Add all results
                for (i = 0; i < result.length; i++) {
                    let project = result[i];
                    tab = document.createElement("tab");
                    tab.innerHTML = "<h3>" + result[i].name + "</h3><p>Started " + dateFormat(result[i].started, "ddd, mmm dS, yyyy") + "</p>";
                    tab.addEventListener("click", function (e) {
                        let t = e.target;
                        viewPage('c_view', project.id);
                    });
                    dump.appendChild(tab);
                }
            }
        }
    };
    xhttp.open("GET", store.get("url") + "/projects", true);
    xhttp.send();
}

document.addEventListener('DOMContentLoaded', function onDocLoaded(event) {
    projectSearch();
});


document.getElementById("dump").addEventListener("click", (e) => {
    viewPage('c_newProject', null, e);
}, true);