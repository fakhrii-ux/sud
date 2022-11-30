/** 
  * Minimum Remaining Value.
  *
  * Filters unassigned variables according to their number of remaining legal values.
  * e.g.: [0:0 (2)]
 */
  function mrv(assignment, unassigned) {
    //Initialization
      let map = {}, min = Infinity
      unassigned.forEach(variable => map[variable] = 0)
    
    //Iterating through unassigned variables and counting legal values
      for (let variable of unassigned) {
        let legal = assignment.legal(variable) 
        min = Math.min(legal, min)
        map[variable] = legal
      }
      
    //Filters variables with the minimum remaining legal values
      return filterByMappedValue(map, min)
  }
