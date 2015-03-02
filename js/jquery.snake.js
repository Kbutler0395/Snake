 (function($) {
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
        foodColor: "#ff00000", 
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
        }
    };

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

    $.fn.snake.init = function() 
    {
        var settings = $.fn.snake.settings; 

        $.fn.snake.running = false;
        $.fn.snake.direction = settings.defaultDirection;

        // Create the snake
        $.fn.snake.createSnake();

        // Create the first food element
        $.fn.snake.createFood();

        if (settings.startOnLoad === true) {
            $.fn.snake.start();
        }
    };

    $.fn.snake.start = function()
    {
        $.fn.snake.score = 0;

        if (typeof $.fn.snake.game != "undefined") {
            clearInterval($.fn.snake.game);
        }

        $.fn.snake.game = setInterval(function()
        {
            $.fn.snake.process(); 
        }, $.fn.snake.settings.timer);

        $.fn.snake.running = true;
    };

    $.fn.snake.pause = function()
    {
        clearInterval($.fn.snake.game);

        $.fn.snake.running = false;
    };

    $.fn.snake.resume = function()
    {
        $.fn.snake.game = setInterval(function()
        {
            $.fn.snake.process(); 
        }, $.fn.snake.settings.timer);

        $.fn.snake.running = true;
    };

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

        var nx = snake[0].x;
        var ny = snake[0].y;

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

        if ($.fn.snake.hasBiteHimself(nx, ny) || $.fn.snake.inCollision(nx, ny))
        {
            settings.callback();

            return;
        }

        if (nx == food.x && ny == food.y)
        {
            var tail = {
                x: nx, 
                y: ny
            };

            $.fn.snake.score++;
            $.fn.snake.createFood();
        }
        else
        {
            var tail = $.fn.snake.snakeArray.pop(); //pops out the last cell
            tail.x = nx; 
            tail.y = ny; 
        }

        $.fn.snake.snakeArray.unshift(tail);

        $.fn.snake.displaySnake();
        $.fn.snake.displayFood(); 
        $.fn.snake.displayScore();
    };

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

    $.fn.snake.inCollision = function(x, y)
    {
        var settings = $.fn.snake.settings; 

        if (settings.wallCollision === false) 
        {
            return false;
        }

        return (x < 0 || x >= settings.canvasWidth / settings.cellWidth || y < 0 || y == settings.canvasHeight / settings.cellWidth);
    };

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

    $.fn.snake.displayScore = function()
    {
        var scoreText = "Score: " + $.fn.snake.score;
        $.fn.snake.ctx.fillText(scoreText, 5, $.fn.snake.settings.canvasHeight - 5);
    };

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