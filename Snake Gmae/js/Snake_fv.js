window.addEventListener("load", function(){
    
    var food = this.document.getElementById("food");
    var snake = this.document.getElementById("snake");
    var snakeBody =  snake.getElementsByTagName("div");
    var score = 0;
    var level = 1;
    var score_board = this.document.getElementById("score-board");
    var level_board = this.document.getElementById("level-board");
    var dir = null;
    

    function randomNum(){
        return Math.round(Math.random()*29)*10;
    }
    
    function makeFood(){
        var top = randomNum();
        var left = randomNum();
        food.style.top = top + "px";
        food.style.left = left + "px";
    }

    this.document.addEventListener("keydown", function(event){
        var keyArr = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Up", "Down", "Left", "Right"];
        if(keyArr.indexOf(event.key) != -1){
            dir = event.key;
        }
    });


    this.setTimeout(function main(){

        var top = snakeBody[0].offsetTop;
        var left = snakeBody[0].offsetLeft;
        
        switch (dir) {
            case "ArrowUp":
                top -= 10;
                if(snakeBody[1] && top === snakeBody[1].offsetTop){
                    top += 20;
                }
                break;
            case "ArrowDown":
                top += 10;
                if(snakeBody[1] && top === snakeBody[1].offsetTop){
                    top -= 20;
                }
                break;
            case "ArrowLeft":
                left -= 10;
                if(snakeBody[1] && left === snakeBody[1].offsetLeft){
                    left += 20;
                }
                break;
            case "ArrowRight":
                left += 10;
                if(snakeBody[1] && left === snakeBody[1].offsetLeft){
                    left -= 20;
                }
                break;
                       
        }

        if(top < 0 || top > 290 || left < 0 || left > 290){
            alert("Game Over");
            return;
        }

        if(top == food.offsetTop && left == food.offsetLeft){
            makeFood();
            var growth_body = document.createElement("div");
            snake.appendChild(growth_body);
            score++;
            score_board.innerHTML = score;
            if(score % 10 == 0){
                level++;
                level_board.innerHTML = level;
            }

        }

       


        for(i = snakeBody.length-1; i > 0; i--){
            var bodyTop = snakeBody[i].offsetTop;
            var bodyLeft = snakeBody[i].offsetLeft;
            
            if(bodyTop == top && bodyLeft == left){
                alert("Game Over!");
                return;
            }

            snakeBody[i].style.top = snakeBody[i-1].offsetTop+"px";
            snakeBody[i].style.left = snakeBody[i-1].offsetLeft+"px";
        }

        snakeBody[0].style.top = top +"px";
        snakeBody[0].style.left = left + "px";



        setTimeout(main, 100-level);
    }, 100)

});