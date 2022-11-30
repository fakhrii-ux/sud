/** 
 * Sudoku.
 * 
 * Each square of the sudoku represents a variable (there are therefore 9*9 variables).
 * These are initialized to 'NaN' to indicate that they are undefined,
 * or a number if it is a "fixed" variable that is part of the original problem.
 *
 * Variables are identified by a string as follows:
 * "x:y", which is based on the coordinates of the square in the sudoku.
 *
 * The domains of values ​​of each box are the numbers that each of the boxes can take.
 * They are initially defined as follows:
 * [1..9] if the variable is 'NaN' (i.e. it is a variable to solve)
 * [Ø] if the variable is fixed (i.e. it is a variable defining the problem)
 *
 * Sudoku constraints are represented by an object as follows:
 * {a, b, op} where 'a' and 'b' are the variables affected by the constraint and 'op' the operator.
 * Here, only the '!=' operator has been defined because it is the only one required to solve a sudoku.
 * Note: the stress test '!=' implemented here exploits the particularity that "NaN === NaN //false"
 */ 
  class Sudoku extends ConstraintSatisfactionProblem {

    /** Constructor. */
      constructor() {
        //Legacy
          super() 

        //Initializes sudoku-specific data
          this.init()
          this.compute_domains()
          this.compute_constraints()
      }

    /** 
     * Initialize Sudoku.
      * Already initialized variables can be passed as parameters.
     */
      init(variables = {}) {
        //Cleanup of variables
          for (let i = 0; i < 9; i++)
              for (let j = 0; j < 9; j++)
                this.variables.set(`${i}:${j}`, NaN)

        //Application of initial values for each variable passed as a parameter
          for (let variable in variables)
            this.variables.set(variable, variables[variable])

        //Updating the value domains of each variable
          this.compute_domains()
      }

    /** 
     * Method to generate Sudoku binary constraints.
     */
      compute_constraints() {
        //Creating Line Constraints
          for (let y = 0; y < 9; y++)
            for (let i = 0; i < 9; i++)
              for (let j = 0; j < 9; j++)
                if (!(i === j))
                  this.constraints.push({a:`${i}:${y}`, b:`${j}:${y}`, op:"!="})

        //Creating Constraints on Columns
          for (let x = 0; x < 9; x++)
            for (let i = 0; i < 9; i++)
              for (let j = 0; j < 9; j++)
                if (!(i === j))
                  this.constraints.push({a:`${x}:${i}`, b:`${x}:${j}`, op:"!="})

        //Creating Constraints by Region
          for (let x = 0; x < 9; x+=3)
            for (let y = 0; y < 9; y+=3)
              for (let i = 0; i < 9; i++)
                for (let j = 0; j < 9; j++) {
                  let xa = x + (i%3), ya = y + ~~(i/3), xb = x + (j%3), yb = y + ~~(j/3)
                  if (!((xa === xb)&&(ya === yb)))
                      this.constraints.push({a:`${xa}:${ya}`, b:`${xb}:${yb}`, op:"!="})
                }

        //Generation of the constraint and neighborhood map
          this.compute_constraints_map()
          this.compute_neighborhoods()
      }

    /** 
     * Initializes the domains of values for each variable.
     */
      compute_domains() {
        //List of possible values
          let values = []
          for (let i = 1; i <= 9; i++) values.push(i)

        //Redefining value domains
          this.domains.clear()
          this.variables.forEach((value, variable) => this.domains.set(variable, new Set(isNaN(value) ? values : [])))
      }

    /** 
     * Returns the neighborhood of a variable.
     */
      neighbors(variable) {
        return this.neighborhoods.get(variable)
      }
   
  }

  