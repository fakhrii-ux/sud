/** Force sudoku rendering. */
async function rendering(step = 0) {
    if (sudoku.solving.kill) { sudoku.solving.reset(); throw "KILLED" }
    rendering.render()
    await new Promise(solve => setTimeout(solve, step))
  }
  rendering.render = function () { if ((rendering.renderer)&&(rendering.renderer.$forceUpdate)) rendering.renderer.$forceUpdate() }
  rendering.step = 0

/** Return a set sorted by the name of its values. */
  function sortByName(set) {
    return new Set([...set].sort())
  }

/** Return a set sorted by map. */
  function sortByMappedValue(map) {
    return new Set(Object.keys(map).sort((a, b) => map[a] - map[b]))
  }

/** Returns a set sorted according to a map (reverse direction). */
  function sortByMappedValueReversed(map) {
    return new Set(Object.keys(map).sort((a, b) => map[b] - map[a]))
  }

/** Return a set filtered by a single value. */
  function filterByMappedValue(map, value) {
    return new Set(Object.keys(map).filter(k => map[k] === value))
  }

/** Manual editing of sudoku. */
  function maker(event) {
    let value = event.key
    //Deletion
      if ((value === "Backspace")||(value === "Delete")) 
        maker.set.set(event.target.name, NaN)
    //Add
      else if (/[1-9]/.test(value))
        maker.set.set(event.target.name, Number(value))
    rendering()
  }
  maker.set = new Map()

/** Random sudoku generator. */
  maker.random = function () {
    //Stopping the resolution
      if (sudoku.solving) stop()

    //Random creation of a sudoku
      let array = sudokugenerator.sudoku.generate("very-hard").split("").map(Number), data = {}
      for (let x = 0; x < 9; x++)
        for (let y = 0; y < 9; y++)
          data[`${x}:${y}`] = Number.isFinite(array[x+y*9]) ? array[x+y*9] : NaN
    
    //sudoku update
      sudoku.init(data)
      sudoku.solver = null
      maker.set.clear()
      rendering.render()
  }

/** Clean up sudoku */
  maker.clear = function () {
    sudoku.init({})
    sudoku.solver = null
    maker.set.clear()
    rendering.render()
  }

/** Sudoku Solve */
  async function solve() {
    //Do nothing if in process
      if (sudoku.solving.started) return 
      
    //Creating sudoku from user input
      let data = {}
      document.querySelectorAll(".square.fixed input").forEach(input => {
        let {value, name} = input
        value = /\d+/.test(value) ? Number(value) : NaN
        if (Number.isFinite(value)) data[name] = value
      })
      sudoku.init(data)
      maker.set.clear()
      //rendering.step = Number(document.querySelector('[name="rendering_step"]').value) * 1000

    //Resolution
      await sudoku.solve(backtracking, {
        ac3:document.querySelector('[name="ac3"]').checked, 
        lcv:document.querySelector('[name="lcv"]').checked,
        mrv:document.querySelector('[name="mrv"]').checked,
        dh:document.querySelector('[name="dh"]').checked,
        basic:!(document.querySelector('[name="mrv"]').checked||document.querySelector('[name="dh"]').checked)
      }) 
  }

/** Force the resolution to stop. */
  function stop() {
    sudoku.solving.cancel()
  }

/** Initialize the sudoku */
  async function sudoku_init() {
    sudoku = new Sudoku()
    maker.random()
    rendering.renderer = new Vue({el:"#app", data:{sudoku}})
    try { await rendering() } catch (e) {}
  }

/**  
 * Class used to manage the resolution state of a CSP.
 */
  class ConstraintSatisfactionProblemSolvingState {
    /** 
     * Constructor. 
     */
      constructor() {
        this.started = null
        this.ended = null
        this.time = null
        this.solvable = false
        this.kill = false
      }

    /** 
     * Starts the timer and indicates that a resolution is in progress.
     */
      start() {
        this.started = performance.now()
        this.ended = false
        this.time = null
        this.solvable = false
        this.kill = false
      }

    /**
     * Stops the timer and indicates that a solve has ended.
     */
      end(t, solvable) {
        this.started = null
        this.ended = true
        this.time = t
        this.solvable = !!solvable
      }

    /** 
     * Stops the timer and indicates that a solve has stopped.
     */
      cancel(t) {
        this.started = null
        this.ended = true
        this.time = t
        this.solvable = null
        this.kill = true
      }

    /** 
     * Resets the state
     */
      reset() {
        this.kill = false
      }

  }