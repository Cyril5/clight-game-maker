export default class Utils {

  static removeElementInArray(element, array) {
    //const index = array.indexOf(element);
    // if (index !== -1) {
    //   array.splice(index, 1);
    // }
    const ndx = array.indexOf(element);
    if (ndx >= 0) {
      array.splice(ndx, 1);
    }
  }
}