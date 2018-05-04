document.getElementById("liveSearch").addEventListener("keyup", liveSearch);

function liveSearch() {
	let keyword = document.getElementById("liveSearch").value;
	let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let dump = document.getElementById("dump");
            let result = JSON.parse(this.responseText);

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
                    tab.innerHTML = "<h3>" + result[i].title + "</h3><p>Keyword: " + result[i].keyword + "</p>";
                    tab.addEventListener("click", function (e) {
                        let w = document.getElementsByClassName('wrapper')[0];  // Wrapper
                        let t = e.target;                                       // Active Tab
                        let top = parseInt(w.style.top);
                        w.style.top = top + (t.getBoundingClientRect().top - w.getBoundingClientRect().top) + "px";
                        viewPage('c_doc', doc.doc_id);
                    });
                    dump.appendChild(tab);
                }
            }
        }
    };
	xhttp.open("GET", store.get("url") + "/search?key=" + keyword, true);
	xhttp.send();
}

document.addEventListener('DOMContentLoaded', function onDocLoaded (event) {
	liveSearch();
});