var turn = 0;
var winningCombos = [[[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]], [[0,0],[1,1],[2,2]], [[0,0],[0,1],[0,2]], [[2,0],[2,1],[2,2]], [[1,0],[1,1],[1,2]], [[2,0],[1,1],[0,2]]]

var checkCells = function(ary) {
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

var checkWinner = function() {
  for(var i = 0; i < winningCombos.length; i++) {
    if(checkCells(winningCombos[i]) == true) {
      message("Player " + player() + " Won!");
      return true;
    }
  }
  return false;
}

var player = function() {
  if(turn % 2 == 0) {
    return "X";
  }
  else {
    return "O";
  }
}

var tie = function() {
  var thereIsATie = true;
  $("td").each(function() {
    if ($(this).html().length <= 0) {
      thereIsATie = false;
    }
  });
  if (thereIsATie) message("Tie game");
  return thereIsATie;
}

var noCellMatch = function(element) {
  return (element.html() != player())
}

var doTurn = function(event){
  updateState(event);
  if(checkWinner() || tie() ) {
    resetGame();
  } else {
    turn += 1;
  }
}

var resetGame = function() {
  $("td").html("");
  turn = 0;
}

var message = function(message) {
  $("#message").html(message);
}

var updateState = function(event) {
  $(event.target).html(player());
}

var attachListeners = function() {
  $("tbody").click(function(event) {
    doTurn(event)
  });
}