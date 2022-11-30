/**
 * Fitness Function
 * Arc Consistency #3 (AC3).
 * 
 * Updates the different value domains of the variables by checking their consistency with the assignment.
 * If an unassigned variable has an empty domain, the function indicates that the assignment cannot be complete.
 */
  function AC3(csp, assignment) {
    //List of arcs (copy of constraints)
      let arcs = new Array(...csp.constraints)

    //Traverse the list of arcs
      while (arcs.length) {
        //Recovery of the arc and the variable to be processed
          let arc = arcs.shift(), variable = arc.a

        //Remove inconsistent values from domain of 'a' based on values from domain of 'b'
          if (AC3.RemoveInconsistentValues(arc, assignment)) {
            //Propagate consistency test and domain test
              csp.neighbors(variable).forEach(neighbor => arcs.push({a:neighbor, b:variable, op:arc.op}))
              if (assignment.domains.get(variable).size === 0) return {deadend:true}
          }
          console.log("fitness : "+arcs.length)
          
      }
      

    return {deadend:false}
  }

/** 
 * Function that updates the value domains of a variable.
 */
  AC3.RemoveInconsistentValues = function (arc, assignment) {
    //Initialization
      let removed = false, {a, b} = arc

    //Traverse the values of 'a' and 'b' to find 'vb' satisfying 'arc' for (a = va, b = vb)
      a_values: for (let va of assignment.domains.get(a)) {
        b_values: for (let vb of assignment.domains.get(b)) 
          if (assignment.test(arc, {variable:a, value:va}, {variable:b, value:vb})) continue a_values
        
        //If the 'continue a_values' didn't execute, it means:
        //No value of 'b' can satisfy 'arc' for (a = va, b = vb)
          assignment.domains.delete(va)
          removed = true
      }
  
    return removed
  }