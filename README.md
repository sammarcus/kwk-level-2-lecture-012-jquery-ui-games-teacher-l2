# jQuery Logic

**NOTE:** This lecture should be coded step by step in front of the students. Please take a moment to remove the provided code in `tictactoe.js` and make sure you are familiar with the steps described below.

## Objectives

Now that we've learned what jQuery can do for us visually, let's explore how far we can leverage it for logic. We're going to walk through building a simple game of Tic-Tac-Toe. 


## SWBATS

- JAVASCRIPT - Identify JavaScript's role in front end web development
- JAVASCRIPT/JQUERY - Leverage jQuery methods to manipulate specific DOM elements to add interactivity


## Introduction

We're going to be using JavaScript and jQuery to make a 2-player Tic-Tac-Toe game. We will use JavaScript/jQuery to track the state of the game, (if and who the winner is), as well as update the DOM as the game is played. 

## Board Set Up

The `index.html` page should look like this when opened in Chrome:

![tic-tac-toe board](https://s3-us-west-2.amazonaws.com/web-dev-readme-photos/js/jquery-tic-tac-toe-board)

The grid is made by an HTML `<table>` element. It's empty of course, as it represents a new game. The grid is made up of 3 rows (`<tr>` elements), which are made up of 3 cells each (`<td>` elements).

Here's the HTML that makes this up:

```html
<table border="1" cellpadding="40">
  
  <tr>
    <td data-x="0" data-y="0"></td>
    <td data-x="1" data-y="0"></td>
    <td data-x="2" data-y="0"></td>
  </tr>
  
  <tr>
    <td data-x="0" data-y="1"></td>
    <td data-x="1" data-y="1"></td>
    <td data-x="2" data-y="1"></td>
  </tr>
  
  <tr>
    <td data-x="0" data-y="2"></td>
    <td data-x="1" data-y="2"></td>
    <td data-x="2" data-y="2"></td>
  </tr>
  
</table>
```

If you look closely, you will notice that our cells above (the `<td>` elements) have specific attributes. Let's break this down: each cell has attributes: `data-x` and `data-y`. The top left `td` has a `data-x` of 0 and a `data-y` of 0. The `y` values represent the cell positions vertically and the `x` values represent the cell positions horizontally. For example, the top left cell is the first row, and the first column, of the board:

```html
<td &data-x="0" &data-y="0"></td>
```

...and the last cell is in the last row, and the last column, of the board:

```html
<td &data-x="2" &data-y="2"></td>
```


#### Taking Turns

As we know, HTML is insufficient to keep track of the game logic. We will need to write some JavaScript to manage the gameplay. Let's start off by writing an event listener, that waits for a user to click on a cell. We need this so our program can know when a user is trying to draw an 'X' or and 'O'. Lucky for us, jQuery makes this trivial with the `.click` method, which attached an event listener to a DOM element:

```js
// this will listen for clicks anywhere on the board
$("tbody").click(event => {
  // when the board is clicked, we can get the specific element that was clicked (aka the specific cell) through 'event.target'
  let cell = $(event.target)
  cell.html("X")
});
```

**NOTE:** Show this in the browser. We should be able to draw "X" in every cell. 

As this stands, only 'X' can be drawn, which is only half of what we want. If we want to refactor, and make this 2-player, we will need some way to keep track of which player's turn it is. To do this, we could swap some global variable back and forth between "X" and "O" every turn. We have a better solution, though, which kills two birds with one stone:

```js
var turnCount = 0

function getPlayerMarker() {
  // this ternary checks whether turnCount is odd or even and returns the respective player
  return (turnCount % 2 === 0) ? "X" : "O"
}

$("tbody").click(event => {
  $(event.target).html(getPlayerMarker())
  // we need to increment the turn
  turnCount++
});
```

**NOTE:** Show this in the browser. We should be able to draw "X" and an "O" interchangeably in every cell. 

**now we jump into how to find a winner**

**now we jump into how to reset the board**

**we have a corner case of a cat's game**


#### Reading the Board

First things first, we'll need to &have jQuery read the board. Each `td` or cell in the table has two data attributes, "x" and "y". jQuery has built out a function, `data()`. Say we had a basic HTML button:

```html
<p data-place="right" class="btn" id"start">Start game</p>
```
And that we wanted to communicate where it was after the user clicks on it:

```html
<script type="text/javascript">
  $("#start").on("click", function() {
    var location = $(this).data("place");
    alert(location);
  });
</script>


```
When the client clicks on `Start game`, the JavaScript will make an alert box with the string "right" (look back at the HTML to see that!). We are using `data()` to retrieve this. Since our game will need to be on the lookout for a winner after every turn, it will need to check who played what where, or in other words **read the data** on the board!

Take a look below:

```js
var checkCells = function(ary) {
  for(var i = 0; i < ary.length; i++) {
    var winningCombo = ary[i]; 
    var x = winningCombo[0]; 
    var y = winningCombo[1]; 
    var selector = $('[data-x="' + x + '"][data-y="' + y + '"]')
    if( noCellMatch(selector)) { //explained later
      return false;
    }
  }
  return true;
}
```

Let's break this down:

We need to check each and every cell, which are defined by their `x` and`y`coordinates. We can count up and step through to do this, and compare the data by selecting it. By using ```data-x=``` and ```data-y=```, we can capture it just like we did above. We've already defined what a winning board looks like via arrays.  If the board matches, it will return `true` (last line). We'll use that in our next function to act on a winner. Check it out:

```js
var checkWinner = function() {
  for(var i = 0; i < winningCombos.length; i++) {
    if(checkCells(winningCombos[i]) == true) {
      message("Player " + player() + " Won!");
      return true;
    }
  }
  return false;
}
```

The purpose of the above is to simply announce when someone one, and who it was. If no one won yet, then we keep it as returning `false`. If there is a winner, the function should make one of two strings: "Player X Won!" or "Player O Won!". It should then pass this string to `message()` (later).



One more thing: you'll notice that if there is NO winner, we need to return `false` Let's do that with `noCellMatch`:

```js
var noCellMatch = function(element) {
  return (element.html() != player())
}
```


### Game Progress

Let's make a new player function with a simple purpose: if the turn number is even, this function should return the string "X", else it should return the string "O". Since we're keeping track of how many turns have elapased, we can just establish that even numbered turns will be X and odd will be O:

```js
var player = function() {
  if(turn % 2 == 0) {
    return "X";
  }
  else {
    return "O";
  }
}
```

Great! Since there are many requirements for keeping track of how many turns have gone by, that still needs to be built with some simple JS. 

```js
var doTurn = function(event){
  updateState(event);
  if(checkWinner() ) {
    resetGame();
  } else {
    turn += 1;
  }
}
```
All this is doing is adding `1` to `turn` after each turn if there isn't a winner after the player has moved. The technical term for this is "incrementing". It calls on a function we'll get to below, named `updateState` and passes it the event. 

 Let's add one more thing, though -- a case for a tie game. We know that there are a maximum of nine possible turns in each game, so if there is still no winner after this, then we can assume there is a tie:


```js
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
```
This is a bit of a bonus feature, but including it lets us design our other functions knowing for sure if there is a winner or a tie. Now that we have this, we'll make a small revision to our `doTurn` above. We can add it in like so:

```js
var doTurn = function(event){
  updateState(event);
  if(checkWinner() || tie() ) {
    resetGame();
  } else {
    turn += 1;
  }
}
```
Notice that we have the `||`, meaning if there is a winner OR a tie, we know the game has come to an end. Cool! We're nearly done, but now comes the fun part of adding jQuery. We'll need to have a function that listens for when a player clicks on a cell and then calls `doTurn()` with the data it needs. This is where jQuery shines!

```js
var attachListeners = function() {
  $("tbody").click(function(event) {
    doTurn(event)
  });
}
```



Great. Now we'll add another jQuery method to call on  `player()` and add the return value of this function to the clicked cell on the table. 

```js
var updateState = function(event) {
  $(event.target).html(player())
}
```
We're making event listeners work for us! We need 3 more functions and then we'll be set.  Remember how we discussed communicating the winner to the players? We need a way to print that out. By having `message`  accept a string we give it and add that string to the `div`, we can do just that. For simplicity we'll set it to also have an id of `"message"`. 

```js
var message = function(message) {
  $("#message").html(message)
}
```



## Playing along

This alone shapes up to be a great game. As a bonus, if we want to play again, we can use one final bit of jQuery to clear the board. It also resets our turn counter to `0`, preparing us for another game!

```js
var resetGame = function() {
  $("td").html("");
  turn = 0;
}
```

---

```js
var turn = 0;
var winningCombos = [
  [[0,0],[1,0],[2,0]],
  [[0,1],[1,1],[2,1]],
  [[0,2],[1,2],[2,2]],
  [[0,0],[1,1],[2,2]],
  [[0,0],[0,1],[0,2]],
  [[2,0],[2,1],[2,2]],
  [[1,0],[1,1],[1,2]],
  [[2,0],[1,1],[0,2]]
]
```



In terms of actually playing, all we need to do is right click on your `index.html` file from Sublime or Finder and select `Open in Browser`. 
