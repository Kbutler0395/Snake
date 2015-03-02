Advanced usage
==============

## Overriding settings

Many settings are available as constructor parameters, and I would do my best to keep it as customizable as possible. 

Here is the list of all available settings: 

``` javascript 
$.fn.snake.defaults = {
    id: 'snake-canvas', // Canvas ID
    classes: 'snake-canvas', // Canvas classes
    canvasBackground: "#ffffff", // Canvas background color
    canvasHeight: 250, // Canvas height (in pixels)
    canvasStyle: "", // CSS to add to canvas
    canvasWidth: 250, // Canvas width (in pixels)
    foodColor: "#ff00000", // Inner color of the food
    foodBorder: "#ffffff",  // Border color of the food
    snakeColor: "#000000", // Inner color of the snake
    snakeBorder: "#ffffff", // Border color of the snake
    snakeLength: 5, // Initial length of the snake
    startOnLoad: false, // Start when the page is loaded. If false, then you must call $.fn.snake.start(); to launch the game (see below)
    defaultDirection: "right", // The snake will start in this direction
    cellWidth: 10, // Width and height of a cell (in pixels)
    wallColision: true, // If the game end when the snake hits a wall
    timer: 60, // The lower the timer is, the faster the snake will be
    callback: function() // The function to call when the game end
    {
        $.fn.snake.init();
    }
};
```

## Overriding methods

Some methods can be interesting to override, since they can change the way the user interact with the game, 
or even your website interact with it. You can, for example, want to display the score in your own HTML element instead 
of the bottom of the canvas as it is set by default. 

The list of methods you can safely override is here: 

``` javascript 
    $.fn.snake.displayScore(); // Used to display the score
``` 

## Using methods

Other methods are available to use to provide more flexibility in the way you integrate this plugin to your website. 
Interesting methods to call on your will are listed here: 

``` javascript 

    $.fn.snake.start(); // Start the game
    $.fn.snake.pause(); // Pause the game
    $.fn.snake.resume(); // Unpause the game

```
