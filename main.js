(function(){

            var splashscreenIMG = new Image();
                splashscreenIMG.src="img/bkgm.jpg";
            //
            document.addEventListener("deviceready", onDeviceReady, false);
            window.addEventListener("load", onDeviceReady, false);

            // device APIs are available
            //
            function onDeviceReady() { 
                var canvas = document.getElementById('canvas');
                var ctx=canvas.getContext('2d');
                
                canvas.width  = 800;
                canvas.height = 1280;
                new AutoScaler(canvas,800,1280,0.15);
                    
                    
                ctx.drawImage(splashscreenIMG,0,0,800,1280);
                  
                preLoad();
                function preLoad(){             
                    var preload= new BKGM.preload();            
                preload                 
                        .load("image","button","img/nut.png")
                        .load("image","your_best","img/your_best.png")
                        .load("image","your_score","img/your_score.png")
                        .load("image","logo","img/BKGM-logo-big.png")
                        .load("image","remember_this","img/remember_this.png")
                        .load("image","ok","img/ok.png")
                        .load("image","yes","img/yes.png")
                        .load("image","no","img/no.png")
                        .load("image","have_u_seen","img/have_u_seen.png")
                        .load("image","score","img/score.png")
                        .load("image","pause","img/icon-pause.png")

                        .load("image","First_logo_small","img/First_logo_small.png")
                        .load("image","First_ok_click","img/First_ok_click.png")
                        .load("image","First_ok","img/First_ok.png")
                        .load("image","Next_yes","img/Next_yes.png")
                        .load("image","Next_yes_click","img/Next_yes_click.png")
                        .load("image","Next_no_click","img/Next_no_click.png")
                        .load("image","Next_no","img/Next_no.png")
                        .load("image","Main_unlock","img/Main_unlock.png")
                        .load("image","Main_more","img/Main_more.png")
                        .load("image","Main_logo_big","img/Main_logo_big.png")
                        .load("image","Main_Fullversion","img/Main_Fullversion.png")
                        .load("image","First_title","img/First_title.png")
                        .load("image","End_submit_score","img/End_submit_score.png")
                        .load("image","End_home","img/End_home.png")

                        .load("image","Gameover_again","img/graphic_new/Gameover_again.png")
                        .load("image","Gameover_again_click","img/graphic_new/Gameover_again_click.png")
                        .load("image","Gameover_home","img/graphic_new/Gameover_home.png")
                        .load("image","Gameover_home_click","img/graphic_new/Gameover_home_click.png")
                        .load("image","Main_start","img/graphic_new/Main_start.png")
                        .load("image","Main_start_click","img/graphic_new/Main_start_click.png")
                        .load("image","Main_more","img/graphic_new/Main_more.png")
                        .load("image","Main_more_click","img/graphic_new/Main_more_click.png")
                        .load("image","Gameover_share","img/graphic_new/Gameover_share.png")
                        .load("image","Gameover_share_click","img/graphic_new/Gameover_share_click.png")

                        .load("audio","click","audio/click.mp3")
                        .load("audio","game_over","audio/game_over.mp3")

                        //       .load("audio","slap","audio/slap");
                    preload.onloadAll= function(){ //khi load xong het
        
                         //load xong het chay windowLoad
                         windowLoad(preload); 
                    }
                }
                
            }
    // window.onload=function(){
        function windowLoad(preload) {
   //       if (navigator.isCocoonJS) {
            //     CocoonJS.App.setAntialias(true);
            // }
            var director;
            
            // BKGM.debug=1;
            var Game = new BKGM({
                //setup luc dau vao
            setup :function(){
               this.addRes(preload);
               var self = this;

                director = new BKGM.States();
                // this.addStates(director)
                console.log(this.width)

                this.BKScore=new BKGM.ScoreLocal("seen");
                var SceneGame = new BKGM.SceneGame().setup(this,director);

            },

            //chay vong lap lien tuc
            draw: function(game){
              // console.log(Game);
                director.run();
                 director.draw(game)
            },
            //Chay thuat toan
            update:function(Game){
               
               
            }
            }).run();
        }
    // };
})();
var CreateMainMenu=function(Game,director,Scene,SceneGame){
        var Images=Game.resource.images;
        var ctx=Game.ctx;
        var _click=Game.resource.audios['click'];
        Game.firstY=-400;
        director.state("menu", [
                "menusetup",
                "mainbg",
                "button"
        ]);

        director.state("gameover", [
            "gameoversetup",
            "gameoverbg"
            // "button1"
        ]);
        director.state("pause", [
            "pausesetup",
            "pausebg"
        ]);
        var buttonEvents=[];
        

        var button_Logo={
            x:Game.WIDTH/2-50,
            y:30,
            width:100,
            height:150,
            action:function(){
                _click.play()
                // director.switch("ready",true);
                window.open("http://www.bkgamemaker.com/",'_blank');
            }
        }
        var button_Start={
            img:Images['Main_start'],
            img1:Images['Main_start'],
            img2:Images['Main_start_click'],
            x:Game.WIDTH/2-259,
            y:671,
            width:518,
            height:218,
            action:function(){
                _click.play()
                SceneGame.reset();
                director.switch(Scene,true);                
            }
        }
        var button_MoreGame={            
            img:Images['Main_more'],
            img1:Images['Main_more'],
            img2:Images['Main_more_click'],
            x:Game.WIDTH/2-259,
            y:912,
            width:518,
            height:132,
            action:function(){
                _click.play()
                var ref = window.open('itms-apps://itunes.apple.com/vn/artist/nguyen-anh/id831225478', '_blank', 'location=yes');           
                           
            }
        }
        
        var button_Sound={
            image:Images['sound_on'],
            on:true,
            x:520,
            y:20,
            width:60,
            height:60,
            action:function(){
                _click.play()
                // director.switch("ready",true);
                if(this.on) {
                    this.image=Images['sound_off'];
                    this.on=false;
                }
                else {
                    this.image=Images['sound_on'];
                    this.on=true;
                }
            }
        }
        // buttonEvents.push(button_Logo);
        buttonEvents.push(button_Start);
        buttonEvents.push(button_MoreGame);
        
        // buttonEvents.push(button_Sound);
        function updateMenu(){
            

            var buttonImg=Images['bbutton'];
            var width=button_Start.width;
            var height=button_Start.height;
            var x=button_Start.x;
            var y=button_Start.y;
            
            // ctx.drawImage(Images['69'],Game.WIDTH/2-Images['69'].width/2,300,Images['69'].width,Images['69'].height);                        
            // ctx.drawImage(button_Sound.image,button_Sound.x,button_Sound.y,button_Sound.width,button_Sound.height);
            
        }
        director.taskOnce("menusetup", function(){
            // Game.firstY=-400;
        });
        
        director.task("mainbg", function(){
            // Game.ctx.drawImage(Images['slaprat'],Game.WIDTH/2-Images['slaprat'].width/2,700,Images['slaprat'].width,Images['slaprat'].height)                       
            // Game.ctx.drawImage(Images['main'],0,0,Game.WIDTH,Game.HEIGHT);

            ctx.fillStyle="#5177b0";
            ctx.fillRect(0,0,Game.WIDTH,Game.HEIGHT);
            // ctx.translate(0,200);
            ctx.drawImage(Images['Main_logo_big'],191,147);
           
            ctx.drawImage(button_Start.img,button_Start.x,button_Start.y);
            ctx.drawImage(button_MoreGame.img,button_MoreGame.x,button_MoreGame.y);  
                
            // y=button_UnlockGame.y;
            
            // ctx.drawImage(Images['logo'],335,63,126,152);
            // var text1="More Game";
            // ctx.fillText(text1,Game.WIDTH/2 - ctx.measureText(text1).width/2,button_MoreGame.y+50);
            // var text2="Unlock Game";
            // ctx.fillText(text2,Game.WIDTH/2 - ctx.measureText(text2).width/2,button_UnlockGame.y+50);
        },true);
        
        director.task("button", function(){
            updateMenu();
            // ctx.drawImage(tmp_canvas,0,0,Game.WIDTH,Game.HEIGHT)
        },true);
        var t;
        var buttonOverEvents=[]
        var button_Replay={
            img:Images['Gameover_again'],
            img1:Images['Gameover_again'],
            img2:Images['Gameover_again_click'],
            x:Game.WIDTH/2-518/2,
            y:928,
            width:518,
            height:132,
            action:function(){
                _click.play()     
                clearTimeout(t);     
                SceneGame.reset();
                director.switch(Scene,true); 
            }
        }

        var button_Submit={            
            img:Images['Gameover_share'],
            img1:Images['Gameover_share'],
            img2:Images['Gameover_share_click'],
            x:305,
            y:1103,
            width:346,
            height:132,
            action:function(){
                _click.play()
                // fgl.submitScore(SceneGame.Score);
                // Game._fb.login(function(){Game._fb.postCanvas()});
            }
        }

        var button_Main={
            img:Images['Gameover_home'],
            img1:Images['Gameover_home'],
            img2:Images['Gameover_home_click'],
            x:Game.WIDTH/2-518/2,
            y:1103,
            width:143,
            height:132,
            action:function(){
                _click.play()
                director.switch("menu",true)
            }
        }
        buttonOverEvents.push(button_Replay);
        buttonOverEvents.push(button_Submit);
        buttonOverEvents.push(button_Main);
        // buttonOverEvents.push(button_Sound);
        // buttonOverEvents.push(button_Logo);
        var GO_animation=false;
        director.taskOnce("gameoversetup", function(){
            Game.firstY=-Game.HEIGHT+400;
            GO_animation=true;
            Game.BKScore.submitScore(SceneGame.Score);
            Game.resource.audios['game_over'].play();
            t = setTimeout(function(){
            window.plugins.AdMob.showInterstitialAd();
            window.plugins.AdMob.createInterstitialView();
            },100);
            });
        director.task("gameoverbg", function(){
            if(GO_animation)
            if (Game.firstY>-10) {
                Game.firstY=0;
                GO_animation=false;
            } else {
                Game.firstY+=50;
            }

        });
        director.task("gameoverbg", function(){ 
            if(GO_animation) Game.ctx.drawImage(director.cache,0,0);
            Game.ctx.save();
            if(GO_animation) Game.ctx.translate(0,Game.firstY);
            ctx.fillStyle="#5177b0";
            ctx.fillRect(0,0,Game.WIDTH,Game.HEIGHT);
            // Game.ctx.drawImage(Images['4main'],0,0,Game.WIDTH,Game.HEIGHT);
            // Game.ctx.drawImage(button_Sound.image,button_Sound.x,button_Sound.y,button_Sound.width,button_Sound.height);
            // Game.ctx.drawImage(button_Leader.image,button_Leader.x,button_Leader.y,button_Leader.width,button_Leader.height);
            // Game.ctx.drawImage(button_Share.image,button_Share.x,button_Share.y,button_Share.width,button_Share.height);
            Game.ctx.fillStyle="#fafafa";            
            ctx.font="50pt UTM Avo ";
            var text="GAME OVER";
            ctx.fillText(text,Game.WIDTH/2 - ctx.measureText(text).width/2,320);
            var textSeen1,textSeen2;
            if(!SceneGame.isSeened) {
                textSeen1="The number has not";
                textSeen2="been shown yet";
            }
            else {
                textSeen1="You have seen "+SceneGame._thisnumber;
                textSeen2=SceneGame.turn+(SceneGame.turn>1?" turns":" turn")+" ago";
            }
            Game.ctx.font="40pt UTM Avo";
            ctx.fillText(textSeen1,Game.WIDTH/2 - ctx.measureText(textSeen1).width/2,420);
            ctx.fillText(textSeen2,Game.WIDTH/2 - ctx.measureText(textSeen2).width/2,490);
            ctx.drawImage(Images['your_score'],112,588); 
            ctx.drawImage(Images['your_best'],402,588);          
            Game.ctx.font="60pt Trebuchet MS";
            Game.ctx.fillStyle="#5177b0";
            var score=SceneGame.Score;
            Game.ctx.fillText(score,112+Images['your_score'].width/2- Game.ctx.measureText(score).width/2,803);
            if (!SceneGame.highscore||SceneGame.Score>SceneGame.highscore)
                SceneGame.highscore=SceneGame.Score;
            ctx.fillText(SceneGame.highscore,402+Images['your_best'].width/2- Game.ctx.measureText(SceneGame.highscore).width/2,803);
            Game.ctx.font="50pt Trebuchet MS";
            var text1="Play again";
            ctx.drawImage(button_Replay.img,button_Replay.x,button_Replay.y); 
            // ctx.fillText(text1,Game.WIDTH/2 - ctx.measureText(text1).width/2,button_Replay.y+75);
            Game.ctx.font="40pt Trebuchet MS";
            var text2="Submit Score";
            ctx.drawImage(button_Submit.img,button_Submit.x,button_Submit.y); 
            // ctx.fillText(text2,320,button_Submit.y+75);
            // var text3="Main Menu";
            ctx.drawImage(button_Main.img,button_Main.x,button_Main.y); 
            // ctx.fillText(text3,Game.WIDTH/2 - ctx.measureText(text3).width/2,button_Main.y+75);
            ctx.drawImage(Images['logo'],335,63,126,152);
            Game.ctx.restore();
            
        },true);
        // SceneGame.gameover=function(){
        //     director.switch("gameover",true);
        // }

        var buttonPauseEvents=[]
        var button_Resume={
            x:Game.WIDTH/2-290,
            y:610,
            width:580,
            height:130,
            action:function(){
                _click.play()
                SceneGame._startTime+=Game.time-SceneGame._pauseTime;
                director.switch("SceneGame",true); 
            }
        }

        var button_Main2={
            x:Game.WIDTH/2-290,
            y:780,
            width:580,
            height:130,
            action:function(){
                _click.play()
                director.switch("menu",true)
            }
        }

        buttonPauseEvents.push(button_Resume);
        buttonPauseEvents.push(button_Main2);
        // buttonOverEvents.push(button_Sound);
        // buttonOverEvents.push(button_Logo);
        var GO_animation=false;
        director.taskOnce("pausesetup", function(){
            Game.firstY=-Game.HEIGHT-100;
            GO_animation=true;
        });
        director.task("pausebg", function(){
            if(GO_animation)
            if (Game.firstY>-10) {
                Game.firstY=0;
                GO_animation=false;
            } else {
                Game.firstY+=37;
            }
        });
        director.task("pausebg", function(){
            if(GO_animation) Game.ctx.drawImage(director.cache,0,0);
            Game.ctx.save();
            if(GO_animation) Game.ctx.translate(0,Game.firstY);
            ctx.fillStyle="#5177b0"; 
            ctx.fillRect(0,0,Game.WIDTH,Game.HEIGHT);
            // Game.ctx.drawImage(Images['4main'],0,0,Game.WIDTH,Game.HEIGHT);
            // Game.ctx.drawImage(button_Sound.image,button_Sound.x,button_Sound.y,button_Sound.width,button_Sound.height);
            // Game.ctx.drawImage(button_Leader.image,button_Leader.x,button_Leader.y,button_Leader.width,button_Leader.height);
            // Game.ctx.drawImage(button_Share.image,button_Share.x,button_Share.y,button_Share.width,button_Share.height);
            Game.ctx.fillStyle="#fafafa";
            ctx.font="bold 60pt UTM Avo ";
            var text="Pause Game";
            ctx.fillText(text,Game.WIDTH/2 - ctx.measureText(text).width/2,220);
            Game.ctx.font="30pt UTM Avo";
            var text0="score"
            Game.ctx.fillText(text0,Game.WIDTH/2 - Game.ctx.measureText(text0).width/2,320);
            Game.ctx.font="60pt UTM Avo";
            var score=SceneGame.Score;
            Game.ctx.fillText(score,Game.WIDTH/2 - Game.ctx.measureText(score).width/2,420);
            Game.ctx.font="50px UTM Avo";
            ctx.fillStyle="#5177b0";
            var text1="Resume";
            ctx.drawImage(Images['button'],button_Resume.x,button_Resume.y); 
            ctx.fillText(text1,Game.WIDTH/2 - ctx.measureText(text1).width/2,button_Resume.y+75);
            var text3="Main Menu";
            ctx.drawImage(Images['button'],button_Main2.x,button_Main2.y); 
            ctx.fillText(text3,Game.WIDTH/2 - ctx.measureText(text3).width/2,button_Main2.y+75);
            Game.ctx.restore();
        },true);
        Game.mouseUp=function(e){
            console.log(1)
            switch (director.current){
                case "menu":

                            for (var i = buttonEvents.length - 1; i >= 0; i--) {
                                if(BKGM.checkMouseBox(e,buttonEvents[i])){
                                    buttonEvents[i].action();
                                }
                                buttonEvents[i].img=buttonEvents[i].img1;
                            };
                            break;  
                case "gameover": 
                
                            for (var i = buttonOverEvents.length - 1; i >= 0; i--) {
                                buttonOverEvents[i].img=buttonOverEvents[i].img1;
                            };
                            if(Game.firstY==0)                           
                            for (var i = buttonOverEvents.length - 1; i >= 0; i--) {
                                buttonOverEvents[i].img=buttonOverEvents[i].img1;
                                if(BKGM.checkMouseBox(e,buttonOverEvents[i])){
                                    buttonOverEvents[i].action();
                                }
                                
                            };
                            break;     
                case "SceneGame":
                            if(SceneGame.nameEvent=='start_and_choose'){
                                if(BKGM.checkMouseBox(e,SceneGame.button_Pause)){
                                    SceneGame.button_Pause.action();
                                }                
                            }
                            SceneGame.yesBtn.img=Images['Next_yes'];
                            SceneGame.noBtn.img=Images['Next_no'];
                            SceneGame.okBtn.img=Images['First_ok'];
                            break; 
                case "pause":
                            for (var i = buttonPauseEvents.length - 1; i >= 0; i--) {
                                if(BKGM.checkMouseBox(e,buttonPauseEvents[i])){
                                    buttonPauseEvents[i].action();
                                }
                            };
                            break;                
            }
        };
        Game.mouseDown=function(e){
            switch (director.current){
                case "menu":

                            for (var i = buttonEvents.length - 1; i >= 0; i--) {
                                if(BKGM.checkMouseBox(e,buttonEvents[i])){
                                    buttonEvents[i].img=buttonEvents[i].img2;
                                }
                            };
                            break;  
                case "gameover": 
                            if(Game.firstY==0)                           
                            for (var i = buttonOverEvents.length - 1; i >= 0; i--) {
                                if(BKGM.checkMouseBox(e,buttonOverEvents[i])){
                                    buttonOverEvents[i].img=buttonOverEvents[i].img2;
                                }
                            };
                            break;     
                case "SceneGame":
                            if(SceneGame.nameEvent=='start_and_choose'){
                                if(BKGM.checkMouseBox(e,SceneGame.button_Pause)){
                                    SceneGame.button_Pause.action();
                                }                
                            }
                            SceneGame.yesBtn.img=Images['Next_yes'];
                            SceneGame.noBtn.img=Images['Next_no'];
                            SceneGame.okBtn.img=Images['First_ok'];
                            break; 
                case "pause":
                            for (var i = buttonPauseEvents.length - 1; i >= 0; i--) {
                                if(BKGM.checkMouseBox(e,buttonPauseEvents[i])){
                                    buttonPauseEvents[i].action();
                                }
                            };
                            break;                
            }
        }
    };
    
(function(){
    BKGM.SceneGame = function(){
       
        return this;
    }  
    BKGM.SceneGame.prototype={
        Score: 0,
        setup: function(game,director){
            var self=this;
            this.game = game;
            var Images=game.resource.images;
            var _click=game.resource.audios['click'];
            this.director = director;
            this.pointX=300;
            this.direction=1;
            this.setBounds(game.width/2,game.height/2,game.width,game.height);
            this.bien=11;
            this.arrNumber=[];
           

            this.setNameEvent("flip_effect_in");
                director.state("SceneGame", [  
                        "setupSceneGame",    
                        "SceneGame",
                        "actors",
                        "cache"
                    ]);
                
                director.taskOnce("setupSceneGame", function(){                    
                    game.firstY=-100;
                    self.okBtn._eventenable=true;
                });
                director.task("background", function(){
                    
                },true);
                director.taskActor("SceneGame",this);
                director.task("cache", function(){
                    if (game.firstY>=game.height+200) {
                        game.firstY=game.height+200;                      
                    } else {
                        game.firstY+=40;
                    }
                });
                var button_Pause={
                    image:game.resource.images['pause'],
                    x:50,
                    y:50,
                    width:80,
                    height:80,
                    action:function(){
                        _click.play()
                        self._pauseTime=game.time;
                        director.switch("pause",true)            
                    }
                }

                this.button_Pause=button_Pause;
                director.task("cache", function(){
                    var ctx=game.ctx;
                    if(self.nameEvent=='start_and_choose')
                        ctx.drawImage(button_Pause.image,button_Pause.x,button_Pause.y,button_Pause.width,button_Pause.height);
                    // ctx.drawImage(game.resource.images['shadow'],0,game.firstY-50);
                    ctx.drawImage(director.cache,0,game.firstY);
                    if(self.mousePos){
                        ctx.save();
                        self.mousePos.y--;
                        ctx.font="40px UTM Avo";
                        ctx.fillStyle = "#fafafa";
                        self.globalAlpha-=0.01;
                        ctx.globalAlpha=self.globalAlpha;
                        if(self.state==1)ctx.fillText("+1",self.mousePos.x,self.mousePos.y);
                        // else ctx.fillText("X",self.mousePos.x,self.mousePos.y);

                        ctx.restore();
                    }  
                },true);
                CreateMainMenu(game,director,"SceneGame",self);
                this.okBtn=new BKGM.Button(Images['First_ok']);                
                this.okBtn._eventenable=false;
                this.okBtn.setPosition(400,1046);
                this.okBtn.mouseDown=function(){
                    _click.play()
                    this.img=Images['First_ok_click'];
                }
                this.okBtn.mouseUp=function(){
                    if(game.firstY<game.height+200) return;
                    if(this.img!=Images['First_ok_click']) return;
                    this.img=Images['First_ok'];
                    if(self.nameEvent=="remember_and_start") {
                        self.setNameEvent("remember_this");
                    } else {
                        game.removeChild(self.okBtn);
                        self.removeChild(self.okBtn);
                        
                        // console.log(game.childrentList)
                        self.addChild(self.yesBtn);
                        self.addChild(self.noBtn);
                        game.addChild(self.yesBtn);
                        game.addChild(self.noBtn);
                        self.start();
                    }                    
                }
                this.yesBtn=new BKGM.Button(Images['Next_yes']);                
                // this.yesBtn._eventenable=true;
                this.yesBtn.setPosition(191,1066);
                this.yesBtn.mouseDown=function(){
                    _click.play()
                    this.img=Images['Next_yes_click'];
                }
                this.yesBtn.mouseUp=function(){
                    if(director.current!="SceneGame") return;
                    if(this.img!=Images['Next_yes_click']) return;
                    this.img=Images['Next_yes'];
                    var itest= self.check(self.currentNumber);
                    if(itest){
                         self.start();
                         self.Score++
                         self.firstTime=false;
                    }else{
                        // self.reset();
                        self.gameover();
                    }
                }
                this.noBtn=new BKGM.Button(Images['Next_no']);                
                // this.noBtn._eventenable=true;
                this.noBtn.setPosition(610,1066);
                this.noBtn.mouseDown=function(){
                    _click.play()
                    this.img=Images['Next_no_click'];
                }
                this.noBtn.mouseUp=function(){
                    if(director.current!="SceneGame") return;
                    if(this.img!=Images['Next_no_click']) return;
                    this.img=Images['Next_no'];
                    var itest= self.check(self.currentNumber);
                    if(!itest){
                         self.start();
                         self.Score++;
                         self.firstTime=false;
                    }else{
                        // self.reset();
                        self.gameover();
                    }
                }
                this.reset();
                director.switch("menu");
            return this;
        },  
        start: function(){
            this.setNameEvent("start_and_choose");

            // this.game.firstY=-400;
            this.randomNumber();
            return this;
        },      
        reset: function(){

            var game = this.game
            this.arrNumber=[];
            this.randomNumber();
            this.firstTime=true;
            // this.okBtn._eventenable=true;
            this.setNameEvent("remember_and_start");
            this.Score = 0;
            this.highscore=0;
            var bks=game.BKScore.getScore().score;
            if(!bks) bks=0;
            if(this.highscore<bks)
                this.highscore=bks;           
            game.removeChild(this.yesBtn);
            game.removeChild(this.noBtn);
            this.removeChild(this.yesBtn);
            this.removeChild(this.noBtn);
            this.addChild(this.okBtn);
            game.addChild(this.okBtn);
            return this;
        },      
        gameover:function(){
            var game=this.game;
            if(this.yesBtn){
                game.removeChild(this.yesBtn);
                game.removeChild(this.noBtn);
                this.removeChild(this.yesBtn);
                this.removeChild(this.noBtn);
            }               
            if(this.okBtn){
                this.removeChild(this.okBtn);
                this.removeChild(this.okBtn);
            }
            this.director.switch("gameover",true);
        },
        check: function(_number){
            this.isSeened = false;
            // console.log(_number)
            // console.log(this.arrNumber)
            this._thisnumber=_number;
            for(var i =0;i<this.arrNumber.length-1;i++){
                if(_number==this.arrNumber[i]) {
                    this.isSeened= true;
                    this.turn=this.arrNumber.length-1-i;
                    return this.isSeened;
                }
            }
            return this.isSeened;
        },
        randomNumber: function(){
            var _percentTrue= 30;
            var _percentFalse = 70;
            var ranpercent= Math.random()*100;
        
            if(ranpercent>_percentTrue || this.arrNumber.length==0){
                var number = Math.random()*99>>0;
            }else{
                var index =Math.random()*this.arrNumber.length>>0;
                
                var number = this.arrNumber[index];
            }
            
            this.arrNumber.push(number);
            this.currentNumber = number;
            return this;
        },   
        draw: function(Game){
                var ctx = Game.ctx;
                var Images=Game.resource.images;
                ctx.save();
                ctx.translate(-Game.WIDTH/2,-Game.HEIGHT/2)
                ctx.fillStyle="#5177b0";
                ctx.fillRect(0,0,Game.WIDTH,Game.HEIGHT);      
                
                if(this.nameEvent==="remember_and_start"){
                    ctx.drawImage(Images['logo'],Game.WIDTH/2-66,60,132,160);
                    ctx.fillStyle="#fafafa";
                    // ctx.drawImage(Images['First_title'],141,283);
                    ctx.font="40pt UTM Avo ";
                    var text01="Remember all the number";                    
                    var text02="you will seen";                    
                    ctx.fillText(text01,Game.WIDTH/2 - ctx.measureText(text01).width/2,310);
                    ctx.fillText(text02,Game.WIDTH/2 - ctx.measureText(text02).width/2,375);
                    // ctx.font="300pt UTM Avo ";
                    // var text=this.currentNumber;
                    
                    // ctx.fillText(text,Game.WIDTH/2 - ctx.measureText(text).width/2,737);
                    ctx.drawImage(Images['Main_logo_big'],Game.WIDTH/2-Images['Main_logo_big'].width/2,500)
                    ctx.font="50px UTM Avo";
                    ctx.fillStyle="#5177b0";
                } else
                if(this.nameEvent==="remember_this"){
                    ctx.drawImage(Images['logo'],Game.WIDTH/2-66,60,132,160);
                    ctx.fillStyle="#fafafa";
                    // ctx.drawImage(Images['First_title'],141,283);
                    ctx.font="40pt UTM Avo ";
                    var text01="Look at this number";                    
                    ctx.fillText(text01,Game.WIDTH/2 - ctx.measureText(text01).width/2,310);
                    ctx.font="300pt UTM Avo ";
                    var text=this.currentNumber;
                    
                    ctx.fillText(text,Game.WIDTH/2 - ctx.measureText(text).width/2,737);
                    // ctx.drawImage(Images['Main_logo_big'],Game.WIDTH/2-Images['Main_logo_big'].width/2,500)
                    ctx.font="50px UTM Avo";
                    ctx.fillStyle="#5177b0";
                } else
                if(this.nameEvent=="start_and_choose"){
                    var _time=this._durTime-Game.time+this._startTime;
                    ctx.beginPath();
                    // ctx.drawImage(Images['have_u_seen'],126,260);

                    ctx.drawImage(Images['score'],Game.WIDTH -Images['score'].width-20,40);
                    
                    ctx.fillStyle="#fafafa";
                    ctx.font="50pt UTM Avo ";
                    var have_u_seen="Have you seen this?"
                    ctx.fillText(have_u_seen,Game.WIDTH/2-ctx.measureText(have_u_seen).width/2,300);
                    ctx.fillText(this.Score,Game.WIDTH-100,155);
                    ctx.font="300pt UTM Avo ";
                    var text=this.currentNumber;
                    ctx.fillText(text,Game.WIDTH/2 - ctx.measureText(text).width/2,737);
                    // ctx.fillText("Score",Game.WIDTH-50,-this.height/2+50);
                    // var width_Score = ctx.measureText(this.Score).width;
                    // ctx.fillText(this.Score,-width_Score/2,-this.height/2+110);
                    ctx.closePath();

                    //show about time 
                    ctx.beginPath();
                    // ctx.font= "80px Arials";
                    // ctx.fillText(this.aboutTime,this.width/2-ctx.measureText(this.aboutTime).width-50,-this.height/2 +70)
                    ctx.closePath();
                    ctx.beginPath();
                    ctx.strokeStyle="#fafafa";
                    // ctx.arc(-40/2,115-this.height/2,40,0,2*Math.PI)
                    // ctx.fill();
                    ctx.lineWidth=40;
                    // if(this.nameEvent!="flip_effect_end")ctx.arc(-40/2,115-this.height/2,20,-Math.PI/2+_time/this._durTime*2*Math.PI,-Math.PI/2)
                    if(!this.firstTime)ctx.arc(Game.WIDTH/2,80,20,-Math.PI/2+_time/this._durTime*2*Math.PI,-Math.PI/2)
                                      
                    ctx.stroke();
                    ctx.closePath();
                    
                } 

                ctx.restore();

        },
        update: function(){            
            var game = this.game;
            var currentTime = game.time;
            var self=this;
            if(this.nameEvent==="start_and_choose" && !this.firstTime){
                if(this.aboutTime<=this._durTime && this.aboutTime>=0){
                    this.aboutTime = (currentTime-this._startTime)
                    this.aboutTime= (this._durTime - this.aboutTime + 1000)/1000 >>0
                    if(this.aboutTime<=0){
                        setTimeout(function(){self.gameover()} ,0);
                        this.aboutTime = 0;
                    } 
                }
                    

            }
        },
        setNameEvent: function(ev){
            var game = this.game
            this.nameEvent=ev;            
            switch(ev){
                case "start_and_choose":{
                    this._startTime = game.time;
                    this._durTime = 2000;
                    this.aboutTime=0;

                }break; 
                case "remember_and_start":{
                    this._startTime = game.time;
                    this._durTime = 3*1000;
                }break;
                case "remember_this":{
                    this._startTime = game.time;
                    this._durTime = 3*1000;
                }break;
                case "flip_effect_in":{
                    this._startTime = game.time;
                    this._durTime = 2*1000;
                }break;               
                case "swipe_effect_left":{
                    this._startTime = game.time;
                    this._durTime = 1*300;
                    var self=this;
                }break;                 
            }

        },
        removeChild:function(actor){
            this.childrentList.splice(this.childrentList.indexOf(actor),1)
        }
    }
     extend(BKGM.SceneGame, BKGM.Actor);
})();
(function(){
    BKGM.Button = function(img){
        if(img){
            this.img=img;
            this.width=img.width;
            this.height=img.height;
            this.x=0;
            this.y=0;
        }        
        return this;
    }
    BKGM.Button.prototype = {

        setup: function(w,h){
            var self = this;
            this.setBounds(0,0,w,h);            
            return this;
        },
        _draw: function(game){
            var ctx = game.ctx;
            ctx.save();
            ctx.translate(this.x,this.y);
            if (this.img) {
                ctx.drawImage(this.img,-this.width/2,-this.height/2,this.width,this.height);
            } else {
                ctx.beginPath();
                ctx.rect(-this.width/2,-this.height/2,this.width,this.height);
                ctx.fillStyle=this._fillStyle;
                ctx.fill();
                ctx.strokeStyle = this._strokeStyle
                ctx.stroke();
                ctx.closePath();
            }
            ctx.restore();
        },
        _update: function(game,dt){

        },
        setNamebn: function(n){
            this.namebn = n;
            return this;
        },
        mouseDown: function(e){
            
        },
       
    }
   extend(BKGM.Button,BKGM.Actor);
})();