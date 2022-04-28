// função para iniciar o game
function start() {
    $("#initial").hide();
	$("#backgroundGame").append("<div id='player' class='anima1'></div>");
	$("#backgroundGame").append("<div id='enemy1' class='anima2'></div>");
	$("#backgroundGame").append("<div id='enemy2'></div>");
    $("#backgroundGame").append("<div id='friend' class='anima3'></div>");
    $("#backgroundGame").append("<div id='placar'></div>");
    $("#backgroundGame").append("<div id='energy'></div>");
    
    var game = {}
    var TECLA = { W: 38, S: 40, D: 68 }
    var velocity = 5;
    var positionY = parseInt(Math.random() * 334);
    var alowShoot = true;
    var endGame = false;
    var points = 0;
    var save = 0;
    var losts = 0;
    var energyActual = 3;
    var soundShoot = document.getElementById("soundShoot");
    var soundExplosion = document.getElementById("soundExplosion");
    var music = document.getElementById("music");
    var soundGameover = document.getElementById("soundGameover");
    var soundPerdido = document.getElementById("soundLost");
    var soundrescue = document.getElementById("soundrescue");
    
    game.timer = setInterval(loop,30); // deixando o background do game em loop a cada 30ms
    game.pressionou = [];
    music.addEventListener("ended", function(){ music.currentTime = 0; music.play(); }, false);
    music.play();

    //Verifica se o usuário pressionou alguma tecla
    $(document).keydown(function(e){
        game.pressionou[e.which] = true;
    });
        
    $(document).keyup(function(e){
        game.pressionou[e.which] = false;
    });
    
    // função de looping
    function loop() {
        movebackground();
        moveplayer();
        moveenemy1();
        moveenemy2();
        movefriend();
        colision();
        placar();
        energy();
    }
    
    // função que movimenta o background do game
    function movebackground() {
        esquerda = parseInt($("#backgroundGame").css("background-position"));
        $("#backgroundGame").css("background-position",esquerda-1);
    }

    // função para mover o helicóptero cinza
    function moveplayer() {
        if (game.pressionou[TECLA.W]) {
            var topo = parseInt($("#player").css("top"));
            $("#player").css("top",topo - 10);

            // limitando o helicóptero no topo da página
            if (topo<=0) {
                $("#player").css("top",topo + 10);
            }
        }

        if (game.pressionou[TECLA.S]) {
            var topo = parseInt($("#player").css("top"));
            $("#player").css("top",topo + 10);

            // limitando o helicóptero no final da página
            if (topo>=434) {	
                $("#player").css("top",topo - 10);		
            }
        }
        
        if (game.pressionou[TECLA.D]) {
            shoot(); // chama função shoot	
        }
    }

    // função para mover o enemy 1, helicóptero amarelo
    function moveenemy1() {
        positionX = parseInt($("#enemy1").css("left"));
        $("#enemy1").css("left",positionX - velocity);
        $("#enemy1").css("top",positionY);
            
        if (positionX<=0) {
            positionY = parseInt(Math.random() * 334);
            $("#enemy1").css("left",694);
            $("#enemy1").css("top",positionY);           
        }
    }

    // função para mover o enemy 2, caminhão
    function moveenemy2() {
        positionX = parseInt($("#enemy2").css("left"));
	    $("#enemy2").css("left",positionX - 3);
				
		if (positionX<=0) {
            $("#enemy2").css("left",775);		
		}
    }

    // função para mover o friend, o que vai ser resgatado
    function movefriend() {
        positionX = parseInt($("#friend").css("left"));
        $("#friend").css("left",positionX + 1);

        if (positionX > 906) {
            $("#friend").css("left",0);
        }
    }

    // função que realiza o shoot da arma do helicóptero cinza
    function shoot() {
        if (alowShoot == true) {
            soundShoot.play();
            alowShoot = false;
            topo = parseInt($("#player").css("top"))
            positionX = parseInt($("#player").css("left"))
            tiroX = positionX + 190;
            topoTiro = topo + 37;
            $("#backgroundGame").append("<div id='shoot'></div");
            $("#shoot").css("top",topoTiro);
            $("#shoot").css("left",tiroX);

            var timeShoot = window.setInterval(executeShoot, 15);
        }
        
        // função que realiza o shoot da arma
        function executeShoot() {
            positionX = parseInt($("#shoot").css("left"));
            $("#shoot").css("left",positionX + 15);
            
            if (positionX > 900) {
                window.clearInterval(timeShoot);
                timeShoot = null;
                $("#shoot").remove();
                alowShoot = true;
            }
        }
    }

    // função que verifica a colisão dos itens do game
    function colision() {
        var colision1 = ($("#player").collision($("#enemy1")));
        var colision2 = ($("#player").collision($("#enemy2")));
        var colision3 = ($("#shoot").collision($("#enemy1")));
        var colision4 = ($("#shoot").collision($("#enemy2")));
        var colision5 = ($("#player").collision($("#friend")));
        var colision6 = ($("#enemy2").collision($("#friend")));
        
        // colisão do player (helicóptero) com o enemy1, helicóptero
        if (colision1.length > 0) {
            energyActual--;
            enemy1X = parseInt($("#enemy1").css("left"));
            enemy1Y = parseInt($("#enemy1").css("top"));
            explosion1(enemy1X,enemy1Y);

            positionY = parseInt(Math.random() * 334);
            $("#enemy1").css("left",694);
            $("#enemy1").css("top",positionY);
        }

        // colisão do player (helicóptero) com o enemy2, caminhão
        if (colision2.length > 0) {
            energyActual--;
            enemy2X = parseInt($("#enemy2").css("left"));
            enemy2Y = parseInt($("#enemy2").css("top"));
            explosion2(enemy2X,enemy2Y);

            $("#enemy2").remove();
            reposicionaenemy2();
        }

        // colisão do shoot com o enemy 1, helicóptero	
        if (colision3.length > 0) {
            velocity = velocity + 0.3;
            points = points + 100;
	        enemy1X = parseInt($("#enemy1").css("left"));
	        enemy1Y = parseInt($("#enemy1").css("top"));		
            explosion1(enemy1X,enemy1Y);
        
	        $("#shoot").css("left",950);
	        positionY = parseInt(Math.random() * 334);
	        $("#enemy1").css("left",694);
            $("#enemy1").css("top",positionY);
        }

        // colisão do shoot com o enemy 2, caminhão
	    if (colision4.length > 0) {
            points = points + 50;
            enemy2X = parseInt($("#enemy2").css("left"));
            enemy2Y = parseInt($("#enemy2").css("top"));
            $("#enemy2").remove();

            explosion2(enemy2X,enemy2Y);
            $("#shoot").css("left",950);
            reposicionaenemy2();
        }

        // colisão do player (helicóptero) com o friend
	    if (colision5.length > 0) {
            save++;
            soundrescue.play();
            reposicionafriend();
            $("#friend").remove();
        }

        // colisão do friend com o enemy 2, caminhão
        if (colision6.length > 0) {
            losts++;
            friendX = parseInt($("#friend").css("left"));
            friendY = parseInt($("#friend").css("top"));
            
            explosion3(friendX,friendY);
            $("#friend").remove();
            reposicionafriend();
        }
    }

    // função da explosão, colisão com o enemy 1, helicóptero
    function explosion1(enemy1X,enemy1Y) {
        soundExplosion.play();
        $("#backgroundGame").append("<div id='explosion1'></div");
        $("#explosion1").css("background-image", "url(./src/assets/images/explosion.png)");

        var div = $("#explosion1");
        div.css("top", enemy1Y);
        div.css("left", enemy1X);
        div.animate({width: 200, opacity: 0}, "slow");
        
        var tempoexplosion = window.setInterval(removeexplosion, 1000);
        
        function removeexplosion() {
            div.remove();
            window.clearInterval(tempoexplosion);
            tempoexplosion = null;
        }
    }

    // função que reposiciona enemy2, caminhão
	function reposicionaenemy2() {
        var tempocolision4 = window.setInterval(reposiciona4, 5000);

        function reposiciona4() {
            window.clearInterval(tempocolision4);
            tempocolision4 = null;

            if (endGame == false) {
                $("#backgroundGame").append("<div id=enemy2></div");
            }
        }	
    }

    // função da explosão, colisão com o enemy 2, caminhão
	function explosion2(enemy2X,enemy2Y) {
        soundExplosion.play();
        $("#backgroundGame").append("<div id='explosion2'></div");
        $("#explosion2").css("background-image", "url(./src/assets/images/explosion.png)");

        var div2 = $("#explosion2");
        div2.css("top", enemy2Y);
        div2.css("left", enemy2X);
        div2.animate({width: 200, opacity: 0}, "slow");
        
        var tempoexplosion2 = window.setInterval(removeexplosion2, 1000);
        
        function removeexplosion2() {
            div2.remove();
            window.clearInterval(tempoexplosion2);
            tempoexplosion2 = null;
        }
    }

    // função que reposiciona o friend
	function reposicionafriend() {
        var tempofriend = window.setInterval(reposiciona6, 6000);
        
        function reposiciona6() {
            window.clearInterval(tempofriend);
            tempofriend = null;
            
            if (endGame == false) {
                $("#backgroundGame").append("<div id='friend' class='anima3'></div>");
            }
        }
    }

    // função da explosão, colisão do friend com enemy 2, caminhão
    function explosion3(friendX,friendY) {
        soundLost.play();
        $("#backgroundGame").append("<div id='explosion3' class='anima4'></div");
        $("#explosion3").css("top",friendY);
        $("#explosion3").css("left",friendX);

        var tempoexplosion3 = window.setInterval(resetaexplosion3, 1000);

        function resetaexplosion3() {
            $("#explosion3").remove();
            window.clearInterval(tempoexplosion3);
            tempoexplosion3 = null;
        }
    }

    // função que sounda a pontuação do game
    function placar() {
        $("#placar").html("<h2> points: " + points + " save: " + save + " losts: " + losts + "</h2>");
    }

    // função que avalia a energia (vida) do player, helicóptero cinza
    function energy() {
        if (energyActual == 3) {
            $("#energy").css("background-image", "url(./src/assets/images/energyia3.png)");
        }

        if (energyActual == 2) {
            $("#energy").css("background-image", "url(./src/assets/images/energy2.png)");
        }

        if (energyActual == 1) {
            $("#energy").css("background-image", "url(./src/assets/images/energy1.png)");
        }

        if (energyActual == 0) {
            $("#energy").css("background-image", "url(./src/assets/images/energy0.png)");
            gameOver(); // chamando a função game over
        }
    }

    // função que avalia o fim de game, game over
	function gameOver() {
        endGame = true;
        music.pause();
        soundGameover.play();
        window.clearInterval(game.timer);
        game.timer = null;
        
        $("#player").remove();
        $("#enemy1").remove();
        $("#enemy2").remove();
        $("#friend").remove();
        $("#backgroundGame").append("<div id='fim'></div>");
        $("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + points + "</p>" + "<div id='reinicia' onClick=reiniciagame()><h3>Jogar Novamente</h3></div>");
    }

}

// função que reinicia o game novamente
function reiniciagame() {
    soundGameover.pause();
    $("#fim").remove();
    start();
}