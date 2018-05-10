# jQuery Logic



## Objectives

Now that we've learned what jQuery can do for us visually, let's explore how far we can leverage it for logic. We're going to walk through building a simple game of Tic-Tac-Toe. 



## SWBATS

- Explain the extent of logic and understand when it is appropriate to use
- Use jQuery methods to manipulate specific UI elements



## Introduction

We're going to be using JavaScript and jQuery to make a 2-player functional game that keeps track of the winner. Input will be through the mouse.

## Board Set Up

The `index.html` page, when served, looks like this:

![tic-tac-toe board](https://s3-us-west-2.amazonaws.com/web-dev-readme-photos/js/jquery-tic-tac-toe-board)

The grid is made by a table. It's empty of course, but will make for a great game later. At the technical level, each square is in a table row, or `tr` and each square is a table data, or `td` (you could also call this a cell).

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
```

Let's break this down. Each `td` has two data attributes: x and y coordinates. The top left `td` had an x of 0 and a y of 0.

```html
<td data-x="0" data-y="0"></td>
```

The middle `td` has an x of 1 and a y of 1.

```html
<td data-x="1" data-y="1"></td>
```

The lower right corner has an x of 2 and a y of 2.

```html
<td data-x="2" data-y="2"></td>
```



#### Turns and Wins

We need to set up the frame for the gameplay:

```js
var turn = 0;
var winningCombos = [[[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]], [[0,0],[1,1],[2,2]], [[0,0],[0,1],[0,2]], [[2,0],[2,1],[2,2]], [[1,0],[1,1],[1,2]], [[2,0],[1,1],[0,2]]]
```

Since we'll be keeping track of turns through counting them, we'll establish `turn` at 0 and increment it later. There are 8 theoritical possible combinations any board can have to win, so we've set these up in an array, repectively.

#### Reading the Board

First things first, we'll need to have jQuery read the board. Each `td` or cell in the table has two data attributes, "x" and "y". jQuery has built out a function, `data()`. Say we had a basic HTML button:

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
    if( noCellMatch(selector)) {
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
Notice that we have the `||`, meaning if there is a winner OR a tie, we know the game has come to an end. Cool! We're nearly done, but now comes the fun part of adding jQuery. We'll need to have a function that listens for when a player clicks on a cell and then calls `doTurn()` with the data it needs.

```js
var attachListeners = function() {
  $("tbody").click(function(event) {
    doTurn(event)
  });
}
```






```js
var noCellMatch = function(element) {
  return (element.html() != player())
}
```







```js
var resetGame = function() {
  $("td").html("");
  turn = 0;
}
```



```js
var message = function(message) {
  $("#message").html(message);
}
```
```js
var updateState = function(event) {
  $(event.target).html(player());
}
```












## STEPS with JavaScript

* `attachListeners()`
  * You must have a function called `attachlisteners()`
  * When a client clicks on a cell, the function `doTurn()` should be called and passed a parameter of the event
* `doTurn()`
  * Increment the variable `turn` by one
  * Should call on the function `updateState()` and pass it the event
  * Should call on `checkForWinners()`
* `player()`
  * If the turn number is even, this function should return the string "X", else it should return the string "O"
* `updateState()`
  * **This method should call on `player()` and add the return value of this function to the clicked cell on the table**
* `checkWinner()`
  * This function should evaluate the board to see if anyone has won
  * If there is a winner, this function should make one of two strings: "Player X Won!" or "Player O Won!". It should then pass this string to `message()`.
* `message()`
  * **This function should accept a string and add the string to the `div` with an id of "message"** 

## Viewing your work

There a couple options to view how your code is behaving:

* You can right click on your `index.html` file from Sublime or Finder and select `Open in Browser`.




