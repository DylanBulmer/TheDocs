
/**
 * 
 * @param {Element} element
 */

const testRegEx = (element) => {
    let regex = new RegExp(element.getAttribute('pattern'));
    let val = element.value;

    if (val !== '') {
        if (regex.test(val, "g")) {
            document.getElementById("regExpError").innerText = "";
        } else {
            document.getElementById("regExpError").innerText = "Invailed URL";
        }
    } else {
        document.getElementById("regExpError").innerText = "";
    }
}