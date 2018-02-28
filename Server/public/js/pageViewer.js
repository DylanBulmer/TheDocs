var cpage = "c_main";
var viewPage = function viewPage(page, id) {
    document.getElementById(cpage).style.display = "none";
    document.getElementById(page).style.display = "block";
    cpage = page;

    if (page == "c_pre") { // Updating preview page
        let title = document.getElementById("p_title");
        let desc = document.getElementById("p_desc");
        let url = document.getElementById("p_url");
        let keywords = document.getElementById("p_keywords");
        let solution = document.getElementById("p_solution");
        let project = document.getElementById('p_project');

        if (document.getElementById('n_project').value == 'new') {
            project.innerHTML = document.getElementById('n_pname').value;
        } else {
            project.innerHTML = document.getElementById('n_project').selectedOptions[0].innerText;
        }

        title.innerHTML = document.getElementById("n_title").value;
        desc.innerHTML = document.getElementById("n_desc").value;
        url.innerHTML = document.getElementById("n_url").value;
        keywords.innerHTML = document.getElementById("n_keywords").value;
        solution.innerHTML = md.render(document.getElementById("n_solution").value);
    } else if (page == "c_doc") { // Updating preview page
        let title = document.getElementById("d_title");
        let desc = document.getElementById("d_desc");
        let url = document.getElementById("d_url");
        let keywords = document.getElementById("d_keywords");
        let solution = document.getElementById("d_solution");
        let project = document.getElementById('d_project');
        let name = document.getElementById('d_name');

        // Getting The Doc
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let result = JSON.parse(this.responseText);
                console.log(result);

                title.innerHTML = result.title;
                desc.innerHTML = result.description;
                url.innerHTML = result.url;
                keywords.innerHTML = "";
                project.innerHTML = result.project;
                name.innerHTML = result.user.name_first + " " + result.user.name_last;

                for (let i = 0; i < result.keywords.length; i++) {
                    if (i === (result.keywords.length - 1)) {
                        keywords.innerHTML += result.keywords[i];
                    } else {
                        keywords.innerHTML += result.keywords[i] + ", ";
                    }
                }

                // Get solution from buffer;
                solution.innerHTML = md.render(new Buffer(result.solution).toString('utf8'));
            }
        }
        xhttp.open("POST", store.get("url") + "/doc", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify({ "id": id }));

    } else if (page == "c_new") { // Updating New Doc Page
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let dump = document.getElementById("n_projects");
                let result = JSON.parse(this.responseText);

                dump.innerHTML = "";
                if (result.length == 0) {
                    let opt = document.createElement("option");
                    opt.innerHTML = "No Projects Yet";
                    dump.appendChild(opt);
                } else {
                    // Add all results
                    for (i = 0; i < result.length; i++) {
                        let opt = document.createElement("option");
                        opt.innerHTML = result[i].name;
                        opt.setAttribute("value", "" + result[i].id);
                        if (i == 0) {
                            opt.selected = true;
                        }
                        dump.appendChild(opt);
                    }
                }
            }
        }
        xhttp.open("GET", store.get("url") + "/projects", true);
        xhttp.send();
    }
}

viewPage(cpage);

var updateChange = function () {
    if (document.getElementById('n_project').value == 'new') {
        document.getElementById('pname').style.display = "inline-block";
    }
}