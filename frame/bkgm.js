window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame   || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function(/* function */ callback, /* DOMElement */ element){
             window.setTimeout(callback, 1000 / 60);
        };
})();


var BKGM = BKGM||{};

(function(){
    // Khi ứng dụng ko hiện (ví dụ chuyển tab)
    var changetabtime=0;

    function handleVisibilityChange() {
        if (document.hidden) {
                changetabtime=new Date();
        } else  {
                changetabtime=new Date()-changetabtime;
        }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange, false);

    ((typeof(cordova) == 'undefined') && (typeof(phonegap) == 'undefined')) ? BKGM._isCordova=false : BKGM._isCordova=true;
    var lastTime=+new Date();
    var t = 0;
    var sceneTime = 0;
    var frameTime=1000/60;
    var _statesLoop=[];
    var _count=[];
    
    
    var debug=document.createElement("div");
    debug.style.position="absolute";
    debug.style.color="red";
    var addLoop = function(_this){
        _statesLoop.push(_this);
    };
    var _loop = function(){
        // var time=+new Date();
        for (var i = _statesLoop.length - 1; i >= 0; i--) {
            var now =+new Date();
            var dt=  now-lastTime;             
            lastTime = now;
            t += dt ;//Thoi gian delay giua 2 lan cap nhat
            while (t >= frameTime) {//Chay chi khi thoi gian delay giua 2 lan lon hon 10ms
                t -= frameTime;//Dung de xac dinh so buoc' tinh toan
                sceneTime += frameTime;
                _statesLoop[i].update(_statesLoop[i], sceneTime);
                _statesLoop[i].time=sceneTime;
            }   
            _statesLoop[i].loop(_statesLoop[i]);
        };
        
        requestAnimFrame(function(){
            _loop();
        });
    };
    
    BKGM = function(obj){
        var _this=this;
        _this.gravity={x:0,y:0,z:0};
        BKGM.SINGLE_TOUCH=0;
        BKGM.MULTI_TOUCH=1;
        BKGM.TYPE_TOUCH=BKGM.SINGLE_TOUCH;
        if(BKGM.DeviceMotion)
        if ((window.DeviceMotionEvent) || ('listenForDeviceMovement' in window)) {
            window.addEventListener('devicemotion', function(eventData){
                        if(eventData.accelerationIncludingGravity)
                            _this.gravity = {x:eventData.accelerationIncludingGravity.y/3,y:eventData.accelerationIncludingGravity.x/3,z:eventData.accelerationIncludingGravity.z};

                    }, false);

        } else {
            if(navigator &&  navigator.accelerometer){
                 // The watch id references the current `watchAcceleration`
                var watchID = null;


                

                // Start watching the acceleration
                //
                function startWatch() {

                    // Update acceleration every 1000/60 seconds
                    var options = { frequency: 1000/60 };

                    watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
                }

                // Stop watching the acceleration
                //
                function stopWatch() {
                    if (watchID) {
                        navigator.accelerometer.clearWatch(watchID);
                        watchID = null;
                    }
                }


                function onSuccess(acceleration) {
                    _this.gravity = {x:acceleration.x/3,y:acceleration.y/3,z:acceleration.z};
                };

                function onError() {
                    alert('onError!');
                };
                startWatch();
                // navigator.accelerometer.getCurrentAcceleration(onSuccess, onError);*/
            } else
                console.log("Not supported on your device or browser.  Sorry.")
        }
        
        
        if(obj){
            this.setup=obj.setup||this.setup;
            this.update=obj.update||this.update;
            this.draw=obj.draw||this.draw;
        }
        this.resource={};
        this.childrentList=[];

        if (document.getElementById("canvas"))
            this.canvas = document.getElementById("canvas");
        else {
            this.canvas = document.createElement('canvas');
            this.canvas.setAttribute("id", "canvas");
            
            document.body.appendChild(this.canvas);
        }       
        this.width=this.canvas.width;
        this.height=this.canvas.height;
        this.ctx = this.canvas.getContext('2d');
        /**
        * This code uses a hack to fix some strange canvas rendering issues on
        * older Android browsers such as drawing a 'ghost' canvas that does not
        * obey margins. This should be called once per frame!
        */
        var opacityToggle = false;
        var opacityHack = function() {
        var opacityVal = 0.999999 + (opacityToggle ? 0 : 0.000001);
        opacityToggle = !opacityToggle;

        try {
        this.canvas.parentElement.style.opacity = opacityVal;
        this.canvas.parentElement.style.zIndex = "1";
        } catch(err) { }
        try {
        this.canvas.style.opacity = opacityVal;
        this.canvas.style.zIndex = "1";
        } catch(err) { }
        };

        /**
        * Using this method to clear the backbuffer is much more reliable on
        * older Android devices such as the Galaxy S2. Also implements
        * opacity hack
        */
        this.clearCanvas = function() {
        // Faster, but doesn't work on everything
        // _this.ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Slower but safer
        _this.canvas.width = _this.canvas.width;

        // Fix canvas problems on older Android browsers
        opacityHack();
        };
        // this.ctx.textAlign = "center";
        
        // this._circle = document.createElement('canvas');
        // this._circle.width=200;
        // this._circle.height=200;
        // var _ctx = this._circle.getContext('2d');
        // _ctx.arc(100,100,100,0,Math.PI*2);
        // _ctx.fillStyle='#fff';
        // _ctx.fill();
       
        this._fps = {
            startTime : 0,
            frameNumber : 0,
            getFPS : function(){
                this.frameNumber++;
                var d = new Date().getTime(),
                    currentTime = ( d - this.startTime ) / 1000,
                    result = Math.floor( ( this.frameNumber / currentTime ) );

                if( currentTime > 1 ){
                    this.startTime = new Date().getTime();
                    this.frameNumber = 0;
                }
                return result;

            }

        };
        //this.ctx.globalCompositeOperation = 'source-atop';
        addMouseTouchEvent(this);
        addKeyEvent(this);
        return this;
    }
    BKGM.prototype = {
        time:0,
        SCALEX:1,
        SCALEY:1,
        font:"Times New Roman",
        loop:function(_this){
            if(BKGM.debug)          
            _this.FPS=_this._fps.getFPS();            
            _this.clearCanvas();
            _this._staticDraw();
            _this.draw(_this);                  
            return _this;
        },
        run:function(){
            if(BKGM.debug && debug)
                document.body.appendChild(debug);
            // this.canvas.width  = window.innerWidth;
            // this.canvas.height = window.innerHeight;
            this.WIDTH = this.canvas.width;
            this.HEIGHT  = this.canvas.height;
            if(BKGM._isCordova){
                this.SCALEX = this.WIDTH/window.innerWidth;
                this.SCALEY = this.HEIGHT/window.innerHeight;
            }
            else{
                this.SCALEX = this.WIDTH/this.canvas.offsetWidth;
                this.SCALEY = this.HEIGHT/this.canvas.offsetHeight;                
            }
            this.SCALE = Math.min(this.HEIGHT/600,this.WIDTH/1024) ;
            this.setup();
            if(BKGM.Codea){
                this.ctx.translate(0, this.canvas.height);
                this.ctx.scale(1,-1);
            }            
            lastTime=new Date();
            if(!this.firstRun){
                addLoop(this);
                _loop();
                this.firstRun=1;
            }
            
            return this;
        },
        rerun:function(){
            // this.canvas.width  = window.innerWidth;
            // this.canvas.height = window.innerHeight;
            this.WIDTH = this.canvas.width;
            this.HEIGHT  = this.canvas.height;
            this.SCALEX = this.WIDTH/this.canvas.offsetWidth;
            this.SCALEY = this.HEIGHT/this.canvas.offsetHeight;        
            this.SCALE = Math.min(this.HEIGHT/600,this.WIDTH/1024) ;
            if(BKGM.Codea){
                this.ctx.translate(0, this.canvas.height);
                this.ctx.scale(1,-1);
            }            
            lastTime=new Date();            
        },
        setup:function(){
            return this;
        },
        update:function(){
            return this;
        },
        draw:function(){
            return this;
        },
        _staticDraw:function(){
            if (this._bg){       
                this.ctx.beginPath();
                this.ctx.rect(0, 0, this.canvas.width, this.canvas.height); 
                this.ctx.fillStyle = 'rgb('+this._bg.R+','+this._bg.G+','+this._bg.B+')';               
                this.ctx.fill();
            }
            return this;
        },
        background:function(R, G, B){
            this.ctx.beginPath();
            this.ctx.rect(0, 0, this.canvas.width, this.canvas.height); 
            this.ctx.fillStyle = 'rgb('+R+','+G+','+B+')';               
            this.ctx.fill();
            return this;
        },
        fill:function(R, G, B, A){
            this.ctx.beginPath();
            this.ctx.fillStyle="rgba("+R+", "+G+", "+B+", " + A + ")";
            // this.ctx.fill();
            return this;
        },
        rect:function(x, y, width, height){
            if(this._rectMode==="CENTER"){
                this.ctx.rect(x-width/2, y-height/2, width, height);  
            } else 
            this.ctx.rect(x, y, width, height);
            this.ctx.fill();  
            return this;
        },
        rectMode:function(Input){
            this._rectMode=Input;
            return this;
        },
        setFont:function(font){
            this.font=font;
        },
        text:function( string, x, y, fontSize,center){
            this.ctx.save();
            if(BKGM.Codea){
                
                this.ctx.translate(0, this.canvas.height);
                this.ctx.scale(1,-1);            
                this.ctx.font = fontSize+'px '+this.font||'40px '+this.font;
                this.ctx.fillText(string, x, this.canvas.height-(y-fontSize/2));
                
            } else {
                if(center) this.ctx.textAlign = "center";
                this.ctx.font = fontSize+'px '+this.font||'40px '+this.font;
                this.ctx.fillText(string, x, (y+fontSize/2));
            }
            this.ctx.restore();
           
            return this;
        },
        circle:function( x, y, diameter){
            this.ctx.beginPath();
            // this.ctx.drawImage(this._circle,0,0,this._circle.width,this._circle.width,x - diameter,y - diameter,diameter*2,diameter*2);
            this.ctx.arc(x, y, diameter, 0, Math.PI*2,false);
            this.ctx.fill(); 
            return this;
        },
        line:function(x1, y1, x2, y2){
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.lineCap = this._linemode||'butt';
            if (this._strokeWidth) this.ctx.lineWidth = this._strokeWidth;
            if (this._strokeColor) this.ctx.strokeStyle = this._strokeColor;
            this.ctx.stroke();
            this.ctx.closePath();
            return this;
        },
        lineCapMode:function(lineMode){
            this._linemode=lineMode;
            return this;
        },
        stroke:function(color, width){
            this._strokeColor=color;
            this._strokeWidth=width;
            return this;
        },
        addRes:function(res){
            this.resource=res;
            return this;
        },
        addChild:function(child){
            this.childrentList.push(child);
            return this;
        },
        removeChild:function(child){
            this.childrentList.splice(this.childrentList.indexOf(child),1);
            return this;
        },
        addStates:function(states){
            this.states=states;
        },
        _swipe:function(e){
            var s=this._startWipe;
            var x_1=s.x,y_1=s.y;
            var x_2=e.x,y_2=e.y;
            var delta_x = x_2 - x_1,
            delta_y = y_2 - y_1;
            var threadsold=_THREADSOLD*this.SCALE;
            if ( (delta_x < threadsold && delta_x > -threadsold) || (delta_y < threadsold && delta_y > -threadsold) ) return false;

            var tan = Math.abs(delta_y / delta_x);
            
            switch( ( (delta_y > 0 ? 1 : 2) + (delta_x > 0 ? 0 : 2) ) * (tan > 1? 1 : -1) ){
                case  1: //position.TOP_RIGHT:
                case  3: //position.TOP_LEFT:
                    this.swipe('DOWN');
                break;
                case -1: //-position.TOP_RIGHT:
                case -2: //-position.BOTTOM_RIGHT:
                    this.swipe('RIGHT');
                break;
                case -3: //-position.TOP_LEFT:
                case -4: //-position.BOTTOM_LEFT:
                    this.swipe('LEFT');
                break;
                case  2: //position.BOTTOM_RIGHT:
                case  4: //position.BOTTOM_LEFT:
                    this.swipe('UP');
                break;
            }
        },
        _touchStart:function(e){
            if(this.swipe && BKGM.TYPE_TOUCH==BKGM.SINGLE_TOUCH) this._startWipe=e;
            if(this.touchStart) this.touchStart(e);
        },
        _touchEnd:function(e){

            if(this.swipe && BKGM.TYPE_TOUCH==BKGM.SINGLE_TOUCH) this._swipe(e);
            if(this.touchEnd) this.touchEnd(e);
        },
        _touchDrag:function(e){
            if(this.touchDrag) this.touchDrag(e);
        },
        _mouseDown:function(e){
            if(this.swipe && BKGM.TYPE_TOUCH==BKGM.SINGLE_TOUCH) this._startWipe=e;
            if(this.mouseDown) this.mouseDown(e);
        },
        _mouseUp:function(e){
            if(this.swipe && BKGM.TYPE_TOUCH==BKGM.SINGLE_TOUCH) this._swipe(e);
            if(this.mouseUp) this.mouseUp(e);
        },
        _mouseDrag:function(e){
            if(this.mouseDrag) this.mouseDrag(e);
        }

        
    }
    var _THREADSOLD = 2; //pixels
    var checkMousePos=function(e,_this){
        var x;
        var y;
        if (e.pageX || e.pageY) { 
          x = e.pageX;
          y = e.pageY;
        }
        else { 
          x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
          y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
        } 
        x -= _this.canvas.offsetLeft;
        y -= _this.canvas.offsetTop;
        x*=_this.SCALEX;
        y*=_this.SCALEY;
        return {x:x,y:y,number:e.identifier}
    }
    
    var addMouseTouchEvent= function(_this){
        
        var checkTouch = function(e){
            e.preventDefault();
            var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            checkInteraction(touch.pageX, touch.pageY);
        };
        
        var checkMouse = function(e){
            // console.log(1)
            // if((state == 'menu' || state == 'win') && e.type != 'click') return; 
            checkInteraction(e.pageX, e.pageY);
        }

        var checkTouchEnd = function(e){
            e.preventDefault();
            var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            checkInteraction2(touch.pageX, touch.pageY);
        };
        
        var checkMouseUp = function(e){
            // console.log(1)
            // if((state == 'menu' || state == 'win') && e.type != 'click') return; 
            checkInteraction2(e.pageX, e.pageY);
        }

        $(_this.canvas).on({ 'mousedown' : checkMouse })
                        .on({ 'touchstart' : checkTouch })
                        .on({ 'mouseup' : checkMouseUp })
                        .on({ 'touchend' : checkTouchEnd });
        var checkInteraction = function(x, y){
            // Scale the X and Y to local coordinates:
            x -= parseFloat(canvas.style.marginLeft);
            y -= parseFloat(canvas.style.marginTop);
            x /= parseFloat(canvas.style.width) /600;
            y /= parseFloat(canvas.style.height)/1024;
            // var e=checkMousePos(event,_this);
            var e={x:x,y:y};
            _this._ismouseDown=true;
         //   console.log(_this.childrentList[0]._eventenable)
            var length=_this.childrentList.length - 1;

            for (var i = length; i >= 0; i--) {
                if(_this.childrentList[i]._eventenable && BKGM.checkEventActor( e,_this.childrentList[i])) {
                    _this.childrentList[i].mouseDown(e)

                    return;
                }
            };
            if(_this.states && _this.states._mouseDown) _this.states._mouseDown(e); else
                    if(_this._mouseDown) _this._mouseDown(e);
        }
        var checkInteraction2 = function(x, y){
            // Scale the X and Y to local coordinates:
            x -= parseFloat(canvas.style.marginLeft);
            y -= parseFloat(canvas.style.marginTop);
            x /= parseFloat(canvas.style.width) /600;
            y /= parseFloat(canvas.style.height)/1024;
            // var e=checkMousePos(event,_this);
            var e={x:x,y:y};
            _this._ismouseDown=false;
         //   console.log(_this.childrentList[0]._eventenable)
            var length=_this.childrentList.length - 1;

            for (var i = length; i >= 0; i--) {
                if(_this.childrentList[i]._eventenable && BKGM.checkEventActor( e,_this.childrentList[i])) {
                    _this.childrentList[i].mouseUp(e)

                    return;
                }
            };
            if(_this.states && _this.states._mouseUp) _this.states._mouseUp(e); else
                    if(_this._mouseUp) _this._mouseUp(e);
        }

        // _this.currentTouch={ state:"ENDED" };
        // window.addEventListener('touchstart', function(event) {
        //     _this._istouch=true;
        //     event.preventDefault();
        //     event.returnValue = false;
        //     var touchs=[];
        //     if(BKGM.TYPE_TOUCH===BKGM.SINGLE_TOUCH)
        //         if ((!window.navigator.msPointerEnabled && event.touches.length > 1) ||
        //         event.targetTouches > 1) {
        //           return; // Ignore if touching with more than 1 finger
        //         }
            
        //     for (var i = 0; i < event.touches.length; i++) {
                
        //         if(BKGM.TYPE_TOUCH===BKGM.SINGLE_TOUCH) {
        //             var touch = event.touches[0];
        //             var e=checkMousePos(touch,_this);
        //             var length=_this.childrentList.length - 1;
        //             for (var j = length; j >= 0; j--) {
        //                 if(_this.childrentList[j]._eventenable &&BKGM.checkEventActor( e,_this.childrentList[j])) {
        //                     if(_this.childrentList[j].touchStart) _this.childrentList[j].touchStart(e)
        //                     return;
        //                 }
        //             };
        //             if(_this.states && _this.states._touchStart) _this.states._touchStart(e); else
        //             if(_this._touchStart) _this._touchStart(e);
        //             break;
        //         }
        //         var touch = event.touches[i];
        //         var e=checkMousePos(touch,_this);
        //         touchs.push(e);
        //     }
        
        //     if(BKGM.TYPE_TOUCH===BKGM.MULTI_TOUCH){
        //         if(_this.states && _this.states._touchStart) _this.states._touchStart(touchs); else
        //         if(_this._touchStart) _this._touchStart(touchs);  
        //     }
            
        //     // console.log(touch)
                 

            
            
            
           
        // }, false);
        // window.addEventListener('touchmove', function(event) {
        //     var touchs=[];
        //     event.preventDefault();
        //     event.returnValue = false;
        //     for (var i = 0; i < event.changedTouches.length; i++) {
        //         var touch = event.changedTouches[i];
        //         if(BKGM.TYPE_TOUCH==BKGM.SINGLE_TOUCH && touch.identifier==0) {                   
        //             _this.currentTouch.state="MOVING";
        //             if(_this._touchDrag) _this._touchDrag(checkMousePos(touch,_this));
        //             break;
        //         }
        //         var touch = event.changedTouches[i];
        //         var e=checkMousePos(touch,_this);
        //         touchs.push(e);
                
        //     }
        //     if(BKGM.TYPE_TOUCH==BKGM.MULTI_TOUCH){
        //         if(_this._touchDrag) _this._touchDrag(touchs);  
        //     }
            
        // }, false);
        // window.addEventListener('touchend', function(event) {
        //     var touchs=[];
        //     event.preventDefault();
        //     event.returnValue = false;
        //     if(BKGM.TYPE_TOUCH===BKGM.SINGLE_TOUCH)
        //         if ((!window.navigator.msPointerEnabled && event.touches.length > 0) ||
        //         event.targetTouches > 0) {
        //       return; // Ignore if still touching with one or more fingers
        //     }
           
        //     for (var i = 0; i < event.changedTouches.length; i++) {
               
        //         if(BKGM.TYPE_TOUCH===BKGM.SINGLE_TOUCH) {
        //             // this._istouch=false;            
        //             // console.log(touch)  
        //              var touch = event.changedTouches[0]; 
        //             _this.currentTouch.state="ENDED";
        //             var e=checkMousePos(touch,_this);
        //             if(_this.states && _this.states.touchEnd) _this.states._touchEnd(e); else
        //             if(_this._touchEnd) _this._touchEnd(e); 
        //             break;
        //         }
        //         var touch = event.changedTouches[i]; 
        //         // console.log(touch)  
        //         var e=checkMousePos(touch,_this);
        //         touchs.push(e)
                
                             
        //     }
        //     if(BKGM.TYPE_TOUCH===BKGM.MULTI_TOUCH){
        //         if(_this.states && _this.states.touchEnd) _this.states._touchEnd(touchs); else
        //         if(_this._touchEnd) _this._touchEnd(touchs);
        //     }
            
            
            
        // }, false);
        // window.addEventListener('mousedown', function(event) {
        //     event.preventDefault();
        //     if (_this._istouch) return;
        //     var e=checkMousePos(event,_this);
        //     _this._ismouseDown=true;
        //     var length=_this.childrentList.length - 1;
        //     for (var i = length; i >= 0; i--) {
        //         if(_this.childrentList[i]._eventenable &&BKGM.checkEventActor( e,_this.childrentList[i])) {
        //             _this.childrentList[i].mouseDown(e)
        //             return;
        //         }
        //     };
        //     if(_this.states && _this.states._mouseDown) _this.states._mouseDown(e); else
        //             if(_this._mouseDown) _this._mouseDown(e);
        // }, false);
        // window.addEventListener('mousemove', function(event) {
        //     event.preventDefault();
        //     if (_this._istouch) return;
        //     var e=checkMousePos(event,_this);
        //     if(_this._ismouseDown) _this.currentTouch.state="MOVING";
        //     if(this._ismouseDown){
        //         if(_this.states && _this.states._mouseDrag) _this.states._mouseDrag(e); else
        //             if(_this._mouseDrag) _this._mouseDrag(e);
        //     } else {
        //         if(_this.states && _this.states._mouseMove) _this.states._mouseMove(e); else
        //             if(_this._mouseMove) _this._mouseMove(e);
        //     }
            
        // }, false);
        // window.addEventListener('mouseup', function(event) {
            
        //     event.preventDefault();
        //     if (_this._istouch) return;
        //     var e=checkMousePos(event,_this);
        //     _this._ismouseDown=false;
        //     _this.currentTouch.state="ENDED";
        //     // for (var i = _this.childrentList.length - 1; i >= 0; i--) {
        //     //     if(_this.childrentList[i]._eventenable &&checkEventActor( e,_this.childrentList[i])) {
        //     //         _this.childrentList[i].mouseUp(e)
        //     //         return;
        //     //     }
        //     // };
        //     if(_this.states && _this.states._mouseUp) _this.states._mouseUp(e); else
        //             if(_this._mouseUp) _this._mouseUp(e);
        // }, false);
    }
    var addKeyEvent=function(_this){
        BKGM.KEYS = {

            /** @const */ ENTER:13,
            /** @const */ BACKSPACE:8,
            /** @const */ TAB:9,
            /** @const */ SHIFT:16,
            /** @const */ CTRL:17,
            /** @const */ ALT:18,
            /** @const */ PAUSE:19,
            /** @const */ CAPSLOCK:20,
            /** @const */ ESCAPE:27,
            /** @const */ PAGEUP:33,
            /** @const */ PAGEDOWN:34,
            /** @const */ END:35,
            /** @const */ HOME:36,
            /** @const */ LEFT:37,
            /** @const */ UP:38,
            /** @const */ RIGHT:39,
            /** @const */ DOWN:40,
            /** @const */ INSERT:45,
            /** @const */ DELETE:46,
            /** @const */ 0:48,
            /** @const */ 1:49,
            /** @const */ 2:50,
            /** @const */ 3:51,
            /** @const */ 4:52,
            /** @const */ 5:53,
            /** @const */ 6:54,
            /** @const */ 7:55,
            /** @const */ 8:56,
            /** @const */ 9:57,
            /** @const */ a:65,
            /** @const */ b:66,
            /** @const */ c:67,
            /** @const */ d:68,
            /** @const */ e:69,
            /** @const */ f:70,
            /** @const */ g:71,
            /** @const */ h:72,
            /** @const */ i:73,
            /** @const */ j:74,
            /** @const */ k:75,
            /** @const */ l:76,
            /** @const */ m:77,
            /** @const */ n:78,
            /** @const */ o:79,
            /** @const */ p:80,
            /** @const */ q:81,
            /** @const */ r:82,
            /** @const */ s:83,
            /** @const */ t:84,
            /** @const */ u:85,
            /** @const */ v:86,
            /** @const */ w:87,
            /** @const */ x:88,
            /** @const */ y:89,
            /** @const */ z:90,
            /** @const */ SELECT:93,
            /** @const */ NUMPAD0:96,
            /** @const */ NUMPAD1:97,
            /** @const */ NUMPAD2:98,
            /** @const */ NUMPAD3:99,
            /** @const */ NUMPAD4:100,
            /** @const */ NUMPAD5:101,
            /** @const */ NUMPAD6:102,
            /** @const */ NUMPAD7:103,
            /** @const */ NUMPAD8:104,
            /** @const */ NUMPAD9:105,
            /** @const */ MULTIPLY:106,
            /** @const */ ADD:107,
            /** @const */ SUBTRACT:109,
            /** @const */ DECIMALPOINT:110,
            /** @const */ DIVIDE:111,
            /** @const */ F1:112,
            /** @const */ F2:113,
            /** @const */ F3:114,
            /** @const */ F4:115,
            /** @const */ F5:116,
            /** @const */ F6:117,
            /** @const */ F7:118,
            /** @const */ F8:119,
            /** @const */ F9:120,
            /** @const */ F10:121,
            /** @const */ F11:122,
            /** @const */ F12:123,
            /** @const */ NUMLOCK:144,
            /** @const */ SCROLLLOCK:145,
            /** @const */ SEMICOLON:186,
            /** @const */ EQUALSIGN:187,
            /** @const */ COMMA:188,
            /** @const */ DASH:189,
            /** @const */ PERIOD:190,
            /** @const */ FORWARDSLASH:191,
            /** @const */ GRAVEACCENT:192,
            /** @const */ OPENBRACKET:219,
            /** @const */ BACKSLASH:220,
            /** @const */ CLOSEBRAKET:221,
            /** @const */ SINGLEQUOTE:222
        };

        /**
         * @deprecated
         * @type {Object}
         */
        BKGM.Keys= BKGM.KEYS;

        /**
         * Shift key code
         * @type {Number}
         */
        BKGM.SHIFT_KEY=    16;

        /**
         * Control key code
         * @type {Number}
         */
        BKGM.CONTROL_KEY=  17;

        /**
         * Alt key code
         * @type {Number}
         */
        BKGM.ALT_KEY=      18;

        /**
         * Enter key code
         * @type {Number}
         */
        BKGM.ENTER_KEY=    13;

        /**
         * Event modifiers.
         * @type enum
         */
        BKGM.KEY_MODIFIERS= {

            /** @const */ alt:        false,
            /** @const */ control:    false,
            /** @const */ shift:      false
        };
        window.addEventListener('keydown', function(event) {
            _this._keyDown=true;
            if(_this.keyDown) _this.keyDown(event);
        },false)
    }
})();
(function(){
    BKGM.loadJS=function(url,callback){
        // Adding the script tag to the head as suggested before
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        // Then bind the event to the callback function.
        // There are several events for cross browser compatibility.
        script.onreadystatechange = callback;
        script.onload = callback;

        // Fire the loading
        head.appendChild(script);
    };
    window.extend = function (subc, superc) {
        var subcp = subc.prototype;

        // Class pattern.
        var BKGMObj = function () {
        };
        BKGMObj.prototype = superc.prototype;

        subc.prototype = new BKGMObj();       // chain prototypes.
        subc.superclass = superc.prototype;
        subc.prototype.constructor = subc;

        // Reset constructor. See Object Oriented Javascript for an in-depth explanation of this.
        if (superc.prototype.constructor === Object.prototype.constructor) {
            superc.prototype.constructor = superc;
        }

        // los metodos de superc, que no esten en esta clase, crear un metodo que
        // llama al metodo de superc.
        for (var method in subcp) {
            if (subcp.hasOwnProperty(method)) {
                subc.prototype[method] = subcp[method];             

            }
        }
    };
    BKGM.checkMouseBox=function(e,obj){          
        return (e.x>obj.x&&e.y>obj.y&&e.x<(obj.x+obj.width)&&e.y<(obj.y+obj.height));
    };
    BKGM.checkEventActor=function(e,_actor){
        var originX=_actor.x,originY=_actor.y;
        var mouseX=e.x,mouseY=e.y;
        var dx = mouseX - originX, dy = mouseY - originY;
        // distance between the point and the center of the rectangle
        var h1 = Math.sqrt(dx*dx + dy*dy);
        var currA = Math.atan2(dy,dx);
        // Angle of point rotated around origin of rectangle in opposition
        if(!_actor.rotation) _actor.rotation=0;
        var newA = currA - _actor.rotation;
        // New position of mouse point when rotated
        var x2 = Math.cos(newA) * h1;
        var y2 = Math.sin(newA) * h1;
        // Check relative to center of rectangle
        if (x2 > -0.5 * _actor.width && x2 < 0.5 * _actor.width && y2 > -0.5 * _actor.height && y2 < 0.5 * _actor.height){
            return true;
        }
        return false;
    };
    BKGM.ajax = function(obj){
        var ajax = {
            url:obj.url ? obj.url :"", //url
            type:obj.type ? obj.type : "POST",// POST or GET
            data:obj.data ? obj.data : null,
            // processData:obj.processData ? obj.processData : false,
            // contentType:obj.contentType ? obj.contentType :false,
            // cache: obj.cache ? obj.cache : true,
            success: obj.success ? obj.success : null,
            error: obj.error ? obj.error : null,
            complete: obj.complete ? obj.complete : null
        }
        
        var xhr = new XMLHttpRequest();
        // xhr.upload.addEventListener('progress',function(ev){
        //     console.log((ev.loaded/ev.total)+'%');
        // }, false);
        xhr.onreadystatechange = function(ev){
            if (xhr.status==200) {
                if(ajax.success) ajax.success(xhr.responseText);
                if (xhr.readyState==4)
                    if (ajax.complete) ajax.complete(xhr.responseText)            
            } else {
                if (ajax.error) ajax.error(xhr.responseText);
            }            
        };
        xhr.open(ajax.type, ajax.url, true);
        xhr.send(ajax.data);
    }
})();
(function(){
    BKGM.preload=function(){
        this.audios={};
        this.images={};
        this._maxElementLoad=0;
        this._elementLoaded=0;
        var self=this;
    };
    BKGM.preload.prototype.load=function(type,name,url,callback,mime){
            var self=this;
            this._maxElementLoad++;
            if (type==="image"){
                var image=new Image();
                image.src=url;
                self.images[name]=image;
                image.onload=function(){
                        self._onload();
                        if (callback) callback();
                }
            } else
            if(type==="audio"){
                var audio = new BKGM.Audio(url);
                self.audios[name]=audio;
                self._onload();
                if (callback) callback();
            } else
            if (type==="soundBase64"){
                var mime=self.mime;
                if(mime==="audio/ogg"){
                    var sound = new BKGM.Sound(soundData[url+".ogg"],mime);
                    self.audios[name]=sound;
                    sound.onloaded=function(){
                        self._onload();
                    }
                } else 
                if(mime==="audio/mp3"){
                    var sound = new BKGM.Sound(soundData[url+".mp3"],mime);
                    self.audios[name]=sound;
                    sound.onloaded=function(){
                        self._onload();
                    }
                }                  
                
            }
            return this;
        }
    BKGM.preload.prototype._onload=function(){

        this._elementLoaded++;
        if(this._maxElementLoad<=this._elementLoaded)
            this.onloadAll();
        return this;
    }
    BKGM.preload.prototype.onloadAll=function(){
        return this;
    }
})();
(function(){
    BKGM.Score = function(userID, score, userName, imageURL, leaderboardID){
        this.userID = userID;
        this.score = score || 0;
        this.userName = userName;
        this.imageURL = imageURL;
        this.leaderboardID = leaderboardID;

        return this;
    }

})();
(function(){
    BKGM.ScoreManager=function(name){
        this.name=name||"test";
        this.childrentList=[];
    }
    BKGM.ScoreManager.prototype={
        addChild : function(child){
            this.childrentList.push(child);
        },
        submitScore:function(score,callback){
           for (var i = this.childrentList.length - 1; i >= 0; i--) {
               this.childrentList[i].submitScore(score,callback);
           };

        },
        getScore:function(params,callback){
            var scores=[];
            for (var i = this.childrentList.length - 1; i >= 0; i--) {
                var score=this.childrentList[i].getScore(params,callback)
                scores.push(score);
            };
            return scores;            
        }       

    }
})();
(function(){

    BKGM.ScoreLocal=function(name){
        this.name=name;
    }
    BKGM.ScoreLocal.prototype={
        submitScore:function(score,userID){
            if(!localStorage) return 0;
            

            var name = this.name;
            var scoreItem = localStorage.getItem("BKGM."+name+".score");
            var topScore = parseInt(scoreItem) || 0;
            if(score>topScore)
                localStorage.setItem("BKGM."+name+".score",score);

        },
        getScore:function(){
            if(localStorage){
                var name = this.name;
                var scoreItem = localStorage.getItem("BKGM."+name+".score");
                var score = parseInt(scoreItem) || 0;

                return new BKGM.Score("me", score);
            } else {
                return new BKGM.Score("me", 0);;
            }
            
        }
       

    }
     
        
       
})();
(function(){
    BKGM.Ads=function(adunit){
        this.adunit=adunit;
        mopub_ad_unit = adunit;
        mopub_ad_width = this.width; // optional
        mopub_ad_height = this.height; // optional
    }
    BKGM.Ads.prototype={
        width:320,
        height:50,
        init:function(adunit){
           
            return this;
        },
        setSize:function(w,h){
            this.width=w;
            this.height=h;
            mopub_ad_width = this.width; // optional
            mopub_ad_height = this.height; // optional
            return this;
        },
        setKeyword:function(arr){
            this.key=arr;
            mopub_keywords = arr; // optional
            return this;
        }

    }
     
        
       
})();

var soundData = soundData||{};
(function(){
	BKGM.SoundManager = {
		initialize: function(audios){
			this.audios = audios;
			this.channelLength = 16;
			this.playOnceChannel = [];
			this.playLoopChannel = [];
			this.volumeOnce = 1;
			this.volumeLoop = 1;
			return this;
		},
		soundNotFound: function(soundId){
			console.error(soundId + " not found!!");
			return this;
		},
		playOnce: function(soundId,endCallback){
			var self = this;
			var audio = this.audios[soundId];
			if(!audio) return this.soundNotFound(soundId);
			var playOnceChannel = this.playOnceChannel;
			playOnceChannel.push(audio);
			if(playOnceChannel.length>this.channelLength){
				var firstAudio = playOnceChannel[0];
				firstAudio.stopFirst();
				playOnceChannel.shift();
			}
			audio.play(function(){
				playOnceChannel.splice(playOnceChannel.indexOf(audio),1);
				if(endCallback) endCallback();
			});
			this.setVolumeOnce();
			return this;
		},
		playLoop: function(soundId){
			var audio = this.audios[soundId];
			if(!audio) return this.soundNotFound(soundId);
			this.playLoopChannel.push(audio);
			audio.repeat();
			this.setVolumeLoop();
			return this;
		},
		resume: function(soundId){
			var audio = this.audios[soundId];
			audio.play();
			return this;
		},
		pause: function(soundId){
			var audio = this.audios[soundId];
			audio.pause();
			return this;
		},
		stop: function(soundId){
			var audio = this.audios[soundId];
			audio.stopFirst();
		},
		endSound: function(){
			this.endSoundOnce();
			this.endSoundLoop();
			return this;
		},
		endSoundOnce: function(){
			for(var i=0;i<this.playOnceChannel.length;i++){
				this.playOnceChannel[i].stop();
			}
			this.playOnceChannel = [];
			return this;
		},
		endSoundLoop: function(){
			for(var i=0;i<this.playLoopChannel.length;i++){
				this.playLoopChannel[i].stop();
			}
			this.playLoopChannel = [];
			return this;
		},
		setVolume: function(value){
			this.setVolumeOnce(value);
			this.setVolumeLoop(value);
			return this;
		},
		
        setVolumeOnce: function(value){
            if(value<0 || value>1) return;
            this.volumeOnce = (typeof(value) == "undefined")?this.volumeOnce:value;
            var playOnceChannel = this.playOnceChannel;
            for(var i=0;i<playOnceChannel.length;i++){
                playOnceChannel[i].setVolume(this.volumeOnce);
            }
            return this;
        },
        setVolumeLoop: function(value){
            if(value<0 || value>1) return;
            this.volumeLoop = (typeof(value) == "undefined")?this.volumeLoop:value;
            var playLoopChannel = this.playLoopChannel;
            for(var i=0;i<playLoopChannel.length;i++){
                playLoopChannel[i].setVolume(this.volumeLoop);
            }
            return this;
        }
	}
})();

(function(){
    // var BKGM = BKGM||{};
    // var s1 = new BKGM.Audio().setAudio('1');
    function getPhoneGapPath() {

        var path = window.location.pathname;
        path = path.substr( path, path.length - 10 );
        return path;

    };
    BKGM.Audio = function(url){
        this.url = '/android_asset/www/' +url;
        this.media = new Media('/android_asset/www/' +url);
        return this;
    }
    BKGM.Audio.prototype= {

        audio   : null,
		playing : false,
        setAudio : function( source ,callback, isBase64, mimeType) {
            var self=this;
            if(BKGM._isCordova){
                this.src = getPhoneGapPath() + "/" + source;
                if (callback && !self.call) {callback();self.call=1;}
				this.initCordovaAudio();
            }else {
				if(isBase64){
					this.audio= new Audio();
					this.src = "data:audio/"+mimeType+";base64,"+ source;
					this.audio.src = this.src;
				}
				else{
					this.src = source;
					this.audio= new Audio(source);
				}
				
				this.audioList = [];
                this.audio.preload = 'auto';
				
				
                this.audio.load();
					
				this.loadComplete = false;
				setTimeout(function(){
					if(self.loadComplete) return;
					var audio = self.audio;
					(audio.dispatchEvent||audio.fireEvent)(new Event("canplaythrough"));		// cho load xong luon neu cho qua lau
				},10000);
                this.audio.addEventListener('canplaythrough', function() { 
                   self._onload();
				   self.loadComplete = true;
                   if (callback && !self.call) {callback();self.call=1;}
                }, false);
                this.audio.addEventListener("error", function(e) {
                    self._onload(e.currentTarget.error);
                   if (callback && !self.call) {callback();self.call=1;}
                });
            }
            return this;
        },
		initCordovaAudio: function(){
			var src=this.src;
			// var src='http://static.weareswoop.com/audio/charlestown/track_1.mp3';

			// Create Media object from src
			if(!this.audio)this.audio = new Media(src, function(){
			   self._onload();
			   
			 }, function(error){});
		},
        forceplay:function(){
           
            if(BKGM._isCordova){
                // Play audio
                this.stop();
                this.audio.play();

                
            } else {

                 this.stop();
                 this.audio.load();
                 this.play();
            }
            
            return this;
        },
        play : function(loop) {
			// var self = this;
			// var audio = this.playing?this.audio.cloneNode():this.audio;
			// this.playing = true;
			// this.audioList.push(audio);
			// audio.loop = false;
			// audio.playing = true;
			// audio.play();
			// audio.addEventListener('ended', function() {
			// 	if(audio.playing){
			// 		audio.playing = false;
			// 		audio.currentTime = 0;
			// 		var index = self.audioList.indexOf(audio);
			// 		if(index == 0) self.playing = false;
			// 		self.audioList.splice(index,1);
			// 		if(endCallback) endCallback();
			// 	}
			// }, false);
            this.media.play();  
			return this;
        },
        makeLoop : function(){
            var self = this;
            this.media = new Media(this.url, null, null, function (status) {
                if (status === Media.MEDIA_STOPPED) self.media.play();
            });
        },
		repeat: function(){
			this.stop();
			var audio = this.audio;
			this.audioList.push(audio);
			audio.loop = true;
			audio.play();
			return this;
		},
        pause : function() {
			// this.audio.pause();
			// this.playing = false;
            this.media.pause();      
            return this;
        },
		setVolume: function(value){
			for(var i=0;i<this.audioList.length;i++){
				this.audioList[i].volume = value;
			}
			return this;
		},
		stopFirst: function(){
            if(BKGM._isCordova && this.audio) {
                this.audio.stop();
            } else {
				var audio = this.audioList[0];
				audio.currentTime = 0;
				audio.pause();
				this.audioList.shift();
			}
		},
        stop : function(){
            if(BKGM._isCordova && this.audio) {
                this.audio.stop();
            } else {
				for(var i=0;i<this.audioList.length;i++){
					var audio = this.audioList[i];					
					audio.currentTime=0;
					audio.pause();
				}
				this.audioList = [];
            }
            return this;
        },
        _onload:function(){
            return this;
        }

    };
})();

(function() {
	
var checkCanPlay = function (src,cb) {
	var audio = new Audio();
	var mime = src.split(";")[0];
	audio.id = "audio";
	audio.setAttribute("preload", "auto");
	audio.setAttribute("audiobuffer", true);
	audio.addEventListener("canplaythrough", function() {
		cb(mime);
	}, false);
	audio.src = "data:" + src;
	document.body.appendChild(audio);
};
BKGM.audioDetect = function(callback) {
	var mime;
	var isSupport=false;
	// Check xem thẻ audio có hỗ trợ ko
	if (typeof(Audio) === "undefined") return callback(mime);
	// Nếu có thẻ audio thì tạo mới aduio
	var audio = new Audio();
	// Néu audio ko có kiểm tra type thì callback
	if (typeof(audio.canPlayType) === "undefined") return callback(mime);
	// Kiểm tra xem có đọc được file ogg (vorbis) hay mp3 (mpeg) không
	var ogg = audio.canPlayType('audio/ogg; codecs="vorbis"');
	ogg = (ogg === "probably" || ogg === "maybe");
	var mp3 = audio.canPlayType('audio/mpeg');
	mp3 = (mp3 === "probably" || mp3 === "maybe");
	// Không hỗ trợ cả file mp3 lẫn ogg
	if (!ogg && !mp3) {
		callback(mime);
		return;
	}
	// callback nếu hỗ trợ file gì đó
	var cb=function (m) {
		mime=m;
		callback(mime);
		isSupport=true;
		clearTimeout(timeout);
	}
	
	if (ogg) checkCanPlay("audio/ogg;base64,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",cb);
	if (mp3) checkCanPlay("audio/mp3;base64,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",cb);
	
	// hoặc hỗ trợ mp3 hoặc ogg
	var timeout = setTimeout(function(){
		if(!isSupport) callback(mime);
	},5000)
};

})();

(function(){
if(window.AudioContext || window.webkitAudioContext){
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	context = new AudioContext();
}
// function playSound(buffer) {
//   var source = context.createBufferSource(); // creates a sound source
//   source.buffer = buffer;                    // tell the source which sound to play
//   source.connect(context.destination);       // connect the source to the context's destination (the speakers)
//   source.start(0);                           // play the source now
//                                              // note: on older systems, may have to use deprecated noteOn(time);
// }
BKGM.Sound =function(source,mime) {
	var self = this;
	if(window.context){
		self.source = source;
		self.isLoaded = false;
		var getSound = Base64Binary.decodeArrayBuffer(self.source);
		
		context.decodeAudioData(getSound, function(buffer) {
				self.isLoaded = true;
				self.buffer=buffer;	
				self.onloaded();				
			}
		);
	} else {
		var audio = new Audio();
		audio.setAttribute("preload", "auto");
		audio.setAttribute("audiobuffer", true);
		if(mime=="audio/ogg")
			audio.src="data:audio/ogg;base64,"+source;
		else 
			audio.src="data:audio/mp3;base64,"+source;
		audio.addEventListener('ended', function() { 
                if(self.ended) self.ended();
            }, false);
        audio.addEventListener('canplaythrough', function() { 
           self.onloaded();
        }, false);
        self.audio=audio;
	}
	
	// console.log(getSound)
}

BKGM.Sound.prototype={
	currentTime: 0,
	startTime: 0,
	play : function(endCallback){
		this.playSegment(false,this.currentTime);
		this.ended = endCallback;
		return this;
	},
	repeat: function(){
		this.playSegment(true,0);
		return this;
	},
	pause: function(){
		if(window.AudioContext){
			if(this.src) {
				this.currentTime += this.src.context.currentTime - this.startTime;
				this.src.stop();
			}
		}
		else{
			this.audio.pause();
		}
	},
	stop: function(){
		if(window.AudioContext){
			if(this.src) {
				this.currentTime = 0;
				this.src.stop();
			}
		}
		else{
			this.audio.currentTime=0;
			this.audio.pause();
		}
		return this;
	},
	getCurrentTime: function(){
		if(window.AudioContext){
			if(this.src) return this.src.context.currentTime;
		}
		else{
			return this.audio.currentTime;
		}
	},
	getDuration: function(){
		if(window.AudioContext){
			if(this.buffer) return this.buffer.duration;
		}
		else{
			return this.audio.duration;
		}
	},
	setVolume: function(value){
		if(window.AudioContext){
			if(this.src) this.gainNode.gain.value = value;
		}
		else{
			audio.volume = value;
		}
	},
	setEndCallback: function(endCallback){
		this.ended = endCallback;
		return this;
	},
	playSegment : function (loop,time,timeend) {
		var self=this;
		// Nếu sound đã load
		if(window.AudioContext){
			this.startTime = context.currentTime;
			var src = context.createBufferSource();
			src.buffer = self.buffer; 
			this.gainNode = context.createGain();                                     // create a gain node in order to create the fade-out effect when the mouse is released
			src.connect(this.gainNode);
			this.gainNode.connect(context.destination);                                     // play back the decoded buffer
			src.loop = loop;                                                 // set the sound to loop while the mouse is down
			this.src = src;
			src.start(0,time%this.getDuration());
			if(timeend) src.stop(timeend);			
			src.onended=function(){
				if(self.ended) self.ended();
			};
		} else {
			this.audio.currentTime = time;
			this.audio.loop = loop;
			this.audio.play();
		}
		return this;
	},
	ended: function(){
		return this;
	},
	onloaded : function(){
		return this;
	}

}
})();

var Base64Binary = {
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	
	/* will return a  Uint8Array type */
	decodeArrayBuffer: function(input) {
		var bytes = (input.length/4) * 3;
		var ab = new ArrayBuffer(bytes);
		this.decode(input, ab);
		
		return ab;
	},
	
	decode: function(input, arrayBuffer) {
		//get last chars to see if are valid
		var lkey1 = this._keyStr.indexOf(input.charAt(input.length-1));		 
		var lkey2 = this._keyStr.indexOf(input.charAt(input.length-2));		 
	
		var bytes = (input.length/4) * 3;
		if (lkey1 == 64) bytes--; //padding chars, so skip
		if (lkey2 == 64) bytes--; //padding chars, so skip
		
		var uarray;
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		var j = 0;
		
		if (arrayBuffer)
			uarray = new Uint8Array(arrayBuffer);
		else
			uarray = new Uint8Array(bytes);
		
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		
		for (i=0; i<bytes; i+=3) {	
			//get the 3 octects in 4 ascii chars
			enc1 = this._keyStr.indexOf(input.charAt(j++));
			enc2 = this._keyStr.indexOf(input.charAt(j++));
			enc3 = this._keyStr.indexOf(input.charAt(j++));
			enc4 = this._keyStr.indexOf(input.charAt(j++));
	
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
	
			uarray[i] = chr1;			
			if (enc3 != 64) uarray[i+1] = chr2;
			if (enc4 != 64) uarray[i+2] = chr3;
		}
	
		return uarray;	
	}
}