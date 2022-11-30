/** 
 * Assignement.
 * 
 * For a more practical side of the implementation, the instances of assignments are linked to a CSP.
 */ 
  class Assignment {

    /** 
     * Constructor. 
     */
      constructor(csp, options = {}) {
        //Reference to the CSP
          this.csp = csp

        //Assignment variables (copy)
          this.variables = new Map(this.csp.variables)

        //Value domains of each variable (copy)
          this.domains = new Map(this.csp.domains)

        //Unassigned variables (i.e. whose domain of values is initially not empty)
          this.unassigned = new Set()
          this.variables.forEach((_, variable) => this.domains.get(variable).size ? this.unassigned.add(variable) : null)
        
        //Resolution options
          this.options = options

        //If the basic problem is not consistent, any attempt at resolution is prevented by emptying the domains of variables
          if (!this.consistant()) this.domains.forEach(domain => domain.clear())
      }

    /**
     * Contains the different methods for selecting the next variables and values.
     */
      get select() {
        let that = this
        return {
          /** 
           * Returns the next unassigned variable to use, from the active heuristics.
            * MRV, Degree heuristic and LCV are executed at this time.
           */
            unassigned() {
              //Unassigned variables
                let unassigned = that.unassigned

              //Heuristics (variables)
                if (that.options.basic) unassigned = basic(that, unassigned)
                if (that.options.mrv) unassigned = mrv(that, unassigned)
                if (that.options.dh) unassigned = dh(that, unassigned)

              //Returns the first variable
                return [...unassigned][0]
            },

          /**
           * Returns the next value to use from the variable domain, from the active heuristics.
            * The domain is directly modified (i.e. sorted/shifted)
           */
            value(variable, domain) {
              //Heuristics (values)
                if (that.options.lcv) lcv(that, variable, domain)

              //Returns the first value
                return domain.shift()
            },

          /** 
           * Returns the list of values of the variable domain.
          */
            values(variable) {
              return [...that.domains.get(variable)]
            }
        }
      }

    /** 
     * Indicates if no CSP constraint is violated.
      * If a couple {variable, value} is specified, tests if the possible addition of this couple leaves the CSP consistent.
     */
      consistant({variable, value} = {}) {
        //Path of CSP stresses and stress test
          let constraints = variable ? this.csp.constraints_map.get(variable) : this.csp.constraints
          for (let constraint of constraints)
            if (!this.test(constraint, {variable, value})) return false
          
        //No constraint violated therefore consistent
          return true
      }

    /** 
     * Test if the constraint 'constraint' is respected.
      * It is possible to pass up to two {variable, value} assignments to test the constraint with specific values.
     */
      test(constraint, A = {}, B = {}) {
        //Retrieval of the values of the variables associated with the constraint
          let a = this.variables.get(constraint.a)
          let b = this.variables.get(constraint.b)

        //Specific values (if specified)
          if (A.variable === constraint.a) a = A.value
          if (A.variable === constraint.b) b = A.value
          if (B.variable === constraint.a) a = B.value
          if (B.variable === constraint.b) b = B.value

        //Constraint check
          return !((constraint.op === "!=")&&(a === b))
      }

    /** 
     * Counts the number of legal values of a variable.
     */
      legal(variable) {
        //Traversing the values of the domain of the variable and counting the values keeping the consistency of the assignment
          let legal = 0
          for (let value of this.domains.get(variable)) 
            legal += this.consistant({variable, value})
        return legal
      }

    /** 
     * Add assignment {variable, value}.
     */
      add({variable, value}) {
        //Variable update
          this.variables.set(variable, value)
          this.unassigned.delete(variable)
      }

    /** 
     * Remove the {variable, value} assignment.
     */
      delete({variable, value}) {
        //Variable update
          this.variables.set(variable, NaN)
          this.unassigned.add(variable)
      }

    /** 
     * Complete assignment (i.e. there are no unassigned variables left).
     */
      get complete() {
        return this.unassigned.size === 0
      }

  }