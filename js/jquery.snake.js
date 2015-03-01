(function($) {
    $.fn.snake = function(options) {
        var grid;
        var settings = $.extend({}, $.fn.snake.defaults, options);

        /**
         * Initiate the game 
         *
         * @param   object  container   The HTML element which will contains the canvas
         * @param   object  settings    An object containing game settings
         * 
         * @return  object  
         */
        function init(container, settings)
        {
            // Create the canvas
            $('<canvas></canvas>', {
                'id': settings.id, 
                'class': settings.classes, 
                'style': 'width: ' + settings.canvasWidth + '; height: ' + settings.canvasHeight + '; background: ' + settings.canvasBackground + '; border: ' + settings.canvasBorder + ';' + settings.canvasStyle
            }).appendTo(container);
        }

        init(this, settings);

        return this;
    }; 

    /**
     * Default settings
     */
    $.fn.snake.defaults = {
        id: 'snake-canvas', 
        classes: 'snake-canvas', 
        canvasBackground: "#ffffff", 
        canvasBorder: "solid 1px #000000", 
        canvasHeight: "250px", 
        canvasStyle: "", 
        canvasWidth: "250px", 
        snakeColor: "#000000", 
        cellWidth: "10px", 
        cellHeight: "10px", 
        wallColision: false
    };
}(jQuery));