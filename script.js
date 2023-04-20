const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

const cellSize = document.querySelector('.cell-size')
const canvasParent = document.querySelector('main')
const rowLength = window.innerWidth / cellSize.value | 0
const rowCount = (window.innerHeight - 150) / cellSize.value | 0

let blueState = document.querySelector('.blue')
let blackState = document.querySelector('.black')
let countOfBlack = document.querySelector('.black-count')
let countOfBlue = document.querySelector('.blue-count')
let firstState = ['3,3', '2,3', '3,2', '3,1', '1,2', '38,37', '39,35', '38,36', '40,36', '40,37', '39,38']
let secondState = ['20,20', '21,21', '22,20', '22,19', '23,22', '23,23', '27,17', '18,18', '15,17', '17,15', '15,15', '32,18']

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

