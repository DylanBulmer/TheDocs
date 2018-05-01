
/**
 * 
 * @param {Element} element
 */

const testRegex = (element) => {
    let regex = new RegExp(element.getAttribute('pattern'));
    let val = element.value;

    if (val !== '') {
        if (regex.test(val, "g")) {
            console.log("Regular Expression Passed!");
        } else {
            console.log("Regular Expression Failed!");
        }
    } else {
        console.log("No value to test!");
    }
} 