var cpage = "Status";

/**
 * @param {String} page
 */
var viewPage = (page) => {
    document.getElementById(cpage).style.display = "none";
    document.getElementById(page).style.display = "block";
    cpage = page;
}

/**
 * @description Adds an event listener to every tab.
 */
var addEventListeners = function () {
    let tabs = document.getElementsByTagName("tabs")[0].children;
    for (i = 1; i < tabs.length; i++) {
        tabs[i].addEventListener('click', function (e) {
            let t = e.target;                                           // Active Tab
            let top = parseInt(tabs[0].style.top);                      // Pixels from top
            tabs[0].style.top = top + (t.getBoundingClientRect().top - tabs[0].getBoundingClientRect().top) + "px";
            viewPage(t.children[0].innerText);
        }, true);
    }
}

addEventListeners();
viewPage(cpage);