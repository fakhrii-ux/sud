/**
 * Mutation Function
 * Backtracking.
 * Implements backtracking recursively.
  *
  * The algorithm is slightly modified so that the recursion is stopped prematurely if AC3 is activated,
  * and that it indicates that the assignment cannot be complete.
 */
  async function backtracking(csp, assignment) {
    //Graphic display
      await rendering(rendering.step)

    //Solution if the assignment is complete
      if (assignment.complete) return assignment

    //Otherwise, retrieving an unassigned variable
      let variable = assignment.select.unassigned()
      let domain = assignment.select.values(variable)
      
    //Traverse the values of the domain of each variable
    //Note: The "for (let value of domain)" loop has been replaced by the implementation below ("while" loop)
    //  due to the LCV heuristic which was messing up the iterator due to the change on the order of the domain values.
      while (domain.length) {
        //Selecting a value
          let value = assignment.select.value(variable, domain)

        //Consistency test
          if (assignment.consistant({variable, value})) {
            //Adding {variable, value}
              assignment.add({variable, value})

            //Recursion (if AC3 is enabled and it indicates that the current assignment cannot be completed)
              if ((assignment.options.ac3)&&(AC3(csp, assignment).deadend)) {
                assignment.delete({variable, value})
                return null
              }
            //Recursion
              else {
                let result = await backtracking(csp, assignment)
                if (result) return result
                assignment.delete({variable, value})
              }
          }
      }

    //No exit
      return null
  }