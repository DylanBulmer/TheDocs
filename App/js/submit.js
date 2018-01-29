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
    console.log(doc);

    // create request
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            result = JSON.parse(this.responseText);
            if (result.err) {
                console.error(result.err);
            } else {
                viewPage('c_main');
                liveSearch();
            }
        } else {
            switch (this.readyState) {
                case 0:
                    console.error(" An error occured in the app");
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
}