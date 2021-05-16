window.onload = function(){
    
    var food = document.getElementById("food");
    var snake = document.getElementById("snake");
    var score_board = document.getElementById("score-board");
    var score = 0;
    
    var dir = null;
    var pre_dir =  null;
    var speed = 10;
   
    
    function random_num(){
        return Math.floor( Math.random() * 30)*10;
    }
    
    function random_food(){
        var position_top = random_num();
        var position_left = random_num();
        food.style.top = position_top + "px";
        food.style.left = position_left + "px";
        
    }

    function eat_food(){
        if(snake.children[0].offsetLeft == food.offsetLeft && snake.children[0].offsetTop == food.offsetTop){
            random_food();
            var snake_body = document.createElement("div");
            snake.appendChild(snake_body);
            add_score();
        }
    }

    function snake_death(){
        
        if(snake.children[0].offsetLeft <= 0 && dir == "ArrowLeft" || snake.children[0].offsetLeft >= 290 && dir == "ArrowRight" || snake.children[0].offsetTop <= 0 && dir == "ArrowUp" || snake.children[0].offsetTop >= 290 && dir == "ArrowDown"){
            dir = null;
            clearInterval(game_over);
            alert("Game Over!");
        }
    
        for(var i = 1; i < snake.children.length; i++){
            if(snake.children[0].offsetLeft == snake.children[i].offsetLeft && snake.children[0].offsetTop == snake.children[i].offsetTop){
                dir = null;
                clearInterval(game_over);
                alert("Game Over!");
            }
        }
    }

    function add_score(){
        score++;
        score_board.innerHTML = score;
    }

   var game_over = setInterval(function(){
    snake_death();
    eat_food();

    for(i = snake.children.length-1; i > 0; i--){
        snake.children[i].style.top = snake.children[i-1].offsetTop+"px";
        snake.children[i].style.left = snake.children[i-1].offsetLeft+"px";
    }

        switch(dir){
            case "ArrowUp":
                    snake.children[0].style.top = snake.children[0].offsetTop-speed+"px";
                    break;
            case "ArrowDown":
                    snake.children[0].style.top = snake.children[0].offsetTop+speed+"px";
                    break;
            case "ArrowLeft":
                    snake.children[0].style.left = snake.children[0].offsetLeft-speed+"px";
                    break;
            case "ArrowRight":
                    snake.children[0].style.left = snake.children[0].offsetLeft+speed+"px";
                    break;
    
    }
   }, 100);


    document.addEventListener("keydown", function(event){

        pre_dir = dir;
        dir = event.key;
        if(pre_dir == "ArrowUp" && dir == "ArrowDown"){
            dir = pre_dir;
        }else if(pre_dir == "ArrowDown" && dir == "ArrowUp"){
            dir = pre_dir;
        }else if(pre_dir == "ArrowLeft" && dir == "ArrowRight"){
            dir = pre_dir;
        }else if(pre_dir == "ArrowRight" && dir == "ArrowLeft"){
            dir = pre_dir;
        }

        console.log(dir);
        
    });



}