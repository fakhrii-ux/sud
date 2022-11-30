/** 
 * Cross over Function
 * Least Constraining Value.
  *
  * Sorts the domain of a variable in order according to those that allow the most legal moves thereafter.
  * e.g.: [7 (24 legal moves left for neighbors), ..., 1 (1 legal move left for neighbors)]
  *
  * Note: This function directly modifies the variable domain and therefore has no return value
 */
  function lcv(assignment, variable, values) {
    //Initialization
      let map = {}
      values.forEach(value => map[value] = 0)

    //Iterating through the values of the domain of the variable
      for (let value of values) {
        //Temporary addition of {variable, value}
          assignment.add({variable, value})
        //Count of the number of legal values on the other unassigned variables
          for (let other of assignment.unassigned)
            map[value] += assignment.legal(other)
        //Remove temporary addition of {variable, value}
          assignment.delete({variable, value})
      }
      

    //Updated the domain of the variable by sorting them by those that allow the most legal moves
      let sorted = [...sortByMappedValueReversed(map)]
      values.sort((a, b) => sorted.indexOf(a) - sorted.indexOf(b))
  }

