# jQuery Logic

**NOTE:** This lecture should be coded step by step in front of the students. Please take a moment to remove the provided code in `tictactoe.js` and make sure you are familiar with the steps described below.

## Objectives

Now that we've covered what jQuery can do for us visually, this lecture explores how far we can leverage jQuery to help integrate JavaScript logic with the DOM. This lecture aims to teach jQuery/JavaScript/DOM while building an example of a simple Tic-Tac-Toe implementation.


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



Now that the move has been conveyed, we need to do a few things to process it. At a minimum, we'll want to increment our tally of how many turns have elapsed, check if there is a winner (or other outcome of the game), and communicate the outcome to the players. We've abstracted some of the logic for winning and resetting below, but this processor facilitates running these actions in the proper order, through basic conditionals.

```js
function processTurn(event) {
  turnCount++ // increments turn tally after each move
  const winner = checkWon() // determines if there is a winner
  if (winner) {
    window.alert(`${winner} WON!`) // display WHO won
    resetGame() // resets the game to play again
  } else if (turnCount === 9) {
    window.alert(`GAME TIED!`)
    resetGame()
  }
}
```



#### Edge Cases

In programming, it's easy to assume what we think **should** happen. Naturally, there will be a winner! However, often through no fault of their own, users have a way of finding very unique circumstances that may bring our program to a state we had never expected it would be in.



![img](https://media.giphy.com/media/8F3su6mBqzy3ShRLsw/giphy.gif)



Besides winning, the only other possible outcome is a tie. While not a particularly *extreme* edge case, it is still an outcome less likely to occur than winning — a win can happen as early as the 5th turn, yet the only way a tie can occur is if all cells are occupied (and 9 turns have been played). 



#### Reading the Board

#### Winning

Now we jump into how to find a winner. Think about what it takes to win a game: the game ends as soon as any 9 cells contain three of the same characters in a neigboring cell. Considering all posibile outcomes, that means there are 8 possible winning combinatons. We can represent this in an array of data that will like confusing, but will be explained:

```js
var winningCombos = [
  [[0, 0], [1, 0], [2, 0]], // this is the top row, from left to right
  [[0, 1], [1, 1], [2, 1]],
  [[0, 2], [1, 2], [2, 2]],
  [[0, 0], [1, 1], [2, 2]],
  [[0, 0], [0, 1], [0, 2]],
  [[2, 0], [2, 1], [2, 2]],
  [[1, 0], [1, 1], [1, 2]],
  [[2, 0], [1, 1], [0, 2]] // this is diagonal, between lower left cell and upper right cell
]
```

What you are looking at above is 8 arrays, one per line, with 3 smaller nested arrays inside each of the 8. Remembering that we start counting at zero, each smaller array is simply the positional location of the winning cell. Remember how in `getPlayerMarker` we established it didn't matter (for the purposes of seeing if someone won) *who* actually won? Same idea here. By abstacting out just the *location* of each winning cell, we have a formula of where the winner made their winning move. 

Let's set up two actions, one to assemble the combination where the user has clicked, and the other to calculate if the combination results in a win.

```js
function comboMade(arr) {
  const cells = arr.map(coord => $(getCellID(coord)))
  const marker = cells[0].text()
  const comboMade = cells.every(cell => cell.text() === marker)
  return comboMade ? marker : false // here is another ternary like earlier, just a shorthand for an if statement
}
```

We're going to use this for our next function, which will verify if a win occurred (given we supply it with the appropriate data!). If not, it will return back `false`, that there is no winner. This is comparing the arrays we established in `winningCombos` against the combination passed in that was generated from `comboMade`.

```js
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
```



#### Resetting

When a game finsihes up, it would be great if it cleared the board or us and prepared us for a new game:



```js
function resetGame() {
  $("td").html(""); // sets to an empty string
  turnCount = 0;  // brings turnCount back to zero for next game
}
```

If we were playing with pen and paper, we'd have to draw a new board out. Not for our page! Since we already have the board, we can use jQuery to clear the cell's HTML value to an empty string. The final set that might not be as obvious (and, alas, wouldn't be necessary with pen and paper) is to reset `turnCount` back to zero.



#### Styling

There's not much fun in a plain old white board! With a little CSS we can make things more interesting. We like to keep things retro, so our `body` element is set to ` background-color: purple;`, and our `table`  a snazzy  `background-color: orange;`.  Open up `index.css` file to change things up!





## Playing along

In terms of actually playing, all we need to do is right click on your `index.html` file from Sublime or Finder and select `Open in Browser`. 
