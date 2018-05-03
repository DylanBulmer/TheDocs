
/**
 * 
 * @param {Element} element
 */

const testRegEx = (element) => {
    let regex = new RegExp(element.getAttribute('pattern'));
    let val = element.value;

    if (val !== '') {
        if (regex.test(val, "g")) {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }
}