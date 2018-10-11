class Calendar {
    /**
     * @param {String} name Calendar name
     * @param {String} type Calendar type
     * @param {HTMLElement} target Target element to dump the calendar into
     * @param {Requester~requestCallback} onclick Onclick event
     */
    constructor(name, type, target) {
        this.name = name;
        this.type = type;
        this.target = target;

        /**
         * @namespace Calendar#data
         * @type {[{name: string userId: number todo: [] document: [] other: []}]}
         */
        this.data;

        this.selectedDate;
        this.today = new CalendarDate();

        /**
         * @namespace Calender#elements
         * @type {{'title': HTMLElement 'body': HTMLElement 'next': HTMLElement 'prev': HTMLElement 'picker': HTMLElement 'items': HTMLElement[]}}
         */
        this.elements = {
            'title': null,
            'body': null,
            'next': null,
            'prev': null,
            'picker': null,
            'items': []
        };

        this.init(name);
    }

    /**
     * onClick event to display journal data
     * @param {MouseEvent} e Mouse Event
     */
    onClick(e) {
        let id = e.target.getAttribute('journal-id');
        let name = e.target.innerText;

        let data = cal.data[id];


        let docs = document.getElementById("docs");
        let todo = document.getElementById("todo");
        let journal = document.getElementById("other");
        document.getElementById("date").setAttribute('title', name + " | " + cal.today.getMonthShort() + " " + cal.today.getDate());

        todo.innerHTML = "";

        if (data.todo.length > 0) {

            for (let t = 0; t < data.todo.length; t++) {
                let item = document.createElement("item");
                item.innerHTML = data.todo[t].description;
                todo.appendChild(item);
            }
        } else {
            let item = document.createElement("null-item");
            item.innerHTML = "No tasks were completed.";
            todo.appendChild(item);
        }

        docs.innerHTML = "";

        if (data.document.length > 0) {

            for (let t = 0; t < data.document.length; t++) {
                let item = document.createElement("item");
                item.innerText = data.document[t].description;
                docs.appendChild(item);
            }
        } else {
            let item = document.createElement("null-item");
            item.innerHTML = "No documents were touched.";
            docs.appendChild(item);
        }

        journal.innerHTML = "";

        if (data.other.length > 0) {
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

    /**
     * 
     * @param {String} name Calendar name
     */
    init(name) {
        // Create elements
        this.elements.title = new CalendarElement('title', this);
        this.elements.body = new CalendarElement('body', this);
        this.elements.next = new CalendarElement('next', this);
        this.elements.prev = new CalendarElement('prev', this);
        this.elements.picker = document.getElementById("picker");

        // Add listener to elements
        this.elements.next.setAttribute("onclick", "cal.nextDay()");
        this.elements.prev.setAttribute("onclick", "cal.prevDay()");
        
        this.getData();

        this.updateDate();

        // Apply changes to target element
        this.target.setAttribute('class', 'cal');
        this.target.appendChild(this.elements.title);
        this.target.appendChild(this.elements.body);
        this.target.appendChild(this.elements.next);
        this.target.appendChild(this.elements.prev);
    }

    getData() {
        let self = this;

        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let data = JSON.parse(this.responseText);

                self.elements.body.innerHTML = "";

                if (data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        let newItem = new CalendarElement('item', self, data[i].name, i);
                        newItem.onclick = self.onClick;
                        self.elements.items.push(newItem);
                        self.elements.body.appendChild(newItem);
                    }
                } else {
                    let newItem = new CalendarElement('null-item', self, "No Activity Today.");
                    self.elements.items.push(newItem);
                    self.elements.body.appendChild(newItem);
                }

                self.data = data;
            }
        };
        xhttp.open("GET", store.get("url") + "/journals/" + this.today.date.toISOString(), true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(store.getUser()));
    }

    nextDay() {
        this.today.getNextDay();
        this.getData();
        this.updateDate();
    }

    prevDay() {
        this.today.getPrevDay();
        this.getData();
        this.updateDate();
    }

    getToday() {
        this.today.getNow();
        this.getData();
        this.updateDate();
    }

    setDate(element) {
        this.today.setDate(element.value);
        this.getData();
        this.updateDate();
    }

    updateDate() {

        let date = this.today.getISO().split('T')[0];

        this.elements.picker.value = date;
        this.elements.title.innerText = this.today.getDayShort() + " " + this.today.getMonthShort() + " " + this.today.getDate() + ", " + this.today.getYear();
    }
    
}

class CalendarElement {
    /**
     *
     * @param {string} type Element type
     * @param {Calendar} calendar Calendar
     * @param {String} [contents] Item inner text
     * @param {Number} id User's journal data id
     * @returns {HTMLElement} Returns custom HTMLElement
     */
    constructor(type, calendar, contents, id) {
        this.calendar = calendar;
        this.type = type;
        this.contents = contents;
        this.id = 'cal-' + calendar.name + '-' + type;
        this.journalId = id;

        this.init();

        return this.element;
    }

    init() {
        this.element = document.createElement('div');
        this.element.setAttribute('id', this.id);
        this.element.setAttribute('class', this.type);

        switch (this.type) {
            case 'item':
                this.element.setAttribute('journal-id', this.journalId);
                this.element.innerText = this.contents;
                break;
            case 'null-item':
                this.element.innerText = this.contents;
                break;
        }
    }
}

class CalendarDate {

    constructor() {
        this.date = new Date();
        this.date.setHours(0, 0, 0, 0); // fixes issues with grabbing data from the server.

        this.year = this.date.getFullYear();
        this.day = this.date.getDate();
        this.month = this.date.getMonth() + 1;
    }

    getNextDay() {
        if (this.day < this.monthDays()) {
            this.day += 1;
        } else {
            this.day = 1;
            this.month += 1;
        }

        this.date = new Date(this.year, this.month - 1, this.day);
    }

    getPrevDay() {
        if (this.day > 1) {
            this.day -= 1;
        } else {
            this.month -= 1;
            this.day = this.monthDays();
        }

        this.date = new Date(this.year, this.month - 1, this.day);
    }

    getNow() {
        this.date = new Date();
        this.date.setHours(0, 0, 0, 0); // fixes issues with grabbing data from the server.

        this.year = this.date.getFullYear();
        this.day = this.date.getDate();
        this.month = this.date.getMonth() + 1;
    }

    /**
     * 
     * @param {String} date Date from date input
     */
    setDate(date) {

        // change the format of the string from YYYY-MM-DD to MM-DD-YYYY
        let a = date.split('-');
        let nDate = a[1] + "-" + a[2] + "-" + a[0];

        this.date = new Date(nDate);

        this.year = this.date.getFullYear();
        this.day = this.date.getDate();
        this.month = this.date.getMonth() + 1;
    }

    getMonth() {
        switch (this.date.getMonth()) {
            case 0:
                return "January";
            case 1:
                return "Febuary";
            case 2:
                return "March";
            case 3:
                return "April";
            case 4:
                return "May";
            case 5:
                return "June";
            case 6:
                return "July";
            case 7:
                return "August";
            case 8:
                return "September";
            case 9:
                return "October";
            case 10:
                return "November";
            case 11:
                return "December";
        }
    }

    getMonthShort() {
        switch (this.date.getMonth()) {
            case 0:
                return "Jan";
            case 1:
                return "Feb";
            case 2:
                return "Mar";
            case 3:
                return "Apr";
            case 4:
                return "May";
            case 5:
                return "Jun";
            case 6:
                return "Jul";
            case 7:
                return "Aug";
            case 8:
                return "Sept";
            case 9:
                return "Oct";
            case 10:
                return "Nov";
            case 11:
                return "Dec";
        }
    }

    getYear() {
        return this.date.getFullYear();
    }

    getDate() {
        return this.date.getDate();
    }

    getISO() {
        return this.date.toISOString();
    }

    getDay() {
        switch (this.date.getDay()) {
            case 0:
                return "Sunday";
            case 1:
                return "Monday";
            case 2:
                return "Tuesday";
            case 3:
                return "Wednesday";
            case 4:
                return "Thursday";
            case 5:
                return "Friday";
            case 6:
                return "Saturday";
        }
    }

    getDayShort() {
        switch (this.date.getDay()) {
            case 0:
                return "Sun";
            case 1:
                return "Mon";
            case 2:
                return "Tues";
            case 3:
                return "Wed";
            case 4:
                return "Thur";
            case 5:
                return "Fri";
            case 6:
                return "Sat";
        }
    }

    monthDays() {
        let d = new Date(this.year, this.month, 0);
        return d.getDate();
    }
}

// Documetation 

/**
 * This callback is displayed as part of the Requester class.
 * @callback Requester~requestCallback
 * @param {MouseEvent} e
 */