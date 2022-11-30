/** 
 * Degree heuristic.
  *
  * Sorts unassigned variables by the number of constraints on its unassigned neighbors.
  * It can be used as a tie breaker for MRV.
  * e.g. [0:0 (32 constraints), 2:3 (12 constraints), ..., 7:2 (1 constraint)]
 */      
  function dh(assignment, unassigned) {
    //Initialization
      let map = {}
      unassigned.forEach(variable => map[variable] = 0)

    //Traversing the unassigned variables and counting the constraints of each variable on its unassigned neighbors
      for (let variable of unassigned)
        map[variable] = [...assignment.csp.constraints_map.get(variable)].filter(({a, b}) => assignment.unassigned.has(a)&&assignment.unassigned.has(b)).length
        
    //Rank the variables according to the number of constraints (in descending order)
      return sortByMappedValueReversed(map)
  }