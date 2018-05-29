var winArr = [
  ["#0-0", "#1-0", "#2-0"], // top row
  ["#0-1", "#1-1", "#2-1"], // middle row
  ["#0-2", "#1-2", "#2-2"], // bottom row
  ["#0-0", "#0-1", "#0-2"], // left column
  ["#1-0", "#1-1", "#1-2"], // middle column
  ["#2-0", "#2-1", "#2-2"], // right column
  ["#0-0", "#1-1", "#2-2"], // back slash
  ["#0-2", "#1-1", "#2-0"] // forward slash
]

var marksOnBoard = 0
var mark = 'X'

function resetGame() {
  marksOnBoard = 0
  mark = "X"
  debugger
}

function elementContains(id, mark) {
  return $(id).text() === mark
}

function playerWon(mark) {
  for (var idx = 0; idx < winArr.length; idx++) {
    var winCombo = winArr[idx]
    var won = winCombo.every(id => elementContains(id, mark))
    if (won) return true
  }
  return false
}


function markCell() {
  if (!this.innerText) {
    this.innerText = mark
    marksOnBoard++
    if (playerWon(mark)) {
      console.log(mark, "won the game!")
      resetGame()
    } else if (marksOnBoard === 9) {
      console.log("It is a tie game!")
      resetGame()
    }
    mark = (mark === 'X') ? 'O' : 'X'
  }
}

function listenForClicksOnCells() {
  $(".cell").click(markCell)
}

listenForClicksOnCells()
