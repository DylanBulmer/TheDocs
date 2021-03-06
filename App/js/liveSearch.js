document.getElementById("liveSearch").addEventListener("keyup", liveSearch);

function liveSearch() {
	let keyword = document.getElementById("liveSearch").value;
	let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let dump = document.getElementById("dump");
            let data = JSON.parse(this.responseText);
            let result = data.result;

            if (!data.err) {
                dump.innerHTML = "";
                // Add wrapper
                let tab = document.createElement("tab");
                tab.setAttribute("class", "wrapper");
                tab.setAttribute("style", "top: -200px;");
                dump.appendChild(tab);

                if (result.length === 0) {
                    let tab = document.createElement("tab");
                    tab.innerHTML = "<h3>No documents found!</h3><p>Create a new one!</p>";
                    dump.appendChild(tab);
                } else {
                    // Add all results
                    for (i = 0; i < result.length; i++) {
                        let doc = result[i];
                        tab = document.createElement("tab");
                        tab.innerHTML = "<h3>" + result[i].title + "</h3><p>Project: " + result[i].project + "</p>"; // use `result[i].keyword` for displaying keywords instead
                        tab.addEventListener("click", function (e) {
                            let w = document.getElementsByClassName('wrapper')[0];  // Wrapper
                            let t = e.target;                                       // Active Tab
                            let top = parseInt(w.style.top);
                            w.style.top = top + (t.getBoundingClientRect().top - w.getBoundingClientRect().top) + "px";
                            viewPage('c_doc', doc.doc_id, null);
                        });
                        dump.appendChild(tab);
                    }
                }
            } else {
                let tab = document.createElement("tab");
                tab.innerHTML = result.err;
                dump.appendChild(tab);
            }
        } else if (this.readyState === 4) {
            let dump = document.getElementById("dump");
            dump.innerHTML = "";

            let tab = document.createElement("tab");
            tab.innerHTML = "<h3>Could Not Connect!</h3><p>Type to try again!</p>";
            dump.appendChild(tab);
        }
    };
    let user = store.getUser();
    user.key = keyword;
    xhttp.open("POST", store.get("url") + "/search", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(user));
}

document.addEventListener('DOMContentLoaded', function onDocLoaded (event) {
	liveSearch();
});

document.getElementById("dump").addEventListener("click", (e) => {
    viewPage('c_new', null, e);
}, true);