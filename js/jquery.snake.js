 /*
 * This file is part of the Snake JQuery plugin.
 *
 * (c) Rémi Houdelette <https://github.com/B0ulzy>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
 
 (function($) {
    /**
     * Init the canvas and settings
     * 
     * @param   object  options
     * 
     * @return  object
     */
    $.fn.snake = function(options) {
        $.fn.snake.settings = $.extend({}, $.fn.snake.defaults, options);

        // Create the canvas
        var canvas = $('<canvas></canvas>', {
            id: $.fn.snake.settings.id, 
            class: $.fn.snake.settings.classes, 
            style: 'width: ' + $.fn.snake.settings.canvasWidth + 'px; height: ' + $.fn.snake.settings.canvasHeight + 'px; background: ' + $.fn.snake.settings.canvasBackground + '; ' + $.fn.snake.settings.canvasStyle, 
        });
        canvas.attr('width', $.fn.snake.settings.canvasWidth + 'px');
        canvas.attr('height', $.fn.snake.settings.canvasHeight + 'px');
        canvas.appendTo(this);

        $.fn.snake.ctx = canvas[0].getContext('2d');
        $.fn.snake.init();

        return this;
    }; 



    // Default settings
    $.fn.snake.defaults = {
        id: 'snake-canvas', 
        classes: 'snake-canvas', 
        canvasBackground: "#ffffff", 
        canvasHeight: 250, 
        canvasStyle: "", 
        canvasWidth: 250, 
        foodColor: "#ff0000", 
        foodBorder: "#ffffff",  
        snakeColor: "#000000", 
        snakeBorder: "#ffffff", 
        snakeLength: 5, 
        startOnLoad: false, 
        defaultDirection: "right", 
        cellWidth: 10, 
        wallColision: true, 
        timer: 60, 
        callback: function() 
        {
            $.fn.snake.init();
            $.fn.snake.start();
        }
    };

    /**
     * Create the array of the snake
     */
    $.fn.snake.createSnake = function()
    {
        var settings = $.fn.snake.settings;

        $.fn.snake.snakeArray = [];
        for (var i = settings.snakeLength; i > 0; i--) {
            $.fn.snake.snakeArray.push({
                x: i, 
                y: 0
            });
        }
    };

    /**
     * Create a "food" at random coordinates
     */
    $.fn.snake.createFood = function()
    {
        var settings = $.fn.snake.settings;
        var snake = $.fn.snake.snakeArray;

        var x = Math.round(Math.random() * (settings.canvasWidth - settings.cellWidth)/settings.cellWidth);
        var y = Math.round(Math.random() * (settings.canvasHeight - settings.cellWidth)/settings.cellWidth);

        for(var i = 0; i < snake.length; i++) {
            if (snake[i].x == x && snake[i].y == y) {
                return $.fn.snake.createFood();
            }
        }

        $.fn.snake.food = {
            x: x, 
            y: y
        };
    };

    /**
     * Init the game
     */
    $.fn.snake.init = function() 
    {
        var settings = $.fn.snake.settings; 

        $.fn.snake.running = false;
        $.fn.snake.direction = settings.defaultDirection;
        $.fn.snake.score = 0;

        // Create the snake
        $.fn.snake.createSnake();

        // Create the first food element
        $.fn.snake.createFood();

        if (settings.startOnLoad === true) {
            $.fn.snake.start();
        }
    };

    /**
     * Start the game
     */
    $.fn.snake.start = function()
    {
        if (typeof $.fn.snake.game != "undefined") {
            clearInterval($.fn.snake.game);
        }

        $.fn.snake.game = setInterval(function()
        {
            $.fn.snake.process(); 
        }, $.fn.snake.settings.timer);

        $.fn.snake.running = true;
    };

    /**
     * Pause the game
     */
    $.fn.snake.pause = function()
    {
        clearInterval($.fn.snake.game);

        $.fn.snake.running = false;
    };

    /**
     * Resume the game
     */
    $.fn.snake.resume = function()
    {
        $.fn.snake.game = setInterval(function()
        {
            $.fn.snake.process(); 
        }, $.fn.snake.settings.timer);

        $.fn.snake.running = true;
    };

    /**
     * Move the snake and check events, such as:
     * - eat food
     * - wall collision
     * - eat his own tail
     * 
     * Display elements on canvas
     */
    $.fn.snake.process = function() 
    {
        var ctx = $.fn.snake.ctx; 
        var settings = $.fn.snake.settings;
        var snake = $.fn.snake.snakeArray;
        var direction = $.fn.snake.direction; 
        var food = $.fn.snake.food;

        // Fill the entire canvas with background color
        ctx.fillStyle = settings.canvasBackground;
        ctx.fillRect(0, 0, settings.canvasWidth, settings.canvasHeight);

        // Get snake's head position
        var nx = snake[0].x;
        var ny = snake[0].y;

        // Determine new snake's head position
        if (direction == "up") {
            ny--;
        }
        else if (direction == "down") {
            ny++;
        }
        else if (direction == "left") {
            nx--;
        }
        else if (direction == "right") {
            nx++;
        }

        // Check the end of the game
        if ($.fn.snake.hasBiteHimself(nx, ny) || $.fn.snake.inCollision(nx, ny))
        {
            settings.callback();

            return;
        }

        // Check if the snake ate the food
        if (nx == food.x && ny == food.y)
        {
            // If it ate the food, we create a new tail element, 
            // we increase the score and we create a new food
            var tail = {
                x: nx, 
                y: ny
            };

            $.fn.snake.score++;
            $.fn.snake.createFood();
        }
        else
        {
            // Else, the new head of the snake will be its tail
            var tail = $.fn.snake.snakeArray.pop(); //pops out the last cell
            tail.x = nx; 
            tail.y = ny; 
        }

        $.fn.snake.snakeArray.unshift(tail);

        // Display data on canvas
        $.fn.snake.displaySnake();
        $.fn.snake.displayFood(); 
        $.fn.snake.displayScore();
    };

    /**
     * Checks if the new snake coordinates are 
     * in conflict with its current position
     * 
     * @param   integer     x
     * @param   integer     y
     * 
     * @return  boolean
     */
    $.fn.snake.hasBiteHimself = function(x, y) 
    {
        var snake = $.fn.snake.snakeArray;

        for(var i = 0; i < snake.length; i++) {
            if (snake[i].x == x && snake[i].y == y) {
                return true;
            }
        }

        return false;
    };

    /**
     * Check if the snake go into a wall
     * 
     * @param   integer     x
     * @param   integer     y
     * 
     * @return  boolean
     */
    $.fn.snake.inCollision = function(x, y)
    {
        var settings = $.fn.snake.settings; 

        if (settings.wallCollision === false) 
        {
            return false;
        }

        return (x < 0 || x >= settings.canvasWidth / settings.cellWidth || y < 0 || y >= settings.canvasHeight / settings.cellWidth);
    };

    /**
     * Draw the snake
     */
    $.fn.snake.displaySnake = function() 
    {
        var ctx = $.fn.snake.ctx; 
        var settings = $.fn.snake.settings;
        var snake = $.fn.snake.snakeArray;

        ctx.fillStyle = settings.snakeColor;
        ctx.strokeStyle = settings.snakeBorder; 

        for(var i = 0; i < snake.length; i++) {
            ctx.fillRect(snake[i].x * settings.cellWidth, snake[i].y * settings.cellWidth, settings.cellWidth, settings.cellWidth);
            ctx.strokeRect(snake[i].x * settings.cellWidth, snake[i].y * settings.cellWidth, settings.cellWidth, settings.cellWidth);
        }
    };

    /**
     * Draw the food
     */
    $.fn.snake.displayFood = function()
    {
        var ctx = $.fn.snake.ctx;
        var settings = $.fn.snake.settings;
        var food = $.fn.snake.food;

        ctx.fillStyle = settings.foodColor;
        ctx.fillRect(food.x * settings.cellWidth, food.y * settings.cellWidth, settings.cellWidth, settings.cellWidth);
        ctx.strokeStyle = settings.foodBorder;
        ctx.strokeRect(food.x * settings.cellWidth, food.y * settings.cellWidth, settings.cellWidth, settings.cellWidth);
    };

    /**
     * Display the score
     */
    $.fn.snake.displayScore = function()
    {
        var scoreText = "Score: " + $.fn.snake.score;
        $.fn.snake.ctx.fillText(scoreText, 5, $.fn.snake.settings.canvasHeight - 5);
    };

    /**
     * Set the snake keyboard controllable
     */
    $(document).keydown(function(e)
    {
        if ($.fn.snake.running !== true) {
            return;
        }

        var key = e.which;

        if (key == "37" && $.fn.snake.direction != "right") {
            $.fn.snake.direction = "left";
        }
        else if (key == "38" && $.fn.snake.direction != "down") {
            $.fn.snake.direction = "up";
        }
        else if (key == "39" && $.fn.snake.direction != "left") {
            $.fn.snake.direction = "right";
        }
        else if (key == "40" && $.fn.snake.direction != "up") {
            $.fn.snake.direction = "down";
        }
    });
}(jQuery));
