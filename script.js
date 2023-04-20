const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

const cellSize = document.querySelector('.cell-size')
const canvasParent = document.querySelector('main')
const rowLength = window.innerWidth / cellSize.value | 0
const rowCount = (window.innerHeight - 150) / cellSize.value | 0

let firstState = ['3,3', '2,3', '3,2', '3,1', '1,2', '38,37', '39,35', '38,36', '40,36', '40,37', '39,38']
let secondState = ['20,20', '21,21', '22,20', '22,19', '23,22', '23,23', '27,17', '18,18', '15,17', '17,15', '15,15', '32,18']
