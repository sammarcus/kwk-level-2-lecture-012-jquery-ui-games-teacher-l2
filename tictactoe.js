var turnCount = 0
var winningCombos = [
  [[0, 0], [1, 0], [2, 0]],
  [[0, 1], [1, 1], [2, 1]],
  [[0, 2], [1, 2], [2, 2]],
  [[0, 0], [1, 1], [2, 2]],
  [[0, 0], [0, 1], [0, 2]],
  [[2, 0], [2, 1], [2, 2]],
  [[1, 0], [1, 1], [1, 2]],
  [[2, 0], [1, 1], [0, 2]]
]

function getPlayerMarker() {
  return (turnCount % 2 === 0) ? "X" : "O"
}

function getCellID(coord) {
  return '#' + coord.join("-")
}

function comboMade(arr) {
  const cells = arr.map(coord => $(getCellID(coord)))
  const marker = cells[0].text()
  const comboMade = cells.every(cell => cell.text() === marker)
  return comboMade ? marker : false
}

function checkWon() {
  for (var idx = 0; idx < winningCombos.length; idx++) {
    const combo = winningCombos[idx]
    const winner = comboMade(combo)
    if (winner) {
      return winner
    }
  }
  
  return false
}

function resetGame() {
  $("td").html("");
  turnCount = 0;
}

function processTurn(event) {
  turnCount++
  const winner = checkWon()
  if (winner) {
    window.alert(`${winner} WON!`)
    resetGame()
  } else if (turnCount === 9) {
    window.alert(`GAME TIED!`)
    resetGame()
  }
}

function updateCell(cell, marker) {
  cell.html(marker)
}

function attachListeners() {
  $("tbody").click(event => {
    const marker = getPlayerMarker()
    const cell = $(event.target)
    updateCell(cell, marker)
    processTurn()
  })
}

$(attachListeners)
