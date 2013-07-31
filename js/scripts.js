var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() { app.bieberBucket() },
    
    bieberBucket: function() {
    	// needed for webkit browsers to wait until images have loaded
    	if (document.readyState != "complete") {
			setTimeout( arguments.callee, 100 );
			return;
		}
		
		// init vars
		var level = 0;
		var score = 0;
		var time = 10;
		var timerInt;
		var levelObj = $('#level');
		var scoreObj = $('#score');
		var timeObj = $('#time');
    
    	// init stage
    	var stage = $("#stage");
    	var bgImg = $("#bgImg");
    	//console.log("bgImg height = " + bgImg.height());
    	stage.height( stage.width() * bgImg.height() / bgImg.width() );
    	
    	// center stage vertically
    	stage.css({
	    	'margin-top' : ( ($(document).height() - stage.height()) * 0.5 ) + "px"
    	});
    	
		var stageAngle = 0.2; // angle of path bucket runs along
		
        // bucket obj
        function bucket( obj ) {
	    	var bucket = obj;
	    	var myWidth = stage.width() * 0.5;
	    	var myHeight;
	    	
	    	this.getX = getX;
	    	this.getY = getY;
	    	this.getHitCoords = getHitCoords;
	    	this.reset = reset;
	    	this.updatePosFromAccel = updatePosFromAccel;
	    	
	    	// get x position
	    	function getX() {
		    	return parseFloat( bucket.css("left").replace("px","") );
	    	}
	    	// get y position
	    	function getY() {
		    	return parseFloat( bucket.css("top").replace("px","") );
	    	}
	    	// get position relative to stage of where current bucket hit area is
	    	function getHitCoords() {
		    	return {
			    	"top" : getY() + (myHeight * 0.45),
			    	"right" : getX() + (myWidth * 0.9),
			    	"bottom" : getY() + (myHeight * 0.9),
			    	"left" : getX() + (myWidth * 0.1),
		    	}
	    	}
	    	// reset bucket to original position
	    	function reset() {
			    bucket.width( myWidth );
		        bucket.css({
			        'left' : ( ( stage.width() - bucket.width() ) * 0.5 ) + "px",
			        'top' : ( ( stage.height() - bucket.height() ) * 1.3 ) + "px"
		        });
		        if (!myHeight) {
			    	myHeight = bucket.height();  
		        }
	    	}
	    	// set new bucket position from accelerometer reading
			function updatePosFromAccel( a ) {
				var bucketNewX = getX() + ( a.x * Math.cos( stageAngle ) * 30 );
				var bucketNewY = getY() + ( a.x * Math.sin( stageAngle ) * 30 );
				
				bucket.css({
					"left" : bucketNewX + "px",
					"top" : bucketNewY + "px",
				});
				//console.log( "updatePosFromAccel: a.x = " + a.x );
			}
        }
    
		// init bucket obj
        var myBucket = new bucket( $("#bucket") );
        myBucket.reset();
        
        // make star obj
        function star( obj ) {
        	var star = obj;
       		var stopBouncingNow = false;
       		
	        star.width( stage.width() * 0.5726 );
	        star.css({
		       'left' : ( stage.width() * .2 ) + "px",
		       'top' : ( stage.height() * 0.05 ) + "px"
	        });
	        
	        // declare methods
	        this.bounce = bounce;
	        this.stop = stop;
	        this.getX = getX;
	        this.getY = getY;
	        this.getDongPos = getDongPos;
	        
	        // return coordinates
	        function getX() {
	        	// account for jump effect
	        	if ( star.parent(".ui-effects-wrapper").length > 0 ) {
		        	var targetObj = star.parent(".ui-effects-wrapper");
	        	} else {
		        	var targetObj = star;
	        	}
		        return parseFloat( targetObj.css("left").replace("px","") );
	        }
	        function getY() {
		        return parseFloat( star.css("top").replace("px","") );
	        }
	        
	        // return starting point (on stage) of pee origin
	        function getDongPos() {
	        	//console.log( "getDongPos: star height = " + star.height() + ", getY = " + getY());
	        	//console.log( "getDongPos: star width = " + star.width() + ", getX = " + getX());
		        return {
			        'x' : ( star.width() * 0.5 ) + getX(),
			        'y' : ( star.height() * 0.7 ) + getY()
		        };
	        }
	        
	        // make star bounce
	        function bounce() {
	        	if (stopBouncingNow) {
		        	stopBouncingNow = false;
		        	return;
	        	}
				var a = ( Math.random() - 0.5 ) * 40;
	        
	        	var starX = parseFloat( star.css("left").replace("px","") );
				var starY = parseFloat( star.css("top").replace("px","") );
				
				var starNewX = starX + ( a * Math.cos( stageAngle ) );
				var starNewY = starY + ( a * Math.sin( stageAngle ) );
				
				star
				.effect(
					"bounce",
					{
						"distance" : 20,
						"times" : 1
					}
				)
				.animate({
					'left' : starNewX + "px",
					'top' : starNewY + "px"
				}, 500, "swing", arguments.callee)
				;
	        }
	        
	        function stop() {
		        stopBouncingNow = true;
	        }
	    }
	    
	    // init pop star obj
        var myStar = new star( $("#star") );
        myStar.bounce();
	    
	    // start accelerometer checker
	    var accelCheckInt = 200;
	    var watchID = navigator.accelerometer.watchAcceleration(accelGo, accelOnError, { frequency: accelCheckInt });
		
		// onError: Failed to get the acceleration
		function accelOnError() {
		    alert('Accelerometer Error!');
		    navigator.accelerometer.clearWatch(watchID);
		}
		
		// 
		function accelGo( a ) {
			myBucket.updatePosFromAccel( a );
		}
		
		// init drops
		var dropsArr = [];
		var dropCount = 0;
		var dropsInt = setInterval( function() {
			dropsArr.push( new drop( dropCount ) );
			console.log( "creating new drop " + dropCount );
			dropCount++;
			updateDrops();
		}, 200 );
		
		function drop( n ) {
			var dongPos = myStar.getDongPos();
			var dropNum = n;
			var obj = $("<div class='drop' id='drop" + dropNum + "' />");
			var active = true;
			
			this.destroy = destroy;
			this.initDrop = initDrop;
			this.isActive = isActive;
			this.isInCoords = isInCoords;
			this.getX = getX;
			this.getY = getY;
			this.getDropNum = getDropNum;
			
			initDrop();
			
			// remove drop
			function destroy() {
				obj.remove();
				active = false;
			}
			// get drop number
	    	function getDropNum() {
		    	return dropNum;
	    	}
			// get x position
	    	function getX() {
		    	return parseFloat( obj.css("left").replace("px","") );
	    	}
	    	// get y position
	    	function getY() {
		    	return parseFloat( obj.css("top").replace("px","") );
	    	}
			// position drop on stage, animate
			function initDrop() {
				obj.css({
					'left' : dongPos.x + "px",
					'top' : dongPos.y + "px",
					'height' : ( stage.width() * 0.01 ) + "px",
					'width' : ( stage.width() * 0.01 ) + "px"
				});
				$("#stage").append(obj);
				
				obj.animate({
					'top' : stage.height() + "px"
				}, 1000,'easeInCubic', function() {
					updateScore(-10);
					destroy();
				});
			}
			// test if ddrop is active (undestroyed)
			function isActive() {
				return active;
			}
			// test if drop is within given coordinates
			function isInCoords( coords ) {
				// get current drop position
				var dropX = getX();
				var dropY = getY();
				
				console.log("isInCoords: x = " + getX() + ", y = " + getY() + ", coords = " + coords.top + ", " + coords.right + ", " + coords.bottom + ", " + coords.left );
				
				// test if parameter is valid
				if (!coords || !coords.hasOwnProperty("top") || !coords.hasOwnProperty("right") || !coords.hasOwnProperty("bottom") || !coords.hasOwnProperty("left") ) {
					return false;
				}
				// test drop position versus coordinates
				if ( dropY > coords.top && dropY < coords.bottom && dropX > coords.left && dropX < coords.right ) {
					return true;
				} else {
					return false;
				}
			}
		}
		
		
		// score and remove drops in bucket hit zone
		function updateDrops() {
			//console.log( "scoreDropsInBucket: bucket hit zone = ");
			//console.dir( myBucket.getHitCoords() );
			
			var updatedDropsArr = [];
			// cycle through drops, test active (undestroyed) drops
			for ( var i = 0; i < dropsArr.length; i++ ) {
				if ( dropsArr[i].isActive ) {
					if ( dropsArr[i].isInCoords( myBucket.getHitCoords() ) ) {
						// if drop is in hit zone, score it and destroy it
						updateScore(20);
						dropsArr[i].destroy();
						console.log("drop " + dropsArr[i].getDropNum() + " HITTTTTT!!!!!");
					} else {
						// if drop is not in hit zone, keep it in the active drops array
						updatedDropsArr.push( dropsArr[i] );
						console.log("drop " + dropsArr[i].getDropNum() + " is active but not in hit zone! ");
					}
				}
			}
			// update drops array with only active (undestroyed) drops
			dropsArr = updatedDropsArr;
		}
		
		// update score variable and display
		function updateScore(n) {
			score += n;
			scoreObj.text( score );
		}
		
		// init timer - timer checks for object interactions
		initTimer();
		
		function initTimer() {
			time = 5;
			level++;
			timerInt = setInterval( tick, 1000 );
			timeObj.text(time);
		}
		function tick() {
			time--;
			if (time <= 0 ) {
				levelEnd();
			} else if (time <= 5) {
				timeObj.addClass('alert');
			} else {
				timeObj.removeClass('alert');
			}
			timeObj.text(time);
		}
		function levelEnd() {
			myStar.stop();
			clearInterval(timerInt);
			clearInterval(dropsInt);
		}

    }
}