const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

const cellSize = document.querySelector('.cell-size')
const canvasParent = document.querySelector('main')
const rowLength = window.innerWidth / cellSize.value | 0
const rowCount = (window.innerHeight - 150) / cellSize.value | 0
const foo = document.querySelector('footer')

let timerId
let play = true
let blueState = document.querySelector('.blue')
let blackState = document.querySelector('.black')
let countOfBlack = document.querySelector('.black-count')
let countOfBlue = document.querySelector('.blue-count')
let firstState = ['3,3', '2,3', '3,2', '3,1', '1,2', '38,37', '39,35', '38,36', '40,36', '40,37', '39,38']
let secondState = ['20,20', '21,21', '22,20', '22,19', '23,22', '23,23', '27,17', '18,18', '15,17', '17,15', '15,15', '32,18']
let lifeColor = 'black'
let deadColor = 'white'

canvasParent.append(canvas)

render(firstState, secondState)

document.querySelector('canvas').onclick = e => canvasClickHandler(e, firstState, secondState)

window.addEventListener('keydown', (e) => {
    if (e.code == 'Space') {
        if (play) {
            timerId = setInterval(() => {
                update(firstState, secondState)
                countOfBlack.textContent = firstState.length
                countOfBlue.textContent = secondState.length
            }, 100);
        } else {
            clearInterval(timerId)
        }
        play = !play
    }

    if (e.code == 'Digit1') {
        getEgg()
    }

    if (e.code == 'Digit2') {
        getGlider()
    }

    if (e.code == 'Digit3') {
        getStone()
    }
    
})

function getRandomCoord() {
    const min = 0;
    const maxY = rowCount;
    const maxX = rowLength

    const x = Math.floor(Math.random() * (maxX - min + 1)) + min;
    let y = Math.floor(Math.random() * (maxY - min + 1)) + min;

    while (y === x) {
        y = Math.floor(Math.random() * (maxY - min + 1)) + min;
    }
    return [x, y]
}


function getEgg() {
    const [x, y] = getRandomCoord()
    console.log(checkGeneration())
    checkGeneration().push(`${x},${y}`,
        `${x + 1},${y - 1}`,
        `${x + 1},${y - 2}`,
        `${x},${y - 3}`,
        `${x - 1},${y - 1}`,
        `${x - 1},${y - 2}`)

    render(firstState, secondState)
}

function getGlider() {
    const [x, y] = getRandomCoord()

    checkGeneration().push(`${x},${y}`,
        `${x},${y + 1}`,
        `${x},${y - 1}`,
        `${x + 1},${y - 1}`,
        `${x + 2},${y}`)

    render(firstState, secondState)
}

function getStone() {
    const [x, y] = getRandomCoord()

    checkGeneration().push(`${x},${y}`,
        `${x + 1},${y}`,
        `${x},${y - 1}`,
        `${x + 1},${y - 1}`
    )

    render(firstState, secondState)
}

window.addEventListener('resize', () => {
    render(firstState, secondState)
})

cellSize.addEventListener('change', () => {
    render(firstState, secondState)
})

foo.addEventListener('click', (e) => {
    if (e.target.value == 2 && blackState.checked) {
        blackState.checked = !blackState.checked
    }
    else if (e.target.value == 1 && blueState.checked) {
        blueState.checked = !blueState.checked
    }
})

function render(state, secondState) {
    const cellSize = document.querySelector('.cell-size')
    const rowLength = window.innerWidth / cellSize.value | 0
    const rowCount = (window.innerHeight - 150) / cellSize.value | 0

    canvas.height = rowCount * cellSize.value
    canvas.width = rowLength * cellSize.value

    createGrid(rowCount, rowLength, state, secondState)
}


function createGrid(rowCount, rowLength, state, secondState) {
    for (let y = 0; y < rowCount; y++) {
        for (let x = 0; x < rowLength; x++) {
            let cell = `${x},${y}`

            ctx.fillStyle = deadColor
            ctx.strokeRect(x * cellSize.value, y * cellSize.value, cellSize.value + 1, cellSize.value + 1)

            if (state.includes(cell)) {
                ctx.fillStyle = lifeColor
                ctx.fillRect(x * cellSize.value, y * cellSize.value, cellSize.value, cellSize.value)
            } else if (secondState.includes(cell)) {
                ctx.fillStyle = 'blue'
                ctx.fillRect(x * cellSize.value, y * cellSize.value, cellSize.value, cellSize.value)
            }
        }
    }
}


function checkState() {
    if (blackState.checked) {
        return firstState
    } else if (blueState.checked) {
        return secondState
    }
}

function canvasClickHandler(e, state, secondState) {
    let cell = `${e.clientX / cellSize.value | 0},${e.clientY / cellSize.value | 0}`

    if (checkState().includes(cell)) {
        checkState().splice(checkState().indexOf(cell), 1)
    } else {
        checkState().push(cell)
    }

    render(state, secondState)
}

function cellWristing(state, secondState, cell) {
    if (secondState.includes(cell) && state.includes(cell)) {
        const dred = Math.floor(Math.random() * 2)
        if (dred) {
            state.push(cell)
            secondState.splice(secondState.indexOf(cell), 1)
        } else {
            secondState.push(cell)
            state.splice(state.indexOf(cell), 1)
        }
    }
}

function getNeighborsState(state) {
    let neighborsState = []

    for (const neib of state) {
        const neibs = getNeighbors(neib)
        for (const neb of neibs) {
            if (!neighborsState.includes(neb)) neighborsState.push(neb)
        }

    }
    return neighborsState
}

function update(state, state2) {
    firstState = getNextState(state)
    secondState = getNextState(state2)

    render(firstState, secondState)
}

function getNextState(state) {
    const nextState =
        getNeighborsState(state).filter((cell) => {
            const neighbors = getNeighbors(cell)

            const { length } = neighbors.filter(neighbor => state.includes(neighbor))

            return (length == 3 || length + state.includes(cell) == 3)
        })

    return nextState
}

function getNeighbors(cell) {
    const neighbors = []
    const [x, y] = cell.split(',').map(Number)
    neighbors.push(`${x},${wrapY(y - 1)}`,
        `${wrapX(x + 1)},${wrapY(y - 1)}`,
        `${wrapX(x + 1)},${y}`,
        `${wrapX(x + 1)},${wrapY(y + 1)}`,
        `${x},${y + 1}`,
        `${wrapX(x - 1)},${wrapY(y + 1)}`,
        `${wrapX(x - 1)},${y}`,
        `${wrapX(x - 1)},${wrapY(y - 1)}`)

    return neighbors
}

function wrapX(x) {
    if (x < 0) return rowLength - 1
    if (x > rowLength - 1) return 0
    return x
}

function wrapY(y) {
    if (y < 0) return rowCount - 1
    if (y > rowCount - 1) return 0
    return y
}
