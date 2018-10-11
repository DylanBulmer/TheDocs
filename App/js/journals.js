const { dialog } = require('electron').remote;

var cal = new Calendar('journal', 'day', document.getElementById('cal'));

var journal = {
    state: {
        status: "view",     // 'view' or 'editing'
        previousState: "",  // What was stored before editing
        lastEdit: ""
    },

    /**
     * @param {MouseEvent} e Event
     */
    edit: (e) => {
        if (e.target.getAttribute("id") === "other") {
            let j = document.getElementById("other");

            // Create element and add value before storing elements
            let newItem = document.createElement('textarea');
            newItem.setAttribute("id", "edit");
            newItem.value = journal.state.lastEdit;

            // Store element(s) before removing
            if (j.childNodes.length > 1) {
                journal.state.previousState = j.childNodes[1].valueOf();
            } else {
                journal.state.previousState = j.childNodes[0].valueOf();
            }
            journal.state.status = 'edit';

            // Clear and send text box
            j.innerHTML = "";
            j.appendChild(newItem);
        }
    },
    /**
     * @param {KeyboardEvent} e Event
     */
    onKeyUp: (e) => {
        switch (e.keyCode) {
            case 27:
                // ESC key

                // Code for canceling journal 

                let j = document.getElementById('other');

                let prev = j.children[0].value;

                j.innerHTML = "";
                j.appendChild(journal.state.previousState);

                journal.state.lastEdit = prev;

                journal.state.status = "view";

                break;
        }
    },
    /**
     * @param {KeyboardEvent} e Event
     */
    onKeyPress: (e) => {
        switch (e.keyCode) {
            case 13:
                // Enter key
                if (!e.shiftKey) {
                    // If shift is not pressed, submit data
                    e.preventDefault();
                    console.log("Enter only test. Shift Key: ", e.shiftKey);

                    let dialogOpts = {
                        type: 'question',
                        buttons: ['No', 'Yes'],
                        title: 'The Docs',
                        detail: 'Do you want to submit your journal?'
                    };

                    dialog.showMessageBox(dialogOpts, (response) => {
                        if (response === 0) {
                            // Answers No
                            console.log('User responded No!');
                        } else {
                            // Answers Yes

                            console.log([[e.target.value, cal.today.getISO()]]);

                            // Code for submitting journal

                            /*
                            let xhttp = new XMLHttpRequest();
                            xhttp.onreadystatechange = function () {
                                if (this.readyState === 4 && this.status === 200) {
                                    let journal = document.getElementById("other");
                                    let result = JSON.parse(this.responseText);

                                    journal.innerHTML = "";

                                    if (result.length > 0) {
                                        for (let t = 0; t < data.other.length; t++) {
                                            let item = document.createElement("item");
                                            item.innerText = data.other[t].description;
                                            journal.appendChild(item);
                                        }
                                    } else {
                                        let item = document.createElement("null-item");
                                        item.innerHTML = "No explanation was given.";
                                        journal.appendChild(item);
                                    }
                                }
                            };
                            xhttp.open("POST", store.get("url") + "/journal", true);
                            xhttp.setRequestHeader("Content-Type", "application/json");
                            xhttp.send(JSON.stringify({
                                profile: store.getUser(),
                                journal: [[e.target.value, cal.today.getISO() ]]
                            })); */
                        }
                    });
                }
                break;
        }
    }
};

document.getElementById("other").addEventListener("click", journal.edit, true);
document.getElementById("other").addEventListener("keypress", journal.onKeyPress, true);
document.getElementById("other").addEventListener("keyup", journal.onKeyUp, true);