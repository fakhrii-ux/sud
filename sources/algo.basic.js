/** 
 * No special treatment.
  *
  * Sorts unassigned variables according to their initial order.
  * eg: [0:0, 0:1, 0:2, ..., 8:8]
 */
  function basic(assignement, unassigned) {
    return sortByName(unassigned)
  }