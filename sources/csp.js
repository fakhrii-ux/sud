/** 
 * Constraint satisfaction problem (CSP).
 * @abstract
 */
  class ConstraintSatisfactionProblem {

    /** 
     * Constructor. 
     */
      constructor() {
        //Variables 
          this.variables = new Map()

        //Range of variable values
          this.domains = new Map()

        //Neighborhood of each variable
          this.neighborhoods = new Map()

        //Constraints
          this.constraints = []
          this.constraints_map = new Map() 

        //Used to manage problem resolution status (for UI)
          this.solving = new ConstraintSatisfactionProblem.SolvingState()
      }

    /** 
     * Searches for a solution to the CSP with the algorithm passed as a parameter.
      * Note: Only the 'backtracking' function can be used as the first parameter
      *
      * The stopwatch is also started.
     */
      async solve(algorithm, options) {
        //Initialization
          let solution = null
          this.solving.start()

        //Resolution according to the algorithm specified in parameter
          try { 
            solution = await algorithm(this, this.solver = new Assignment(this, options)) 
            this.solving.end(this.chrono, solution)
            if (!solution) this.solver = null
            await rendering()
          } 
        //User shutdown
          catch (e) { 
            this.solving.cancel(this.chrono)
            rendering.render()
          }
          
        return solution
      }

    /** 
     * Generates the constraint map.
      * This groups the constraints of the same variable.
      *
      * Content is equivalent to csp.constraints, but allows filtering by variable to save computation time
     */
      compute_constraints_map() {
        //Path of the variables
          for (let [variable] of this.variables) { 
            //Initialization
              let constraints = new Set()
              this.constraints_map.set(variable, constraints)
            //Traverse the constraints in search of the constraints linked to the variable
              for (let constraint of this.constraints)
                if ((constraint.a === variable)||(constraint.b === variable)) constraints.add(constraint)
          }
      }

    /** 
     * Computes the neighborhood of each variable.
      * i.e. the variables with which a variable has at least one constraint.
     */
      compute_neighborhoods() {
        //Path of the variables
          for (let [variable] of this.variables) { 
            //Initialization
              let neighborhood = new Set()
              this.neighborhoods.set(variable, neighborhood)
            //Adding the neighborhood
              this.constraints_map.get(variable).forEach(constraint => (neighborhood.add(constraint.a), neighborhood.add(constraint.b)))
              neighborhood.delete(variable)
          }
      }
      

    /** 
     * Time elapsed since the start of the solve.
     */
      get chrono() {
        return Number.isFinite(this.solving.started) ? performance.now() - this.solving.started : 0
      }
  }

//Class for managing the resolution state of a CSP
  ConstraintSatisfactionProblem.SolvingState = ConstraintSatisfactionProblemSolvingState