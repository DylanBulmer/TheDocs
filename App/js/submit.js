var submitDoc = function submitDoc() {
    let doc = {
        user_id: store.get("user").id,
        project_id: '',
        title: document.getElementById("n_title").value,
        url: document.getElementById("n_url").value,
        description: document.getElementById("n_desc").value,
        solution: document.getElementById("n_solution").value,
        keywords: ''
    }

    if (document.getElementById('n_project').value == 'new') {
        doc.project_id = { new: document.getElementById('n_pname').value };
    } else {
        doc.project_id = document.getElementById('n_project').selectedOptions[0].value;
    }

    // Create array of keywords and trim of whitespace
    doc.keywords = document.getElementById("n_keywords").value.split(',').map(function (item) {
        return item.trim();
    });

    if (doc.title != '' && doc.description != '' && doc.solution != '' && doc.keywords != '' && checkRegEx()) {
        // create request
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                result = JSON.parse(this.responseText);
                if (result.err) {
                    document.getElementById("submitErr").innerText = result.err;
                    clear();
                } else {
                    document.getElementById("submitErr").innerText = "";
                    viewPage('c_main');
                    liveSearch();
                }
            } else {
                switch (this.readyState) {
                    case 0:
                        console.error("An error occured in the app");
                        document.getElementById("submitErr").innerText = "An error occured while submitting!";
                        clear();
                        break;
                    case 1:
                        break;
                    case 2:
                        break;
                    case 3:
                        break;
                    case 4:
                        switch (this.status) {
                            case 0:
                                console.error('An error has occured!');
                                break;
                            case 200:
                                //msg.innerHTML = 'Done!';
                                break;
                            case 403:
                                //msg.innerHTML = 'That page is forbiden!';
                                break;
                            case 404:
                                //msg.innerHTML = '404 - Page not found!';
                                break;
                        }
                        break;
                }
            }
        };
        xhttp.open("POST", store.get('url') + "/new", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(doc));
    } else {
        document.getElementById("submitErr").innerText = "Please make sure the fields: title, description, keywords, and document are filled out, and there is no URL error!";
        clear();
    }
}

var submitProject = function submitProject() {
    let project = {
        name: document.getElementById("n_name").value,
        description: document.getElementById("n_desc").value,
        homepage: document.getElementById("n_url").value
    }

    if (project.name != '' && checkRegEx()) {
        // create request
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let result = JSON.parse(this.responseText);
                if (result.err) {
                    document.getElementById("submitErr").innerText = result.err;
                    clear(10000);
                } else {
                    viewPage('c_view', result.result.id);
                    projectSearch();
                }
            } else {
                switch (this.readyState) {
                    case 0:
                        console.error("An error occured in the app");
                        document.getElementById("submitErr").innerText = "An error occured while submitting!";
                        clear();
                        break;
                    case 1:
                        break;
                    case 2:
                        break;
                    case 3:
                        break;
                    case 4:
                        switch (this.status) {
                            case 0:
                                console.error('An error has occured!');
                                break;
                            case 200:
                                //msg.innerHTML = 'Done!';
                                break;
                            case 403:
                                //msg.innerHTML = 'That page is forbiden!';
                                break;
                            case 404:
                                //msg.innerHTML = '404 - Page not found!';
                                break;
                        }
                        break;
                }
            }
        };
        xhttp.open("POST", store.get('url') + "/new/project", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(project));
    } else {
        document.getElementById("submitErr").innerText = "Please make sure the `name` field is filled out and there is no URL error!";
        clear();
    }
}


var clear = (ms) => {
    setTimeout(() => {
        document.getElementById("submitErr").innerText = "";
    }, ms || 5000);
}

var checkRegEx = () => {
    let err = document.getElementById("regExpError").innerText;
    if (err != '') {
        return false;
    } else {
        return true;
    }
}