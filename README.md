# jQuery Logic

**NOTE:** This lecture should be coded step by step in front of the students. Please take a moment to remove the provided code in `tictactoe.js` and make sure you are familiar with the steps described below. Neither our style sheet, `index.css`, nor the provided html, `index.html`, should require editing. 

## Objectives

Now that we've covered what jQuery can do for us visually, this lecture explores how far we can leverage jQuery to help integrate JavaScript logic with the DOM. This lecture aims to teach jQuery/JavaScript/DOM while building an example of a simple Tic-Tac-Toe implementation.


## SWBATS

- JAVASCRIPT - Identify JavaScript's role in front end web development
- JAVASCRIPT/JQUERY - Leverage jQuery methods to manipulate specific DOM elements to add interactivity


## Introduction

We're going to be using JavaScript and jQuery to make a 2-player Tic-Tac-Toe game. JavaScript will do the majority of the work, with jQuery stepping in to facilitate DOM interaction. 

There are a few discrete things we will want to address when making a Tic-Tac-Toe game. If we were beginning to architect our program, we might start with a list like this:
  - create the visual board (completed already! `index.html` and `index.css` have all we need there)
  - capture player clicks on cells
  - alternate back and forth, between 'X' and 'O'
  - after every turn, check whether the game is over
  - display game-over/winner/scratch
  - logic to reset the game and start over without refreshing the browser

Going forward, we will address each of these in turn.


#### Board Set Up

Aside from the exact background color, the `index.html` page should look like this when opened in Chrome:

![tic-tac-toe board](https://curriculum-content.s3.amazonaws.com/KWK/tic-tac-toe-board.png)

While the required HTML has all been provided, let's take a quick look at `index.html` to make sure we are familiar with the lay of the land before we begin adding our logic. We have a board, made up of three rows, made up of three cells each. Those cells are empty to start, but we will populate them with either an 'X' or an 'O' when a player clicks on them:

```html
<div id="board">
  <div class="row">
    <div id="0-0" class="cell"></div>
    <div id="1-0" class="cell"></div>
    <div id="2-0" class="cell"></div>
  </div>
  <div class="row">
    <div id="0-1" class="cell"></div>
    <div id="1-1" class="cell"></div>
    <div id="2-1" class="cell"></div>
  </div>
  <div class="row">
    <div id="0-2" class="cell"></div>
    <div id="1-2" class="cell"></div>
    <div id="2-2" class="cell"></div>
  </div>
</div>
```

If you look closely, you will notice that our cells above all have unique identifiers. This is useful if we want to programmatically and directly access one of them in particular (as opposed to looking through an array of rows, and then an array of cells once the correct row is found). 

The unique identifiers for the cells follows a logical convention: 

**NOTE:** before the following, query the students to see if any of them can, looking at the `id` values for the cells, explain why the current convention makes sense.

All ids are in the following format: `id = "<columnIdx>-<rowIdx>"`.

Alright, we have a whole program to write, and it can be difficult to know where to start. At times like this, you may benefit from identifying _discrete_ components of your program that you know you need to have, and knocking them out one by one before turning to the larger functionality. We will start with just that by implementing the most discrete functionality we can identify: drawing 'X'/'O'.

#### Placing Tiles

We want to reduce the 'barriers to interactivity' for users trying to play our epic tic-tac-toe and allow them to intuitively place their marker on the screen. An on-click listener that draws a mark in a cell should work well for this. As we know, jQuery makes attaching event listeners to elements trivial. Let's start by making a function that attaches an "on click" event listener to every cell:

```js
// index.js

// while the name is not beautiful, it does accurately describe what the function should do!
function listenForClicksOnCells() {
  $(".cell").click(event => {
    console.log(event)
  })
}

listenForClicksOnCells() // and, of course, we need to invoke it so it does just that!
```

OK! Let's continue being reasonable developers and stop here to test what we have in the browser. We should see something logging out in the console along the lines of: 

```js 
w.Event {originalEvent: MouseEvent, type: "click", isDefaultPrevented: ƒ, target: 'div#2-0.cell', currentTarget: 'div#2-0.cell'}
```

It looks like our "on click" event listener is working just fine. This is only half the job, though. As you know, event listeners are paired with event handlers so we can actually _do something_ when an event is recognized. 

We currently only have a `console.log()`, which is printing the cell itself, stubbed in where our event handler should be. Let's make one now:

```js
// index.js
function markCell() {
  this.innerText = "X" // 'this' is a reference to the element that was clicked (the cell) 
}

// and let's refactor our listener to invoke this function whenever it triggers:
function listenForClicksOnCells() {
  $(".cell").click(markCell)
}
```

BOOM! We should have working code in the browser (no matter that all we can do is make 'X's). Let's address an alternating placement of 'X' and 'O' in the next step.


#### Taking Turns

As we know, HTML is insufficient to keep track of "who's turn it is". We will need to write some JavaScript to manage the gameplay. Let's keep things as simple as possible, and add in a global variable that is keeping track of the next character that should be drawn. Once we have that, all we need to do is make sure to swap it with the opposite character after every turn:

```js
// index.js
var mark = 'X'

function markCell() {
  this.innerText = mark
  // if the mark is currently 'X', assign it 'O', otherwise assign it 'X'
  mark = (mark === 'X') ? 'O' : 'X'
}
```

**NOTE:** Show this in the browser. We should be able to draw "X" and an "O" in every cell. Also show what happens when we click on a cell that has already been filled. 

That looks pretty good, but if we are being responsible and checking our results in the browser, we quickly see an error: 'X' and 'O' can overwrite each other. This should be a simple fix: 

```js
function markCell() {
  if (!this.innerText) {
    this.innerText = mark
    mark = (mark === 'X') ? 'O' : 'X'
  }
}
```

Ok, that is a pretty simple solution. We could have done this a number of ways, but this pretty explicitly says, "Mark a cell only if its inner text is falsey." As empty string (`""`) evaluates as "falsey", this works just fine.


#### Implementing Game Over Scenarios

We are almost finished with basic tic-tac-toe. Next, we will implement the functionality to check whether a game is over. As you know, there are two end-game scenarios in the cutthroat game of tic-tac-toe: a player wins or a tie is called. Let's code each in turn: 

###### Won Game

This will be the most 'programming heavy' portion of our game. There exist, for each player, 8 possible winning combinations: 3 horizontal, 3 vertical, 2 diagonal. We know we need to check whether a player has won after every single move. Furthermore, we need some way to store all our winning combinations (array!) so we can compare them against the current board. Let's start with making a collection that holds arrays of winning `#id` combos:

```js
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
```

...with this in hand, we can add a function, to be executed after every move, that checks the just-placed mark against every win combination. If that character is found in all of the spots of any single win combination, we know they have won!

**NOTE:** Make sure you are familiar with the [`Array.prototype.every`][every] method!

```js
// takes in a DOM id and checks whether its text is equal to the second argument (mark)
function elementContains(id, mark) {
  return $(id).text() === mark
}

// to be run after each turn. checks whether a given mark ('X'/'O') populates all three spots in any given win combination
function playerWon(mark) {
  for (var idx = 0; idx < winArr.length; idx++) { // for every win combination
    var winCombo = winArr[idx]
    var won = winCombo.every(id => elementContains(id, mark)) // check if elementContains returns true for every id
    if (won) return true
  }
  return false // if we got here, it means no winning combination was found and we can safely return false
}
``` 

**NOTE:** Take your time going through these additions we just made -- they are a big leap over the previous steps. 

Assuming these functions are working properly (we should really test them with `console.log()`s before moving on), all we need to do now is make sure `playerWon()` is called every time a mark is made. The natural place for that is in our event-handler:

```js
function markCell() {
  if (!this.innerText) {
    this.innerText = mark
    if (playerWon(mark)) {
      console.log(mark, "won the game!")
    }
    mark = (mark === 'X') ? 'O' : 'X'
  }
}
```

There we go! That handles our 'game won' scenario. Now just to handle our 'tie game' case:

###### Tie Game

Keeping things as simple as possible, all we need to do here is check whether all the tiles have been filled in. Let's be lazy and make a global variable that keeps track of how many times a mark has been placed. We know 9 is, and always will be, the maximum amount of times the players can move. This makes our life easy! We ask: "has someone won? No? If 9 marks been made it is a tie!":

```js
var marksOnBoard = 0

// ...

function markCell() {
  if (!this.innerText) {
    this.innerText = mark
    marksOnBoard++
    if (playerWon(mark)) {
      console.log(mark, "won the game!")
    } else if (marksOnBoard === 9) {
      console.log("It is a tie game!");
    }
    mark = (mark === 'X') ? 'O' : 'X'
  }
}
```

We are about there. We have our end game conditions all hooked up and, using `console.log()`, we can see that they are working properly. All we have left to do now is add in the ability to reset a game as well as some **JAZZ!**

#### Reset Game

This one should be straight forward:

```js
function resetGame() {
  marksOnBoard = 0
  mark = "X"
  $(".cell").text("")
}
```

What we have above will reset our game-dictating global variables to their starting values and reset the board. If we throw this in our `index.js`, we can run it in the console (`resetGame()`) anytime to check that it is working. To incorporate this into our game logic, we need it following our end-game conditions:

```js
function markCell() {
  if (!this.innerText) {
    this.innerText = mark
    marksOnBoard++
    if (playerWon(mark)) {
      console.log(mark, "won the game!")
      resetGame()
    } else if (marksOnBoard === 9) {
      console.log("It is a tie game!");
      resetGame()
    }
    mark = (mark === 'X') ? 'O' : 'X'
  }
}
```

**NOTE:** Take a moment now to make sure everything is working as intended. Is there any functionality that is missing? Do we want to be able to draw 



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

[every]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
