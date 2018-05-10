# jQuery Tic-Tac-Toe

## Contents

* Objective
* HTML
* JavaScript
* Running your server
* Hints
* Resources

## Objective

Make a tic-tac-toe game that behaves like the following video (right click and select Save Link As) 

Right click on the link below and select "Save link as..." to see a video of how your calculator should behave.

[video](https://s3-us-west-2.amazonaws.com/web-dev-readme-photos/js/jquery-tic-tac-toe.mp4)

## HTML

The `index.html` page, when served, looks like this:

![tic-tac-toe board](https://s3-us-west-2.amazonaws.com/web-dev-readme-photos/js/jquery-tic-tac-toe-board)

The grid is made by a table. Each square is in a table row, or `tr` and each square is a table data, or `td` (you could also call this a cell).

Each `td` has two data attributes: x and y coordinates. The top left `td` had an x of 0 and a y of 0.

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

To figure out how jQuery can "see" these values, take a look at the Hints section.

## JavaScript

* `attachListeners()`
  * You must have a function called `attachlisteners()` which the tests call to attach the click handlers to the page after the DOM has been loaded
  * When a client clicks on a cell, the function `doTurn()` should be called and passed a parameter of the event
* `doTurn()`
  * Increment the variable `turn` by one
  * Should call on the function `updateState()` and pass it the event
  * Should call on `checkForWinners()`
* `player()`
  * If the turn number is even, this function should return the string "X", else it should return the string "O"
* `updateState()`
  * This method should call on `player()` and add the return value of this function to the clicked cell on the table
* `checkWinner()`
  * This function should evaluate the board to see if anyone has won
  * If there is a winner, this function should make one of two strings: "Player X Won!" or "Player O Won!". It should then pass this string to `message()`.
* `message()`
  * This function should accept a string and add the string to the `div` with an id of "message" 

## Running Your Server

There a couple options to view how your code is behaving:

* You can right click on your `index.html` file from Sublime or Finder and select `Open in Browser`.
* You could also run a Python server by running `python -m SimpleHTTPServer` from your terminal and visiting [http://localhost:8000](http://localhost:8000/).

## Hints

#### jQuery data()

Each `td` or cell in the table has two data attributes, "x" and "y". jQuery has built out a function, `data()`.

Take a look at it below:

```html
<p data-position="center" id="title">Comedy Cellar</p>
<p data-place="right" class="btn" id"about">About</p>
<script type="text/javascript">
  $("#title").on("click", function() {
    var location = $(this).data("position");
    console.log(location);
  });

  $("#about").on("click", function() {
    var location = $(this).data("place");
    alert(location);
  });
</script>
```

When the client clicks on `Comedy Cellar`, the JavaScript will log the string "center" to the console. 

When the client clicks on `About`, the JavaScript will make an alert box with the string "right".

Take a loook at the [jQuery data() docs](https://api.jquery.com/jquery.data/) for more info.

## Resources

* [jQuery data()](https://api.jquery.com/jquery.data/)

<p data-visibility='hidden'>View <a href='https://learn.co/lessons/jquery-tictactoe' title='jQuery Tic-Tac-Toe'>jQuery Tic-Tac-Toe</a> on Learn.co and start learning to code for free.</p>
