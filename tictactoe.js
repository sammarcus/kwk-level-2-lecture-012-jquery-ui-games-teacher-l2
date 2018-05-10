var turn = 0;
var winningCombos = [[[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]], [[0,0],[1,1],[2,2]], [[0,0],[0,1],[0,2]], [[2,0],[2,1],[2,2]], [[1,0],[1,1],[1,2]], [[2,0],[1,1],[0,2]]]

function checkCells(ary) {
  for(var i = 0; i < ary.length; i++) {
    var winningCombo = ary[i];
    var x = winningCombo[0];
    var y = winningCombo[1];
    var selector = $('[data-x="' + x + '"][data-y="' + y + '"]')
    if( noCellMatch(selector)) {
      return false;
    }
  }
  return true;
}

function checkWinner() {
  for(var i = 0; i < winningCombos.length; i++) {
    if(checkCells(winningCombos[i]) == true) {
      message("Player " + player() + " Won!");
      return true;
    }
  }
  return false;
}

function player() {
  if(turn % 2 == 0) {
    return "X";
  }
  else {
    return "O";
  }
}

function tie() {
  var thereIsATie = true;
  $("td").each(function() {
    if ($(this).html().length <= 0) {
      thereIsATie = false;
    }
  });
  if (thereIsATie) message("Tie game");
  return thereIsATie;
}

function noCellMatch(element) {
  return (element.html() != player())
}

function doTurn(event){
  updateState(event);
  if(checkWinner() || tie() ) {
    resetGame();
  } else {
    turn += 1;
  }
}

function resetGame() {
  $("td").html("");
  turn = 0;
}

function message(message) {
  $("#message").html(message);
}

function updateState(event) {
  $(event.target).html(player());
}

function attachListeners() {
  $("tbody").click(function(event) {
    doTurn(event)
  });
}
